import styles from './page.module.css';
import Head from 'next/head';
import '../globals.css';

export default function Project() {
  return (
    <div >
      
      <br></br>
      <div className='h-screen border-solid rounded-t-3xl box-border m-10 bg-[rgba(90,91,88,0.49)] pl-4 pt-7 '>
        <div className='box-border border-solid rounded-3xl min-h-44 mt-1 mr-9 ml-5 mb-3 bg-[rgba(48,100,162,0.29)]  flex flex-col'>
            <h1 className='ml-4 mt-3 text-xl'>Instruction</h1>
            <h2 className='ml-4 mt-2 mr-3'>Upload your project information here. Ensure to enter project name, descirption, semester, and whether it is a new or returning project. Once you are ready, click next.</h2>
          </div>
        <br></br>
        <div>
          <h2>Project Upload</h2>
          <div>
            <div className='flex justify-start'>
              <div className='box-border border-solid rounded-3xl min-h-44 mt-1 mr-9 ml-5 mb-3 bg-[rgba(48,100,162,0.29)]  flex flex-col'>
                  content of box test
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
