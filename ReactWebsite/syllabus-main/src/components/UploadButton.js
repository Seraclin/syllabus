'use client'
/* Upload button component for handling pdf documents.
You can import and reuse this component in page.js files. 
By default, React/Nextjs14 uses server-side components and can store state directly (mimics the API), 
but I use client-side with 'use client' and make an API for HTTP requests;
The default HTML file upload is kinda hard to customize directly, so you have to hide it and put a label on top 
*/

import { join } from 'path'
import { useState, FormEvent } from 'react'

export default function UploadButton() {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0) // loading bar

  const onSubmit = async (e) => {
    setProgress(0)
    // Requires client and API
    e.preventDefault()
    if(!file) {
      console.error("Error: no file provided")
      return  // Error for no file added
    }
    try {
      const data = new FormData()
      data.set('file', file)

      // XML HTTP requests to track progress
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);

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
          setFile(null); // Reset file after successful upload
        } else {
          console.error('Error uploading file:', xhr.statusText);
          setProgress(0); // Reset progress on error
        }
      };
    
      xhr.onerror = () => {
        console.error('Network error occurred while uploading file');
        setProgress(0); // Reset progress on error
      };
    
      xhr.send(data);

      /* // This uses HTML fetch instead of xhr, can't really do the loading that well
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
      setProgress(0)
    }
  }

  // HTML for the upload button, only takes first pdf for now; Note: I edit the CSS of the input file button
  return (
    <>
    <div className='upload-button-container'>
      <form onSubmit={onSubmit}>
        {/* <label htmlFor="file-upload" class="custom-file-upload"> Upload PDF</label> */}
        <input id="file-upload" type='file' accept='.pdf' name='file' 
        onChange={(e) => setFile(e.target.files?.[0])}/>
        <input type='submit' value='Upload' />
      </form>
    </div>


    <div className='upload-progress-bar'>
      <div className='upload-progress-bar-indicator' 
      style={{width:`${progress}%`}} />
    </div>
    <p>Hello</p>
    </>
  )
}
