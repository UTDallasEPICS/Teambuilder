"use client";

import styles from './page.module.css';
import Head from 'next/head';
import dynamic from 'next/dynamic'; // Import dynamic from next/dynamic
import Link from 'next/link';
import React, { useRef } from 'react'; // Import React and useRef

import { Uploader } from "uploader"; // Installed by "react-uploader".
import { UploadButton } from "@bytescale/upload-widget-react";
import * as Bytescale from "@bytescale/upload-widget"

import ProjectCardDisplay from '../components/ProjectCardDisplay';

const options = {
  apiKey: "public_kW15c1FAk3cAMZz49Pg4WYhEYckX", // Get API key: https://www.bytescale.com/get-started
  maxFileCount: 1
};

export default function Dashboard() {

  const fileInputRef = useRef(null); // Create a ref for file input

  const handleButtonClick = () => {
    // Trigger file input click when the button is clicked
    fileInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    // Perform any file handling logic here
  };

  return ( 
    <div className={styles.backgroundFont}> 
      <div>
        <Head>
          <title>Dashboard</title>
        </Head>
      </div>

      <div style={{minHeight: '820px'}} className=' pt-10 h-screen border-solid rounded-3xl box-border m-10 bg-[rgba(90,91,88,0.33)]'>

        <div className='box-border border-solid rounded-3xl min-h-44 mt-1 mr-9 ml-5 mb-3 bg-[rgba(48,100,162,0.29)]  flex flex-col'>
          <h1 className='ml-4 mt-3 text-xl'>Instruction</h1>
          <h2 className='ml-4 mt-2 mr-3'>Upload your student list here as an excel sheet. make sure you have these columns: blah blah blah. Thxxxx</h2>
        </div>

        

        <div style={{marginTop: '50px'}} className='flex flex-inline'>
          
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="text/csv"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            <UploadButton options={options}
                  onComplete={files => alert(files.map(x => x.fileUrl).join("\n"))}>
            {({onClick}) =>
              <button style={{marginLeft: '20px' , marginTop: '50px'}} className=' border-solid border-8 p-1 border-transparent rounded-xl bg-[rgba(96,241,135,0.9)] text-xl' onClick={onClick}>
                Student List Upload
              </button>
            }
          </UploadButton>
          </div>

          
          <div style={{marginLeft: '100px' }} className='flex'>
            <div className='flex-col'>
              <h1 style={{fontSize: '30px'}} className=' ml-8 mt-3 '>Projects</h1>
              <div style={{ marginLeft: '25px' , width: '270px', height: '400px', overflowY: 'auto' }} className='customMargin box-border border-solid rounded-3xl  bg-[rgba(48,100,162,0.29)]  flex flex-col'>

                <ProjectCardDisplay/>
                <ProjectCardDisplay/>
                <ProjectCardDisplay/>
                <ProjectCardDisplay/>

                

              </div>
            </div>
            
          
            <div className='flex-col'>
              <h1 style={{fontSize: '30px'}} className=' ml-16 mt-3 mb-3 text-xl'>Student List Preview</h1>
              <div style={{ marginLeft: '50px' , width: '600px', height: '400px'}} className='customMargin  border-solid rounded-3xl  bg-[rgba(48,100,162,0.29)]  flex flex-col'>
                <ProjectCardDisplay/>
              </div>

            </div>
          </div>

        </div>
        

        <br></br>
        <div>
          <Link href="../display">
            <button style={{marginLeft: '20px'}} className=' border-solid border-8 p-2 border-transparent rounded-xl bg-[rgba(96,241,135,0.9)] text-xl' >Form Teams &gt;&gt;</button>
          </Link>
        </div>
      
      </div>
    </div>
      
  );
}
