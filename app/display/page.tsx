import styles from './page.module.css';
import Head from 'next/head';
import '../globals.css';
import Link from 'next/link';

import UnassignedStudents from '../components/UnassignedStudents'
import ProjectMatch from '../components/ProjectMatch'

export default function Display() {
  return (
    <div className='border-solid rounded-3xl box-border m-10 ' style={{minHeight:'900px', minWidth:'500px'}}>
      <div>
        <Head>
          <title>Display</title>
        </Head>
      </div>

      <div className='border-solid rounded-3xl box-border bg-[rgba(48,100,162,0.29)]' style={{minHeight:'150px', minWidth:'500px', margin:'20px', padding: '20px'}}>
        <form> 
          <div className="text-lg text-white font-medium flex items-center">
            <h1 className='backgroundFont ml-3 mt-5'>Maximum Team Number: </h1> 
            <label htmlFor="max Number" className="block mb-1 text-sm font-medium text-black mt-5"></label>
            <input type="text" id="max_number" className="w-55 bg-[rgba(255,255,255,0.96)] ml-10 bg-white-100 border border-white-0 text-black-900 text-sm rounded-lg p-2.5 bg-white-500 placeholder-black-400 dark:text-black mt-5" placeholder="Enter number here" required />
          </div>
          <div className="ml-0 mt-2 mb-0">
            <button type="button" className="ml-3 text-white bg-[rgba(96,241,135,0.9)] dark:hover:bg-[rgba(128,172,108,0.9)] font-medium rounded-xl text-lg px-5 py-2.5 me-2 mb-2 focus:outline-none backgroundFont">Generate Teams</button>
          </div>
        </form>     
      </div>

      <div style={{display:'inline-flex'}}>
        <div style={{display:'flex', flexDirection:'column', marginTop:'40px'}}>
          <p className='backgroundFont' style={{marginLeft:'25px', fontSize:'20px'}}>Team Combos</p>
          <p className='backgroundFont' style={{marginLeft:'25px', marginBottom:'5px'}}>Count: X</p>
          <div className='border-solid rounded-3xl box-border bg-[rgba(48,100,162,0.29)]' style={{height:'450px', width:'350px', margin:'20px', marginLeft:'20px' , marginTop:'0px', overflowY:'scroll'}}>
            <ProjectMatch/>
            <ProjectMatch/>
            <ProjectMatch/>
            <ProjectMatch/>
          </div>
        </div>
        <div style={{display:'flex', flexDirection:'column', marginTop:'40px'}}>
          <p className='backgroundFont' style={{marginLeft:'80px', fontSize:'20px'}}>Unassigned Students</p>
          <p className='backgroundFont' style={{marginLeft:'80px', marginBottom:'5px'}}>Count: X</p>
          <div className='border-solid rounded-3xl box-border bg-[rgba(48,100,162,0.29)]' style={{height:'450px', width:'350px', margin:'20px', marginLeft:'80px' , marginTop:'0px', overflowY:'scroll'}}>
            <UnassignedStudents/>
            <UnassignedStudents/>
            <UnassignedStudents/>
            <UnassignedStudents/>
            <UnassignedStudents/>
            <UnassignedStudents/>

          </div>
          
        </div>
        <div style={{display:'flex', flexDirection:'column', marginTop:'40px'}}>
          <p className='backgroundFont' style={{marginLeft:'80px', fontSize:'20px'}}>Project Status</p>
          <p className='backgroundFont' style={{marginLeft:'80px', marginBottom:'5px'}}>Incomplete: X</p>
          <div className='border-solid rounded-3xl box-border bg-[rgba(48,100,162,0.29)]' style={{height:'450px', width:'350px', margin:'20px', marginLeft:'80px' , marginTop:'0px', overflowY:'scroll'}}>
            <ProjectMatch/>
            <ProjectMatch/>
            <ProjectMatch/>
            <ProjectMatch/>
          </div>
        </div>
      </div>
      
      <div>
          <Link href="../display">
            <button style={{marginLeft: '20px'}} className='backgroundFont border-solid border-8 p-2 border-transparent rounded-xl bg-[rgba(96,241,135,0.9)] text-xl' >Export as CSV &gt;&gt;</button>
          </Link>
      </div>

    </div>
  );
}
