'use client'
/* Upload button client component for handling pdf documents.
You can import and reuse this component in page.js files. 
By default, React/Nextjs14 uses server-side components and can store state directly (mimics the API), 
but I use client-side with 'use client' and make an API for HTTP requests;
The default HTML file upload is kinda hard to customize directly, so you have to hide it and put a label on top 
*/

import { join, extname } from 'path'
import { useState, FormEvent } from 'react'

export default function UploadButton() { // handle upload button behavior
  const [files, setFiles] = useState(null) // FileList array
  const [progress, setProgress] = useState(0) // loading bar
  const [complete, setComplete] = useState(false) // check if completed, true = complete
  const MAX_FILE_SIZE = 2; // note: file size is measured in bytes in base 2 (1024*1024 bytes = 1 Mb)

  const onSubmit = async (e) => {
    setProgress(0);
    setComplete(false);

    // Check if there's a file
    e.preventDefault()
    if(!files) {
      console.error("Error: no file provided");
      alert("No file provided!");
      return;  // Error for no file added
    }

    // Check if multiple input files sum up to less than MAX_FILE_SIZE
    let totalSize = 0;
    for(let i = 0; i < files.length; i++) {
      totalSize += files[i].size;
      if(extname(files[i].name).toLowerCase() != '.pdf') {
        console.error("Invalid file type selected. Please upload a PDF.")
        alert(`Invalid file found: "${files[i].name}". Please select a PDF.`);
        return;
      }
    }
    if(totalSize > MAX_FILE_SIZE * 1024 * 1024) {
      console.error("Error: over max file size.")
      alert(`Total selected files ${(totalSize/1024/1024).toFixed(2)}MB is over the size limit of 2MB.`);
      return;
    }

    // Check if correct file type

    try {
      const data = new FormData()
      for (let i = 0; i < files.length; i++) {
        data.append('file', files[i]);
      }

      // data.set('file', file); // for single file

      // XML HTTP requests to track progress
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);
      xhr.withCredentials = true; // important for cookies!

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          // Add a small delay before updating the progress
          setTimeout(() => {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }, 500); // Adjust the delay time as needed (in milliseconds)
        }
      };
    
      xhr.onload = async () => {
        if (xhr.status === 200) {
          // setFile(null); // Reset file after successful upload
          // If we reach here, then everything should work
          console.log("Upload complete:", files)
          setProgress(100);
          setComplete(true);
        } else {
          console.error('Error uploading file:', xhr.statusText);
          alert("An error has occurred. Please try again.")
          setProgress(0); // Reset progress on error
          setComplete(false);
        }
      };
    
      xhr.onerror = () => {
        console.error('Network error occurred while uploading file');
        alert("Network error occurred while uploading file. Please try again.")
        setProgress(0); // Reset progress on error
        setComplete(false);
      };
      xhr.send(data);

      /* // This uses HTML fetch instead of xhr, fetch can't track loading progress
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      })
      
      // error-checking
      if(!res.ok) {
        throw new Error(await res.text())
      }

      // Update progress bar to estimate time it takes
      const contentLength = res.headers.get('Content-Length');
      const totalLength = typeof contentLength === 'string' && parseInt(contentLength);
      const reader = res.body.getReader();
      let receivedLength = 0;
      const chunks = [];
      while(true) {
        const {done, value} = await reader.read();
        if(done) {
          console.log("File done uploading!")
          break;
        }
        chunks.push(value);
        receivedLength = receivedLength + value.length;
        if(typeof totalLength === 'number'){
          const step = receivedLength / totalLength * 100;
          console.log(step)
          setProgress(step);
        }
      }
      setProgress(100) */
      // can send to another page with res.redirect(307, `/post/${id}`)
    } catch (e) {
      // Handle errors here
      console.error(e)
      setProgress(0);
      setComplete(false);
    }
  }

  const handleFileChange = event => { // handle file selction button behavior
    setFiles(Array.from(event.target.files));
    setProgress(0); // Reset progress and complete state after file selection changes
    setComplete(false);
  }

  // HTML for the upload button, only takes first pdf for now; Note: I edit the CSS of the input file button
  return (
    <>
    <div className='upload-button-container'>
      <form onSubmit={onSubmit}>
        {/* <label htmlFor="file-upload" class="custom-file-upload"> Upload PDF</label> */}
        <input id="file-upload" type='file' accept='application/pdf' name='file' multiple
        onChange={handleFileChange}/>
        <input type='submit' value='Upload' />
      </form>
    </div>

    <div className='upload-progress-bar-container'>
      <div className='upload-progress-bar'>
        <div className='upload-progress-bar-indicator' 
        style={{width:`${progress}%`}} />
      </div>
      {complete && files && files.length > 0 ? (
    <div>
      <p>Completed uploads:</p>
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>) : (
      files && files.length > 0 ? (
        <div>
          <p>Selected files:</p>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>) : (
        <p>No files selected</p>
      )
    )}
    </div>
    </>
  )
}
