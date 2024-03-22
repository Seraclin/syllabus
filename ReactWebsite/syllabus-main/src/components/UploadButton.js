'use client'
/* Upload button component for handling pdf documents.
You can import and reuse this component in page.js files. 
By default, React/Nextjs14 uses server-side components and can store state directly (mimics the API), 
TODO: but can alternatively should use client-side with 'use client' and make an API for HTTP requests;
The default HTML file upload is kinda hard to customize directly, so I hide it and put a label on top 
*/

import { join } from 'path'
import { useState } from 'react'

export default function UploadButton() {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0) // TODO: loading bar

  const onSubmit = async (e) => {
    // Requires client and API
    e.preventDefault()
    if(!file) return  // Error for no file added

    try {
      const data = new FormData()
      data.set('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      })

      // error-checking
      if(!res.ok) {
        throw new Error(await res.text())
      }
    } catch (e) {
      // Handle errors here
      console.error(e)
    }
  }

  // HTML for the upload button, only takes first pdf for now; Note: I edit the CSS of the input file button
  return (
    <div className='upload-button-container'>
      <form onSubmit={onSubmit}>
        {/* <label htmlFor="file-upload" class="custom-file-upload"> Upload PDF</label> */}
        <input id="file-upload" type='file' accept='.pdf' name='file' 
        onChange={(e) => setFile(e.target.files?.[0])}/>
        <input type='submit' value='Upload' />
      </form>
    </div>
  )
}
