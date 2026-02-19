import React from 'react';
import SideNav from './_components/SideNav';
import Header from './_components/Header';
import { NotificationProvider } from '../_context/NotificationContext';

const Layout= ({children}) => {
  return (
    <NotificationProvider>
      <div>
        <div className='md:w-64 fixed hidden md:block'>
          <SideNav/>
        </div>
        <div className='md:ml-64'>
          <Header />
          <div className='p-4'>
            {children}
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default Layout;
