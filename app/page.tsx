
import Layout from './layout';
import './globals.css';
import Navbar from  './components/Navbar'
import Dashboard from './dashboard/page';
import Link from 'next/link'

import styles from './page.module.css'

export default function Home() {

  return (

    <main className={styles.main}>
      <Navbar/>
      <Dashboard/>
      <div>

      </div>
    </main>
  );
}
