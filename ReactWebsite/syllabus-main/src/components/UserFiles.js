// Client component used to display what files are in the user's directory at the time.
// Uses the cookie 'userId' variable to identify which user directory to display
'use client'
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { extname, join } from 'path';


export default function UserFilesList() {
  const [userFiles, setUserFiles] = useState([]);

  useEffect(() => {
    const fetchUserFiles = () => {
      const userId = Cookies.get('userId');
      if (userId) {
        fetch('/api/list-user-files', {
          method: 'GET',
          credentials: 'include',
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            const filteredFiles = data.files;
            setUserFiles(filteredFiles);
          })
          .catch(error => {
            console.error('Error fetching user files:', error);
          });
      }
    };
    // Fetch initially
    fetchUserFiles();

    // Set up polling every 3 seconds; TODO: edit this to something reasonable
    const intervalId = setInterval(fetchUserFiles, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  function removeFile(fileName){
    // Remove selected file from the user's folder via API call
    // const userId = Cookies.get('userId');
    fetch(`/api/delete`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName }), // send the filename in the request body
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Remove the file from the userFiles state
        setUserFiles(prevFiles => prevFiles.filter(file => file !== fileName));
      })
      .catch(error => {
        console.error('Error deleting file:', error);
        alert("Error: removing", fileName);
      });
  }

  return (
    <div className='user-filelist'>
      <h2>Uploaded Files:</h2>
      <ul>
        {userFiles.map((fileName, index) => (
          // Ignore .ics files from user file list
          !fileName.endsWith('.ics') && (
            <li key={index}>
              {fileName}
              <button type='button' onClick={() => removeFile(fileName)} style={{ marginLeft: '8px' }}>Remove</button>
            </li>
          )
        ))}
      </ul>
    </div>
  );
}