import { redirect } from 'next/navigation';
import { login } from '@/_utils/lib';
import '../globals.css'; // Adjust the path according to your file structure
import Link from 'next/link'; // Import Link component from Next.js
import HeaderBar from '@/components/HeaderBar';

export default async function Page() {
  return (
    <>
    <HeaderBar></HeaderBar>
    <section className="login-section">
      <h1>Login</h1>
      <form
        className="login-form"
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
        <input type="password" placeholder="Password" name="password" id="password" />
        <button type="submit">Login</button>
      </form>
      <div className="nav-link"><Link href="/">Go back to home</Link> </div>
      <div className="nav-link"><Link href="/signup">Sign up</Link> </div>
    </section>
  </>
  );
}


