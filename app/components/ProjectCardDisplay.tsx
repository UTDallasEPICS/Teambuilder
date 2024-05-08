import  './projectcarddisplay.css'
import React from 'react'

const ProjectCardDisplay = (props) => {
  return (
    <div>
      <div style={{width: "220px", minHeight: "100px", display:'flex', flexDirection:'column'}} className='bg-[rgb(233,235,238)] mt-3 ml-6 mb-3 rounded-md'>
        <p style={{color: "#76A5C0"}} className='mt-2 ml-2 font-bold'>{props.myString}</p>

        <div style={{display:'inline-flex',}}>
          <div className='isNew' style={{justifyContent:'center', marginTop:"5px", marginLeft:'8px', borderRadius:'5px'}}>
            <p style={{alignItems:'center', marginLeft:'6px', fontSize:'12px'}}>NEW</p>
          </div>
          <div className='semester' style={{justifyContent:'center', marginTop:"5px", marginLeft:'10px', borderRadius:'5px'}} >
            <p style={{alignItems:'center', marginLeft:'4px', fontSize:'12px'}}>SP2024</p>
          </div>
        </div>
        <p className='desc' style={{color:'#76A5C0', fontSize:'12px', marginLeft:'8px', marginTop:'6px', marginBottom:'8px'}}>here is the placeholder project description to display details of the project.</p>
        

      </div>
    </div>
  )
}

export default ProjectCardDisplay

