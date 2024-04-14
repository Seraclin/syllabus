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

  return (
    <div className='user-filelist'>
      <h2>Uploaded Files:</h2>
      <ul>
        {userFiles.map((fileName, index) => (
          <li key={index}>{fileName}</li>
        ))}
      </ul>
    </div>
  );
}