import styles from './page.module.css';
import Head from 'next/head';
import '../globals.css';

export default function Dashboard() {
  return ( 
    <div className={styles.backgroundFont}>
      <div>
        <Head>
          <title>Dashboard</title>
        </Head>

        <div className="flex">
          <img className='object-left-top object-contain h-32 w-64' src="logo1.png" alt="EPICS Logo" width="100"/>
          <div>
          <img className='object-left object-contain h-32 w-64' src="team-formation-text.png" alt="Team FOrmation Logo" width="100"/>
          </div>
          <div>
            <h2>Dashboard</h2>
          </div>

          </div>
        </div>

        <div className='border-solid rounded-3xl min-h-44 mt-1 mr-3 ml-5 mb-3 bg-[rgba(48,100,162,0.29)]  flex flex-col'>
          <h1 className='ml-5 mt-3 text-xl'>Instruction</h1>
          <h2 className='ml-5 mt-2'>Upload your student list here as an excel sheet. make sure you have these columns: blah blah blah. Thxxxx</h2>
        </div>

          <br></br>
          <div>
          <button className='border-solid border-2 border-sky-500 rounded-lg bg-cyan-500'>Student List Upload</button>
          </div>

          <br></br>
          <div>
            <button>Form Teams &gt;&gt;</button>
          </div>
    </div>
      
  );
}
