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
            <h1>EPICS Team Builder</h1>
          </div>
          <div>
            <h2>Dashboard</h2>
          </div>

        </div>
      </div>
     </div>
  );
}
