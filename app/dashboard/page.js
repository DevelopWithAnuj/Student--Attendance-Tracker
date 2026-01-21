"use client"
import React, { useEffect } from 'react';
import { useTheme } from "next-themes"

const Dashboard= () => {
    const { setTheme } = useTheme()

    useEffect(()=>{
      setTheme('light');
    },[])
  return (
    <div className=''>
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;
