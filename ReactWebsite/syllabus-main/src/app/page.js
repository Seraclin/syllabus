/* The Homepage, view locally with npm run dev, delete .next folder locally if not working */
import UploadButton from "@/components/UploadButton"
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
        <h1 className='title-bar-text'>Master Syllabus (in progress)</h1>
        <a href="https://github.com/Seraclin/syllabus">About</a>
      </header>
      <p>TODO: Insert something cool here :)</p>
      <div>
        <UploadButton />      
      </div>
    </>
  )
}
