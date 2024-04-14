/* The Homepage, view locally with npm run dev, delete .next folder locally if not working */
import UploadButton from "@/components/UploadButton"
import CalendarEvent from "@/components/CalendarEvent"  // TODO delete this
import DownloadButton from "@/components/DownloadButton"  // TODO edit this
import { getSession,logout } from "@/_utils/lib";
import { redirect } from "next/navigation";



export default async function Home() {
  const session = await getSession();
  return (
    <>
      <header className="title-bar">
        <div className="title-container">
          <h1 className='title-bar-text'>eSyllabus</h1>
        </div>
        <div className="right-links">
          <a href="https://github.com/Seraclin/syllabus" style={{ marginRight: '1rem' }}>About</a>
          {session ? (
            <>
              <p>
                Logged in as {session.newUser.name}
                {/* {JSON.stringify(session)} */}
              </p>
              <form
        action={async () => {
          "use server";
          await logout();
          redirect("/");
        }}
      >
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
      </header>
      <p>Please upload a PDF to get started.</p>
      <div>
        <UploadButton />
        <DownloadButton fileName="test1.ics"/>
        <CalendarEvent></CalendarEvent>
      </div>
    </>
  )
}