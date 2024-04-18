
"use client";


import styles from './page.module.css';
import Head from 'next/head';
import Link from 'next/link';
import React, { useRef } from 'react';

export default function Signin() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Assuming the current property will always be present when this function runs
    const username = usernameRef.current!.value;
    const password = passwordRef.current!.value;
    console.log('Login attempted with username:', username, 'and password:', password);
    // Here you might want to call an API to authenticate the user

    if(username == 'epics' && password == 'epicsrocks')
    {
        window.location.href = '/project';
    }
    else
    {
        alert('Invalid username or password');
    }


  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Sign In</title>
        <meta name="description" content="Sign in to your account" />
      </Head>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" ref={usernameRef} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" ref={passwordRef} required />
        </div>
        <button type="submit" className={styles.button}>Login</button>
        <p className={styles.signupPrompt}>
        </p>
      </form>
    </div>

  );
}
