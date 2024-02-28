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
            <div className = "mt-0.2 text-lg text-white font-medium">
              <h1>Attribute Importance: </h1>
            </div>
            <div className = " mt-6 text-lg text-white font-medium">
              <h1>Maximum Team Number: </h1>
            </div>
        </div>
      </div>

    </div>
  );
}
