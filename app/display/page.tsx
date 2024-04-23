import styles from './page.module.css';
import Head from 'next/head';
import '../globals.css';

export default function Display() {
  return (
    <div>
      <div>
        <Head>
          <title>Display</title>
        </Head>
        
      
      </div>

      <div className='border-solid rounded-3xl box-border m-8 bg-[rgba(48,100,162,0.29)]' style={{minHeight:'150px', minWidth:'500px'}}>

        
          <div className="text-lg text-white font-medium flex flex-row items-center ">
          </div>
          <form> 
            <div className="mt-6 text-lg text-white font-medium flex items-center">
              <h1 className='backgroundFont ml-3'>Maximum Team Number: </h1> 
              <label htmlFor="max Number" className="block mb-1 text-sm font-medium text-black"></label>
              <input type="text" id="max_number" className="w-55 bg-[rgba(255,255,255,0.96)] mt-0 ml-10 bg-white-100 border border-white-0 text-black-900 text-sm rounded-lg p-2.5 bg-white-500 placeholder-black-400 dark:text-black " placeholder="Enter number here" required />
            </div>
            <div className="ml-0 mt-2 mb-0">
            <button type="button" className="ml-3 text-white bg-[rgba(96,241,135,0.9)] dark:hover:bg-[rgba(128,172,108,0.9)] font-medium rounded-xl text-lg px-5 py-2.5 me-2 mb-2 focus:outline-none backgroundFont">Generate Teams</button>
            </div>
          </form>     
        
        
      </div>
    </div>
  );
}
