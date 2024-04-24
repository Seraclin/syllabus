/* The Homepage, view locally with npm run dev, delete .next folder locally if not working */
import UploadButton from "@/components/UploadButton"
import CalendarEvent from "@/components/CalendarEvent"  // TODO delete this
import { getSession,logout } from "@/_utils/lib";
import { redirect } from "next/navigation";
import UserFilesList from "@/components/UserFiles";
import GenerateButton from "@/components/GenerateButton";


export default async function Home() {
  const session = await getSession();
  return (
    <>
      <header className="title-bar">
        <div className="title-flex-container">
          <img src="/eSyllabus.png"></img>
          <h1 className='title-bar-text'>eSyllabus</h1>
          <div className="right-links">
            <a href="https://github.com/Seraclin/syllabus" style={{ marginRight: '1rem' }}>About</a>
            <a href="https://forms.gle/hTtoYtwpizd8zGLH7" style={{ marginRight: '1rem' }}>Feedback</a>
            {session ? (
              <>
                <p>
                  Logged in as {session.newUser.name}
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
      <p>Please upload a PDF to get started.</p>
      <div>
        <UploadButton />
        <UserFilesList />
        <GenerateButton/>
        <div className="container1">
          <div className="ad-container left-justified">
            <img src="/Ad1.jpg" alt="Ad 1"></img>
            <img src="/Ad2.jpg" alt="Ad 2"></img>
            <img src="/Ad3.jpg" alt="Ad 3"></img>
          </div>
          <CalendarEvent></CalendarEvent>
          <div className="ad-container right-justified">
            <img src="/Ad4.jpg" alt="Ad 4"></img>
            <img src="/Ad5.jpg" alt="Ad 5"></img>
            <img src="/Ad6.jpg" alt="Ad 6"></img>
          </div>
        </div>
      </div>
    </>
  )
}