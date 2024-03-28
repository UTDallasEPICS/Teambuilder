import styles from './page.module.css';
import Head from 'next/head';

export default function Dashboard() {
  return ( 
    <div className={styles.backgroundFont}> 
      <div>
        <Head>
          <title>Dashboard</title>
        </Head>
      </div>

      <div className='border-solid rounded-t-3xl box-border ml-3 mr-3 bg-[rgba(90,91,88,0.49)] pl-4 pt-7'>

        <div className='box-border border-solid rounded-3xl min-h-44 mt-1 mr-9 ml-5 mb-3 bg-[rgba(48,100,162,0.29)]  flex flex-col'>
          <h1 className='ml-4 mt-3 text-xl'>Instruction</h1>
          <h2 className='ml-4 mt-2 mr-3'>Upload your student list here as an excel sheet. make sure you have these columns: blah blah blah. Thxxxx</h2>
        </div>

        <br></br>
        <div>
          <button className='ml-5 border-solid border-1 p-1 border-transparent rounded-xl bg-[rgba(96,241,135,0.9)]'>Student List Upload</button>
        </div>

        <br></br>
        <div>
          <button className='mt-20 ml-5 border-solid border-1 p-2 border-transparent rounded-xl bg-[rgba(96,241,135,0.9)] text-xl'>Form Teams &gt;&gt;</button>
        </div>
      
      </div>
    </div>
      
  );
}
