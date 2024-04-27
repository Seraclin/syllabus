// TODO change file path accordingly to userId and use API call instead, 
// TODO also might want to make this a client component if you want to have React useState
import Cookies from "js-cookie";
const DownloadButton = () => {  // you probably don't need this prop if you always include credentials in the HTTP request
    function download(){
        // TODO: Download ics file based on the userId
        let userId = Cookies.get('userId');
        fetch(`/api/download`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            // 'Content-Type': 'text/calendar',
          }
        })
          .then(async(response) => {
            if (!response.ok) {
              // HTTP request not OK
              throw new Error('Network response was not ok');
            }
            // Do something here if request is successful, probably want to parse request fields for the output file
            // Location of download file will be at
            // '..\\app\\api\\upload\\user_files\\' + userId + '\\eSyllabus.ics'
            // Trigger download by creating an anchor element
            const blob = await response.blob();
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'eSyllabus.ics';
            document.body.appendChild(a);
            a.click();

            // cleanup after download
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url); 
            console.log("Downloaded ics file successfully for user:", userId);           
          })
          .catch(error => {
            // Error messages if the request itself wasn't successful
            console.error('Error downloading file:', error);
            alert("Error: downloading file. Please try again.");
          });
    }

  
    return (
        <div className="download-container">
            <button type='button' className="generate-button" onClick={() => download()}>Download file</button>
        </div>
    );
  };
  export default DownloadButton;
  