import { useEffect } from 'react';
import Router from 'next/router';

export const withAuth = (WrappedComponent: any) => {
  const AuthComponent = (props: any) => {
    useEffect(() => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (!isLoggedIn) {
        Router.replace('/signin'); // Redirect to the signin page if not logged in
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};
