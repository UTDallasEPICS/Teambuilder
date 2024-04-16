import React from 'react';
import "./modal.css";

export const Modal = () => {
  return ( <div className='modal-container'>
    <div className='modal'>
        <form>
          <div>
            <label htmlFor="project-num">Project Number</label>
            <input name="project-num" />
          </div>
          <div>
            <label htmlFor="project-num">Project Number</label>
            <input name="project-num" />
          </div>
        </form>
    </div>
  </div>
  )
}
