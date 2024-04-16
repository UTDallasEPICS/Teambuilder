import styles from './page.module.css';
import Head from 'next/head';
import '../globals.css';
import Navbar from '../components/Navbar';
import ProjectCardDisplay from '../components/ProjectCardDisplay';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';

export default function Project() {
  return (
    <div >
      
      <br></br>
      <div className='h-screen border-solid rounded-t-3xl box-border m-10 bg-[rgba(90,91,88,0.49)] pl-4 pt-7 '>
        <div className='box-border border-solid rounded-3xl min-h-28 mt-1 mr-9 ml-5 mb-3 bg-[rgba(48,100,162,0.29)]  flex flex-col'>
            <h1 className='ml-4 mt-3 text-xl'>Instruction</h1>
            <h2 className='ml-4 mt-2 mr-3'>Upload your project information here. Ensure to enter project name, descirption, semester, and whether it is a new or returning project. Once you are ready, click next.</h2>
          </div>
        <br></br>
        <div style={{marginLeft: '0px' }} className='flex'>
            <div className='flex-col'>
              <h1 style={{fontSize: '30px'}} className=' ml-8 mt-3 '>Projects</h1>
              <div style={{ marginLeft: '25px' , width: '500px', height: '300px', overflowY: 'auto' }} className='customMargin box-border border-solid rounded-3xl  bg-[rgba(48,100,162,0.29)]  flex flex-col'>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh'}}>
                  <Table/>
                </div>
              </div>
            </div>
            
          
            <div className='flex-col'>
              <h1 style={{fontSize: '30px'}} className=' ml-16 mt-3 '>Edit Project</h1>
              <div style={{ marginLeft: '50px' , width: '625px', minHeight: '300px', marginRight: '25px'}} className='customMargin box-border border-solid rounded-3xl  bg-[rgba(48,100,162,0.29)]  flex flex-col'>
                <Modal />
              </div>

            </div>
          </div>
          
        
      </div>
    </div>
  );
}
