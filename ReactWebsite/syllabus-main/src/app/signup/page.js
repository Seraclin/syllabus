import { redirect } from "next/navigation";
import { getSession, signup } from "@/_utils/lib";

export default async function Page() {
  return (
    <section>
        <h1>Signup</h1>
      <form
        action={async (formData) => {
          "use server";
          await signup(formData);
          redirect("/");
        }}
      >
        <input type= "text" placeholder="Name" name="name" id="name" />
        <br />
        <input type="email" placeholder="Email" name="email" id="email" />
        <br />
        <input type="password" placeholder="Password" name="password" id="password" />
        <br/>
        <button type="submit">signup</button>
      </form>
    </section>
  );
}
