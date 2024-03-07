import styles from './page.module.css';
import Head from 'next/head';
import '../globals.css';

export default function Display() {
  return (
    <div className={styles.backgroundFont}>
      <div>
        <Head>
          <title>Display</title>
        </Head>
        
        <div className="flex">
          <img className='object-left-top object-contain h-32 w-64' src="logo1.png" alt="EPICS Logo" width="100"/>
          <div>
            <img className='object-left object-contain h-32 w-64' src="team-formation-text.png" alt="Team Formation Logo" width="100"/>
          </div>
        </div>
      </div>

      <div className='border-solid rounded-t-3xl box-border ml-3 mr-3 bg-[rgba(90,91,88,0.49)] pl-4 pt-7 pb-11'>

        <div className="p-8 ml-4 mt-3 mr-7 bg-[rgba(90,91,88,0.49)] rounded-xl flex flex-col">
          <div className="text-lg text-white font-medium flex flex-row items-center ">
            <h1>Attribute Importance: </h1>  
            <form className="max-w-sm flex flex-row justify-between"> {/* Changed flex direction */}
              <h1 className='text-lg text-white font-medium flex items-center pl-20'> 1 </h1>
              <select id="state1" className="inline-block bg-[rgba(255,255,255,0.96)] border-300 text-900 text-sm rounded-lg p-2.5 border-gray-600 placeholder-gray-400 text-[#2c4090]">
                <option selected>Choose your state</option>
                <option value="Major">Major</option>
                <option value="Project Preference">Project Preference</option>
                <option value="Classification">Classification</option>
              </select>
              <h1 className='text-lg text-white font-medium flex items-center p-1'> 2 </h1>
              <select id="state2" className="inline-block bg-[rgba(255,255,255,0.96)] border-300 text-900 text-sm rounded-lg p-2.5 border-gray-600 placeholder-gray-400 text-[#2c4090]">
                <option selected>Choose your state</option>
                <option value="Major">Major</option>
                <option value="Project Preference">Project Preference</option>
                <option value="Major">Major</option>
              </select>
              <h1 className='text-lg text-white font-medium flex items-center p-1'> 3 </h1>
              <select id="state3" className="inline-block bg-[rgba(255,255,255,0.96)] border-300 text-900 text-sm rounded-lg p-2.5 border-gray-600 placeholder-gray-400 text-[#2c4090]">
                <option selected>Choose your state</option>
                <option value="Major">Major</option>
                <option value="Project Preference">Project Preference</option>
                <option value="Classification">Classification</option>
              </select>
            </form>
          </div>
          <form> 
            <div className="mt-6 text-lg text-white font-medium flex items-center">
              <h1>Maximum Team Number: </h1> 
              <label htmlFor="max Number" className="block mb-1 text-sm font-medium text-black"></label>
              <input type="text" id="max_number" className="w-55 bg-[rgba(255,255,255,0.96)] mt-0 bg-white-100 border border-white-0 text-black-900 text-sm rounded-lg p-2.5 bg-white-500 placeholder-black-400 dark:text-black" placeholder="Enter number here" required />
            </div>
          </form>     
          <div className="ml-0 mt-2 mb-0">
            <button type="button" className="text-white bg-[rgba(#2c4090)] hover:bg-[rgba(#5f7ef9)] font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Generate Teams</button>
          </div>
        </div>
      </div>
    </div>
  );
}
