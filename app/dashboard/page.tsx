import styles from './page.module.css';
import Head from 'next/head';
import '../globals.css';

export default function Dashboard() {
  return ( 
    <div>
      <div className={styles.background}>
        <Head>
          <title>Dashboard</title>
        </Head>

        <div className="flex justify-between">
          <img src="logo1.png" alt="EPICS Logo" width="100"/>
          <div>
          <img src="team-formation-text.png" alt="Team FOrmation Logo" width="100"/>
          </div>
          <div>
            <h2>Dashboard</h2>
          </div>

          </div>
        </div>

        <div className='border-solid border-2 border-sky-500 rounded-3xl bg-cyan-500 min-h-44 mt-1 mr-3 ml-3 mb-3'>
          <h1>Instruction</h1>
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
