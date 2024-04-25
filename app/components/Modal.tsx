import React, { useState } from 'react';
import "./modal.css";

export const Modal = ({ closeModal, onSubmit, defaultValue }) => {
  const [formState, setFormState] = useState(defaultValue || {
    Project_name: "",
    description: "",
    status: "complete",
  });

  const [errors, setErrors] = useState("");

  const validateForm = () => {
    if(formState.Project_name && formState.description && formState.status) {
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

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!validateForm()) return;

    onSubmit(formState)
  }

  return ( <div className="modal-container">
  
  
    <div className='modal'>
    <button className="exit-btn" onClick={(e) => {
    if (e.target.className === "exit-btn") closeModal();
  }}>Exit</button>
        <form>
          <div className="project-inputs">
            <label htmlFor="project-name">Project Name</label>
            <input name="project-name" value={formState.Project_name} onChange={handleChange}/>
          </div>
          <div className="project-inputs">
            <label htmlFor="description">Description</label>
            <textarea name="description" value={formState.description} onChange={handleChange}/>
          </div>
          <div className="project-inputs">
            <label htmlFor="status">Status</label>
            <select name="status" value={formState.status} onChange={handleChange}>
              <option value="complete">Complete</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
          {errors && <div className="error">{`Please include: ${errors}`}</div>}
          <button type="submit" className="submit-btn" onClick={handleSubmit}>Submit</button>
        </form>
    </div>
  </div>
  )
}
