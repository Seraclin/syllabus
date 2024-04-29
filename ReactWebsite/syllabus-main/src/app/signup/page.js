import { redirect } from "next/navigation";
import { getSession, signup } from "@/_utils/lib";
import "../globals.css"; // Adjust the path according to your file structure
import Link from 'next/link'; // Import Link component from Next.js
import HeaderBar from "@/components/HeaderBar";


export default async function Page() {
  return (
    <>
    <HeaderBar></HeaderBar>
    <section className="signup-section">
      <h1>Signup</h1>
      <form
        className="signup-form"
        action={async (formData) => {
          "use server";
          await signup(formData);
          redirect("/");
        }}
      >
        <input type="text" placeholder="Name" name="name" id="name" />
        <input type="email" placeholder="Email" name="email" id="email" />
        <input type="password" placeholder="Password" name="password" id="password" />
        <button type="submit">Signup</button>
      </form>
      <div className="nav-link"><Link href="/">Go back to home</Link> </div>
      <div className="nav-link"><Link href="/login">Login</Link> </div>
    </section>
  </>
  );
}
