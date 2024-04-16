
import React from 'react'

const StudentCardDisplay = () => {
  return (
    <div>
      <div style={{width: "550px", minHeight: "100px", display:'flex'}} className='bg-[rgb(233,235,238)] mt-3 ml-6 mb-3 rounded-md'>
        <p style={{color: "#76A5C0"}} className='mt-4 ml-2 font-bold'>Student Name</p>
        <div className='isNew'>
          <p>NEW</p>
        </div>
      </div>
    </div>
  )
}

export default StudentCardDisplay

