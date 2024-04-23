import React, { useState } from 'react';
import "./modal.css";

export const Modal = ({ closeModal }) => {
  const [formState, setFormState] = useState({
    Project_name: "",
    description: "",
    status: "complete",
  });

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formState);
  }

  return ( <div className="modal-container">
  
  
    <div className='modal'>
    <button className="exit-btn" onClick={(e) => {
    if (e.target.className === "exit-btn") closeModal();
  }}>Exit</button>
        <form>
          <div className="project-inputs">
            <label htmlFor="project-id">Project ID</label>
            <input name="project-id" value={formState.Project_name} onChange={handleChange}/>
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
          <button type="submit" className="submit-btn" onClick={handleSubmit}>Submit</button>
        </form>
    </div>
  </div>
  )
}
