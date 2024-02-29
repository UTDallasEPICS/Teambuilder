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
          <img className='object-left object-contain h-32 w-64' src="team-formation-text.png" alt="Team FOrmation Logo" width="100"/>
          </div>
          <div>
            <h2>Display</h2>
          </div>
        </div>
      </div>

  
      <div className='border-solid rounded-t-3xl box-border ml-3 mr-3 bg-[rgba(90,91,88,0.49)] pl-4 pt-7 pb-11'>

      <div className = "p-8 ml-4 mt-3 mr-7 bg-[rgba(90,91,88,0.49)] rounded-xl flex flex-col">
            <div className = "text-lg text-white font-medium">
              <h1>Attribute Importance: </h1>  
              <form className = "max-w-sm">
                <label htmlFor = "state" className = "block mt-1 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
                <select id="state" className=" bg-[rgba(255,255,255,0.96)]  border-300 text-900 text-sm rounded-lg block w-full p-2.5 border-gray-600 placeholder-gray-400  text-[#2c4090]">
                <option selected>Choose your state</option>
                <option value="Skill Match">Skill Match</option>
                <option value="Project Preference">Project Preference</option>
                <option value="Classification">Classification</option>
                </select>
                <label htmlFor = "state" className = "block mt-1 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
                <select id="state" className="bg-[rgba(255,255,255,0.96)]  border-300 text-900 text-sm rounded-lg block w-full p-2.5 border-gray-600 placeholder-gray-400  text-[#2c4090]">
                <option selected>Choose your state</option>
                <option value="Skill Match">Skill Match</option>
                <option value="Project Preference">Project Preference</option>
                <option value="Classification">Classification</option>
                </select>
                <label htmlFor = "state" className = "block mt-1 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
                <select id="state" className="bg-[rgba(255,255,255,0.96)]  border-300 text-900 text-sm rounded-lg block w-full p-2.5 border-gray-600 placeholder-gray-400  text-[#2c4090]">
                <option selected>Choose your state</option>
                <option value="Skill Match">Skill Match</option>
                <option value="Project Preference">Project Preference</option>
                <option value="Classification">Classification</option>
                </select>
              </form>
            </div>
            <form> 
              <div className = " mt-6 text-lg text-white font-medium">
                <h1>Maximum Team Number: </h1> 
              <label htmlFor = "max Number" className = "block mb-1 text-sm font-medium text-black"></label>
              <input type="text" id="max_number" className = " bg-[rgba(255,255,255,0.96)] mt-0 bg-white-100 border border-white-0 text-black-900 text-sm rounded-lg w-full p-2.5 bg-white-500 placeholder-black-400 dark:text-black" placeholder = "Enter number here" required />
            </div>
            </form>
        </div>
      </div>

    </div>
  );
}
