const { SignJWT, jwtVerify } = require("jose");
const { cookies } = require("next/headers");
const { NextRequest, NextResponse } = require("next/server");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

async function encrypt(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1 hour from now")
        .sign(key);
}

async function decrypt(input) {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}


const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

// MongoDB setup
let client;
async function connectToMongoDB() {
    if (!client) {
        client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
    }
    return client.db();
}

async function login(formData) {
  try {
      // Get the email and password from formData
      const email = formData.get("email");
      const password = formData.get("password");

      // Connect to MongoDB
      const db = await connectToMongoDB();

      // Find the user by email in the database
      const user = await db.collection("users").findOne({ email });

      if (user) {
          // Compare the provided password with the stored hashed password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          
          if (isPasswordValid) {
              // Create a session object
              const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration time
              const session = await encrypt({ user, expires });

              // Save the session in a cookie
              cookies().set("session", session, {
                  expires,
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "lax",
              });

              // Return success status
              return { success: true };
          } else {
              return { error: "Invalid password" };
          }
      } else {
          return { error: "User not found" };
      }
  } catch (error) {
      console.error("Login error:", error);
      return { error: "An unexpected error occurred. Please try again." };
  }
}


async function signup(formData) {
    try {
        // Extract name, email, and password from the form data
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");

        // Connect to MongoDB
        const db = await connectToMongoDB();
        const usersCollection = db.collection("users");

        // Check if the email already exists in the database
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            throw new Error("Email is already in use");
        }

        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user object
        const newUser = {
            name,
            email,
            password: hashedPassword,
        };

        // Insert the new user into the "users" collection
        await usersCollection.insertOne(newUser);

        const expires = new Date(Date.now() +  60 * 60 * 1000);
        const session = await encrypt({ newUser, expires });
    
        // Save the session in a cookie
        cookies().set("session", session, { expires, httpOnly: true });

        // Return a success message or response
        return { message: "User created successfully" };
    } catch (error) {
        // Handle errors and return an appropriate message
        console.error("Signup error:", error);
        throw error;
    }
}

async function logout() {
    // Destroy the session
    cookies().set("session", "", { expires: new Date(0) });
}

async function getSession() {
    const session = cookies().get("session")?.value;
    console.log("session", session);
    if (!session) return null;
    return await decrypt(session);
}

async function updateSession(request) {
    const session = request.cookies.get("session") ?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 10 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: "session",
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });
    return res;
}

module.exports = {
    encrypt,
    decrypt,
    login,
    logout,
    getSession,
    updateSession,
    signup
};