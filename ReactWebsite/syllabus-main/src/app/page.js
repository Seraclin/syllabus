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
        <h1 className='title-bar-text'>eSyllabus</h1>
        <a href="https://github.com/Seraclin/syllabus">About</a>
        <a href='/login/page.js'>Login</a>
      </header>
      <p>Please upload a PDF to get started.</p>
      <div>
        <UploadButton />
        <DownloadButton fileName="test1.ics"/>
      </div>
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
      
    </>
  )
}
