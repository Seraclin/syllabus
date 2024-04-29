import React from "react";
import { getSession,logout } from "@/_utils/lib";
import { redirect } from "next/navigation";

const HeaderBar = async () => {
    const session = await getSession();
    return (
    <header className="title-bar">
        <div className="title-flex-container">
          <a href="/"><img src="/eSyllabus.png"></img></a>
          <h1 className='title-bar-text'><a href="/" style={{ textDecoration: 'none', color: 'inherit', ':hover': 'none !important' }}>eSyllabus</a></h1>
          <div className="right-links">
            <a href="https://github.com/Seraclin/syllabus" style={{ marginRight: '1rem' }}>About</a>
            <a href="https://forms.gle/hTtoYtwpizd8zGLH7" style={{ marginRight: '1rem' }}>Feedback</a>
            {session ? (
              <>
                <p>
                  {/* Logged in as {session.user.name} */}
                  Logged in as {session.newUser ? session.newUser.name : session.user.name}

                  {/* {JSON.stringify(session)} */}
                </p>
                <form action={async () => {
                  "use server";
                  await logout();
                  redirect("/");}}>
                  <button type="submit">Logout</button>
                </form>
              </>
            ) : (
              <>
                <a href='/login' style={{ marginRight: '1rem' }}>Login</a>
                <a href='/signup' style={{ marginRight: '1rem' }}>Signup</a>
              </>
            )}
          </div>
        </div>
    </header>
    );
  };
  
  export default HeaderBar;