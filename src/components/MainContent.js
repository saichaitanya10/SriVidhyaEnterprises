import React from 'react';
import ItemEntry from "../assets/Itemsentry.png";
import Vendor from "../assets/vendor.png";
import sales from "../assets/sales.png";
import purchase from "../assets/purchase.png";
import Invoiceicon from "../assets/Invoiceicon.png";

const MainContent = () => {
  const getCurrentGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return "Good Morning";
    } else if (hours < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const greeting = getCurrentGreeting();
  console.log(greeting);

  return (
    <div className='p-12 w-full bg-zinc-800/40 h-screen backdrop-blur-sm'>
      <div className='rounded-xl bg-white p-7 mb-20 mt-10 w-auto bg-gradient-to-r from-slate-300 to-slate-500'>
        <h1 className='text-2xl font-semibold'>
          Hello! Vidhya Shree 
        </h1>
        <h2>{greeting}</h2>
      </div>
      
      <div className='w-full flex justify-between'>
      <a href='/ItemEntry' className='w-1/6 bg-white p-4 rounded-lg flex flex-col items-center'>
          <h1 className='text-xl font-semibold mb-4'>Item Entry</h1>
          <img className='w-4/5 mt-6 h-auto' src={ItemEntry} />
        </a>

        <a href='/VendorSupplier' className='w-1/6 bg-white p-4 rounded-lg flex flex-col items-center'>
          <h1 className='text-xl font-semibold mb-3'>Vendor/Supplier Data</h1>
          <img className='w-4/5 h-auto' src={Vendor} />
        </a>

        <a href='/purchase' className='w-1/6 bg-white p-4 rounded-lg flex flex-col items-center'>
          <h1 className='text-xl font-semibold mb-2'>Purchase Entry</h1>
          <img className='w-4/5 mt-8 h-auto' src={purchase} />
        </a>

        <a href='/sales' className='w-1/6 bg-white p-4 rounded-lg flex flex-col items-center'>
          <h1 className='text-xl font-semibold mb-2'>Sales Entry</h1>
          <img className='w-4/5 mt-8 h-auto' src={sales} />
        </a>   

        <a href='/InvoiceGenerator' className='w-1/6 bg-white p-4 rounded-lg flex flex-col items-center'>
          <h1 className='text-xl font-semibold mb-2'>Generate Invoice/Delivery Challan</h1>
          <img className='w-4/5  h-auto' src={Invoiceicon} />
        </a>
      </div>
    </div>
  );
};

export default MainContent;
