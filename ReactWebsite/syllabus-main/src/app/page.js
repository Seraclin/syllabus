/* The Homepage, view locally with npm run dev, delete .next folder locally if not working */
import UploadButton from "@/components/UploadButton"
import CalendarEvent from "@/components/CalendarEvent"  // TODO delete this
import DownloadButton from "@/components/DownloadButton"  // TODO edit this

export default function Home() {
  // const uploadFile = function(file) {
  //   const test = file.target.files[0];
  //   if (!test){
  //     console.error('No file selected.');
  //     return;
  //   }
  //   console.log("File has been uploaded:", file);
  // };

  return (
    <>
      <header className="title-bar">
        <div className="title-container">
          <h1 className='title-bar-text'>eSyllabus</h1>
        </div>
        <div className="right-links">
          <a href="https://github.com/Seraclin/syllabus" style={{ marginRight: '1rem' }}>About</a>
          <a href='/login'>Login</a>
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
