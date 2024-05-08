import  './projectcarddisplay.css'
import React from 'react'

const ProjectCardDisplay = (props) => {
  return (
    <div>
      <div style={{width: "300px", minHeight: "100px", display:'flex', flexDirection:'column'}} className='bg-[rgb(233,235,238)] mt-3 ml-6 mb-3 rounded-md'>
        <p style={{color: "#76A5C0"}} className='backgroundFont mt-2 ml-2 font-bold'>{props.myString}</p>

        <div style={{display:'flex', flexDirection:'column'}}>
            <div style={{display:'inline-flex',}}>
                <div className='isNew' style={{justifyContent:'center', marginTop:"5px", marginLeft:'8px', borderRadius:'5px'}}>
                    <p style={{alignItems:'center', marginLeft:'6px', fontSize:'12px'}}>NEW</p>
                </div>
                <div className='semester' style={{justifyContent:'center', marginTop:"5px", marginLeft:'10px', borderRadius:'5px'}} >
                    <p style={{alignItems:'center', marginLeft:'4px', fontSize:'12px'}}>SP2024</p>
                </div>
            </div>
            <p className='backgroundFont  mt-3 ml-2 mb-3 rounded-md font-bold'  style={{color: "#76A5C0"}}>Students:</p>
            <div style={{display:'inline-flex', marginBottom:'7px', flexWrap:"wrap"}}>
                <div className='student' style={{justifyContent:'center',  marginLeft:'8px', borderRadius:'5px', minWidth:'20px'}}>
                    <p style={{alignItems:'center', marginLeft:'6px', marginRight:'6px',fontSize:'12px'}}>JOHN S.</p>
                </div>
                <div className='student' style={{justifyContent:'center',  marginLeft:'8px', borderRadius:'5px', minWidth:'20px'}}>
                    <p style={{alignItems:'center', marginLeft:'6px', marginRight:'6px',fontSize:'12px'}}>JOHN S.</p>
                </div>
                <div className='student' style={{justifyContent:'center',  marginLeft:'8px', borderRadius:'5px', minWidth:'20px'}}>
                    <p style={{alignItems:'center', marginLeft:'6px', marginRight:'6px',fontSize:'12px'}}>JOHN S.</p>
                </div>
                <div className='student' style={{justifyContent:'center',  marginLeft:'8px', borderRadius:'5px', minWidth:'20px'}}>
                    <p style={{alignItems:'center', marginLeft:'6px', marginRight:'6px',fontSize:'12px'}}>JOHN S.</p>
                </div>
            </div>
        </div>
        
        

      </div>
    </div>
  )
}

export default ProjectCardDisplay

