// API route for POST from form data
import { writeFile, mkdir, access } from 'fs/promises'
import { NextRequest, NextResponse } from "next/server";
import { extname, join } from 'path';
import { cookies } from 'next/headers';


export async function POST(request) {
    // Import the built-in crypto module
    const crypto = require('crypto');
    
    // This basically does the same as the previous server implementation but instead via HTTP
    const data = await request.formData();
    const files = data.getAll('file'); // get all files from input

    // ==== Cookie stuff with specific user's folder ====
    const cookieStore = cookies();
    let userId = "";
    // Check if cookie 'userId' attribute exists
    if (cookieStore.has('userId')){
        userId = cookieStore.get('userId').value;
        console.log("Cookie already exists:", userId);
        if (!userId){
            // Just in case the cookie userId field ends up 'undefined'
            console.log("Error: Cookie undefined:", userId);
            userId = crypto.randomUUID();
        }
    }
    else {
        // If userId cookie is not present, generate a new UUID
        userId = crypto.randomUUID();
        // userId = '123' // TODO: debug cookie
        console.log("New user cookie:", userId);
    }

    const MAX_AGE = 60*60*24*7; // # of seconds in 1 week
    const setCookieHeader = `userId=${userId}; Max-Age=${MAX_AGE}; Path=/;`;
    const userFolderPath = join(process.cwd(), 'src', 'app', 'api', 'upload', 'user_files', userId); // Path to user's folder
    console.log("User's file path:", userFolderPath);

    // Create user's folder if it doesn't exist (non-recursive)
    try {
        // Check if the directory exists and is accessible
        await access(userFolderPath);
        console.log(`User folder '${userId}' already exists.`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Directory doesn't exist, create it
            try {
                await mkdir(userFolderPath);
                console.log(`User folder '${userId}' created successfully.`);
            } catch (mkdirError) {
                console.error('Error creating user folder:', mkdirError);
                return NextResponse.json({ error: 'Internal server error. Upload API' }, { status: 500 });
            }
        } else {
          // Other access errors
          console.error('Error accessing user folder:', error);
          return NextResponse.json({ error: 'Internal server error. Upload API' }, { status: 500 });
        }
    }

    //===== End of cookie stuff =====

    // Error checking
    if(!files || files.length == 0) {
        // No file found error
        console.error("No file found.");
        return NextResponse.json({ error: 'No files found.' }, { status: 400, headers: { 'Set-Cookie': setCookieHeader } });
    }

    const successResponses = [];
    const errorResponses = [];
    for(const file of files){
        // Check file extension just to be sure
        const fileExtension = extname(file.name).toLowerCase();
        if (fileExtension !== '.pdf') {
            console.error("Invalid file type. Please upload a PDF.");
            errorResponses.push({ success: false, error: 'File type must be PDF', fileName: file.name });
            continue;
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes); // With the file in the buffer, you can do whatever
        
        /* Old method of public folder without cookies
        const rootDir = process.cwd();
        const path = join(rootDir, 'public', 'tmp', file.name);
        await writeFile(path, buffer)
        console.log(`open ${path} to see the uploaded file`)
        successResponses.push({ success: true, fileName: file.name });*/
        const filePath = join(userFolderPath, file.name); // Path to save the file in user's folder

        try {
            await writeFile(filePath, buffer);
            successResponses.push({ success: true, fileName: file.name });
        } catch (error) {
            console.error('Error writing file:', error);
            errorResponses.push({ success: false, error: 'Error writing file', fileName: file.name });
        }
    }
    // Keep track of all successful and unsuccessful responses for debugging purposes
    const response = {
        successResponses,
        errorResponses
    };
    // return NextResponse.json(response)
    return NextResponse.json(response, { status: 200, headers: { 'Set-Cookie': setCookieHeader } });
}