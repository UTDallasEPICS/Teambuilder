import './page.css';
import Head from 'next/head';
import '../globals.css';

export default function SignIn () {
  return (
    <div style={{ display: 'flex', 
    flexDirection: 'column', alignItems: 'center', 
    justifyContent: 'center', height: '100vh' }}>
    

    <Head>
      <title>Login Page</title>
    </Head>

    <h2>Login</h2>
    

    <form style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
      <input type="text" placeholder="Username" style={{ marginBottom: '10px', padding: '10px' }} />
      <input type="password" placeholder="Password" style={{ marginBottom: '20px', padding: '10px' }} />
      <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Sign In</button>
    </form>
  </div>
);
}