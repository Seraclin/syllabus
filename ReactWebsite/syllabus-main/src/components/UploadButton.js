/* Upload button component for handling pdf documents.
You can import and reuse this component in page.js files. 
By default, React/Nextjs14 uses server-side components and can store state directly (mimics the API), 
TODO: but can alternatively should use client-side with 'use client' and make an API for HTTP requests;
The default HTML file upload is kinda hard to customize directly, so I hide it and put a label on top 
*/
import {writeFile} from 'fs/promises'
import { join } from 'path'
export default function UploadButton() {

  async function upload(data) {
     // server function to read file from input and write to server
    'use server'
    const file = data.get('file')
    if(!file) {
      throw new Error('No file uploaded')
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // With the file in the buffer, you can do whatever
    // For now, I'll just write it to the file system in a new location locally
    const rootDir = process.cwd();
    const path = join(rootDir, 'public', 'tmp', file.name);
    await writeFile(path, buffer)
    console.log(`open ${path} to see the uploaded file`)
    
    return {success: true}
  }
  // HTML for the upload button; Note: I edit the CSS of the input file button
  return (
    <div className='upload-button-container'>
      <form action={upload}>
        {/* <label htmlFor="file-upload" class="custom-file-upload"> Upload PDF</label> */}
        <input id="file-upload" type='file' accept='.pdf' name='file' />
        <input type='submit' value='Upload' />
      </form>
    </div>
  )
}
