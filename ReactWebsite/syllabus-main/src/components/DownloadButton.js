// DownloadButton.js, TODO only works if file is in public folder /tmp, consider using an API instead
const DownloadButton = ({ fileName = 'test.ics'}) => {
    const fileUrl = `/api/download?fileName=${encodeURIComponent(fileName)}`;
  
    return (
    <div className="download-container">
        <a href={`/tmp/${fileName}`} download={fileName}>Download {fileName}</a>
        {/* TODO: if not in public folder use API instead: <a href={fileUrl} download={fileName}>Download {fileName}</a> */}
    </div>
    );
  };
  
  export default DownloadButton;
  