import { redirect } from "next/navigation";
import { getSession, signup } from "@/_utils/lib";
import "../globals.css"; // Adjust the path according to your file structure

export default async function Page() {
  return (
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
    </section>
  );
}
