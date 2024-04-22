import { redirect } from 'next/navigation';
import { login } from '@/_utils/lib';
import '../globals.css'; // Adjust the path according to your file structure

export default async function Page() {
  return (
    <section className="login-section">
      <h1>Login</h1>
      <form
        action={async (formData) => {
          "use server";
          const newResult = await login(formData);
          if (!newResult.error) { // Check for successful login
            redirect('/');
          } else{
             console.error("Login error:", newResult.error);

          }
        }}
      >
        <input type="email" placeholder="Email" name="email" id="email" />
        <br />
        <input type="password" placeholder="Password" name="password" id="password" />
        <br />
        <button type="submit">Login</button>
      </form>
    </section>
  );
}
