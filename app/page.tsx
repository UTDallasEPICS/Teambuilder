import Image from 'logo.png'
import styles from './page.module.css'
import './globals.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <a href="dashboard">Go to Dashboard</a>
        <a href="display">Go to Display</a>
        <a href="project">Go to Project</a>
      </div>
    </main>
  )
}
