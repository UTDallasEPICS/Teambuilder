import './studentcard.css'

import React from 'react'

const StudentCardDisplay = () => {
  return (
    <div style={{width: "550px", minHeight: "100px"}} className='bg-[rgb(233,235,238)] mt-3 ml-6 mb-3 rounded-md'>
      <div style={{ display:'inline-flex' }} >
        <p style={{color: "#76A5C0"}} className='mt-4 ml-2 font-bold'>Student Name</p>
        <div className='isNew' style={{justifyContent:'center', marginTop:"17px", marginLeft:'12px', borderRadius:'3px'}}>
          <p style={{alignItems:'center', marginLeft:'2px', marginBottom:'8px'}}>NEW</p>
        </div>
      </div>
      <div style={{display:'flex', flexDirection:'column', marginLeft:'8px', color:'#76A5C0'}}>
          <p style={{marginTop:'8px'}}>NET ID: abc123456</p>
      </div>
      
    </div>
  )
}

export default StudentCardDisplay

