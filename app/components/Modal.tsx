import React, { useState } from 'react';
import "./modal.css";

export const Modal = ({ closeModal }) => {
  
  return ( <div className="modal-container">
  
  
    <div className='modal'>
    <button className="exit-btn" onClick={(e) => {
    if (e.target.className === "exit-btn") closeModal();
  }}>Exit</button>
        <form>
          <div className="project-inputs">
            <label htmlFor="project-id">Project ID</label>
            <input name="project-id" />
          </div>
          <div className="project-inputs">
            <label htmlFor="description">Description</label>
            <textarea name="description" />
          </div>
          <div className="project-inputs">
            <label htmlFor="status">Status</label>
            <select name="status">
              <option value="complete">Complete</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
    </div>
  </div>
  )
}
