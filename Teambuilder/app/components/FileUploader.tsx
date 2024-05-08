import {useRef} from 'react'

export const FileUploader = ({ handleFile }) => {
  
  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded);
  };

 return (
    <div>
      <button style={{marginLeft: '20px' , marginTop: '50px'}} className=' border-solid border-8 p-1 border-transparent rounded-xl bg-[rgba(96,241,135,0.9)] text-xl' onClick={handleClick}>
                Student List Upload
      </button>
      <input
        type="file"
        onChange={handleChange}
        ref={hiddenFileInput}
        style={{ display: "none" }} // Make the file input element invisible
      />

    </div>
  )
}

export default FileUploader
