"use client";

import styles from './page.module.css';
import Head from 'next/head';
import '../globals.css';
import Navbar from '../components/Navbar';
import ProjectCardDisplay from '../components/ProjectCardDisplay';
import { useState } from 'react';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import Display from '../display/page';

export default function Project() {

  const [modalOpen, setModalOpen] = useState(false);

  const [rows, setRows] = useState([
    {Project_name: "Project 1", description: "This is the first project", status: "complete"},
    {Project_name: "Project 2", description: "This is the second project", status: "incomplete"},
    {Project_name: "Project 3", description: "This is the third project", status: "incomplete"},
  ]);

  const handleDeleteRow = (targetIndex) => {
    setRows(rows.filter((_, idx) => idx !== targetIndex))
  };

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
              
                
                  <Table rows={rows} deleteRow={handleDeleteRow}/>
                
            <button style={{display: 'block', margin: 'auto', marginTop: '1rem', border: 'none', backgroundColor: 'aqua', color: 'white', padding: '0.5rem 1rem', borderRadius: '10px', cursor: 'pointer', boxShadow: '0px 5px 5px #ccc' }} onClick={() => setModalOpen(true)}>Add</button>
            </div>
            
          
            <div className='flex-col'>
              <h1 style={{fontSize: '30px'}} className=' ml-16 mt-3 '>Edit Project</h1>
              <div style={{ marginLeft: '50px' , width: '625px', minHeight: '300px', marginRight: '25px'}} className='customMargin box-border border-solid rounded-3xl  bg-[rgba(48,100,162,0.29)]  flex flex-col'>
                {modalOpen && (
                  <Modal 
                    closeModal ={() => {
                      setModalOpen(false);
                    }}
                  />
                )}
              </div>

            </div>
          </div>
          
        
      </div>
    </div>
  );
}
