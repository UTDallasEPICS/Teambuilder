import React, { useState } from 'react';
import "./modal.css";

//Takes in parameters for checking if Modal is closed, submission handling, and default value of projects
export const Modal = ({ closeModal, onSubmit, defaultValue }) => {
  const [formState, setFormState] = useState(defaultValue || {  //This is the default value for new projects
    Project_name: "",
    Project_partner: "",
    CS_target_number: 0,
    archive: "No",
  });

  const [errors, setErrors] = useState("");

  //validateForm checks if certain fields have values inputted and sends an error if one is missing
  //It gives an error stating which fields are missing
  //it returns true if all fields are valid and not empty
  const validateForm = () => {
    if(formState.Project_name && formState.Project_partner && formState.CS_target_number && formState.archive) {
      setErrors("");
      return true;
    } else {
      let errorFields = [];
      for(const [key, value] of Object.entries(formState)) {
        if(!value) {
          errorFields.push(key);
        }
      }
      setErrors(errorFields.join(", "));
      return false;
    }
  }

  //handles the change in fields by updating them using formState
  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  //handles the submission of a Project and checks for any errors
  //Closes modal if everything is fine
  const handleSubmit = (e) => {
    e.preventDefault();

    if(!validateForm()) return;

    onSubmit(formState);

    closeModal();
  }

  return ( <div className="modal-container">
  
  
    <div className='modal'>
    <button className="exit-btn" onClick={(e) => {
    if (e.target.className === "exit-btn") closeModal();
  }}>Exit</button>
        <form>
          <div className="project-inputs">
            <label htmlFor="Project_name">Project Name</label>
            <input name="Project_name" value={formState.Project_name} onChange={handleChange}/>
          </div>
          <div className="project-inputs">
            <label htmlFor="Project_partner">Project Partner</label>
            <textarea name="Project_partner" value={formState.Project_partner} onChange={handleChange}/>
          </div>
          <div className="project-inputs">
            <label htmlFor="CS_target_number">CS Target #</label>
            <textarea name="CS_target_number" value={formState.CS_target_number} onChange={handleChange}/>
          </div>
          <div className="project-inputs">
            <label htmlFor="archive">Archived</label>
            <select name="archive" value={formState.archive} onChange={handleChange}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          {errors && <div className="error">{`Please include: ${errors}`}</div>}
          <button type="submit" className="submit-btn" onClick={handleSubmit}>Submit</button>
        </form>
    </div>
  </div>
  )
}
