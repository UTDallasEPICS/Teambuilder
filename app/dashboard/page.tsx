import styles from './page.module.css';
import Head from 'next/head';

export default function Dashboard() {
  return (
    <div>
      <div className={styles.background}>
        <Head>
          <title>Dashboard</title>
        </Head>
        
        <img src="logo.png" alt="EPICS Logo" width="100"/>
        <br></br>
        <br></br>
        <div>
          <h1>EPICS Team Builder</h1>
        </div>
        <br></br>
        <div>
          <h2>Dashboard</h2>
        </div>
      
      </div>
     </div>
  );
}
