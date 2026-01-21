import React from 'react';
import SideNav from './_components/SideNav';
import Header from './_components/Header';

const Layout= ({children}) => {
  return (
    <div>
      <div className='md:w-64 fixed hidden md:block'>
        <SideNav/>
      </div>
      <div className='md:ml-64 p-4'>
        <Header />
        {children}
      </div>
    </div>
  );
};

export default Layout;
