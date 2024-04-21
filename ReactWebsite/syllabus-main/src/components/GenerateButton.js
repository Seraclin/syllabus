// Client Component for generating the ics file, calls GPT API
// TODO fill in accordingly and test with your values, might want to also add some more error checking and styling to CSS

"use client";

import { useState } from "react";
import DownloadButton from "./DownloadButton";
import Cookies from "js-cookie";
import path from 'path';


const GenerateButton = () => {
    const [hasPressed, setStatus] = useState(false) // check if user has pressed this button for the first time, true = show Download button
    let userId = Cookies.get('userId');

    function generate(){
      userId = Cookies.get('userId');
      if(!userId){
            // Error: no userId in cookies, which means either the user hasn't uploaded any files yet and thus hasn't gotten a userId cookie, or cookie expired
            alert("Error: No files provided. Please upload some files first");
            return;
      }

        // TODO: Generate ics file via API call, you probably should add some input checking in your API just in case. You probably don't need the userId parameter if you pass in the credientials via the request
        fetch(`/api/gpt`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        })
          .then(response => {
            if (!response.ok) {
                // HTTP request not OK
                setStatus(false);
                throw new Error('Network response was not ok');
            }
            // TODO: do something here if request is successful

            // const { exec } = require('child_process');
            // Figure out how to parse in the user id
            // exec('python createSyllabus.py', (error, stdout, stderr) => {
            //     if (error) {
            //         console.error(`exec error: ${error}`);
            //         return;
            //     }
            //     console.log(`stdout: ${stdout}`);
            //     console.error(`stderr: ${stderr}`);
            // });

            // const spawn = require("child_process").spawn;
            // const pythonProcess = spawn('python',["createSyllabus.py", arg1]);


            // Generate .ics file from user's current folder
            setStatus(true); // this makes the download button appear if true
            
          })
          .catch(error => {
            // Error messages if the request itself wasn't successful
            console.error('Error generating file:', error);
            setStatus(false);
            alert("Error: generating file. Please try again.");
          });
    }

    return (
        <div className="generate-container">
            <div>
                <button type='button' className="generate-button" onClick={() => generate()}>Generate</button>
            </div>
            <div>
                {hasPressed ? <DownloadButton userId={userId}></DownloadButton> : <p>Press "Generate" to process your files</p>}
            </div>
        </div>
    );
  };
  
  export default GenerateButton;
  