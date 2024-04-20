// TODO change file path accordingly to userId and use API call instead, 
// TODO also might want to make this a client component if you want to have React useState
const DownloadButton = ({ userId }) => {  // you probably don't need this prop if you always include credentials in the HTTP request
    function download(userId){
        // TODO: Download ics file based on the userId
        // const userId = Cookies.get('userId');
        fetch(`/api/download`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        })
          .then(response => {
            if (!response.ok) {
                // HTTP request not OK
                throw new Error('Network response was not ok');
            }
            // TODO: do something here if request is successful, probably want to parse request fields for the output file
            
          })
          .catch(error => {
            // Error messages if the request itself wasn't successful
            console.error('Error downloading file:', error);
            alert("Error: downloading file. Please try again.");
          });
    }

  
    return (
        <div className="download-container">
            <button type='button' className="generate-button" onClick={() => download(userId)}>Download file</button>
        </div>
    );
  };
  export default DownloadButton;
  