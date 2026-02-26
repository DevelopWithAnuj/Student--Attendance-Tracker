import React from 'react';
import SideNav from './_components/SideNav';
import Header from './_components/Header';
import { NotificationProvider } from '../_context/NotificationContext';

const Layout = ({ children }) => {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-slate-50/30 dark:bg-slate-950">
        <div className='md:w-64 fixed hidden md:block h-full z-50'>
          <SideNav/>
        </div>
        <div className='md:ml-64 flex flex-col min-h-screen'>
          <Header />
          <main className='flex-1'>
            {children}
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default Layout;
