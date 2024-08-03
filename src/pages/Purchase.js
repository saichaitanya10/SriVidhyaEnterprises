import React from 'react';
import Navibar from '../components/Navibar';
import { useNavigate } from 'react-router-dom';

const   PurchaseRow = () => {
  const navigate = useNavigate();

  const handleAddRow = () => {
    navigate('/add-purchaserow');
  };

  return (
    <div>
      <Navibar />
      <div className='p-8 w-full bg-zinc-800/40 h-screen backdrop-blur-sm'>
        <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Purchase Transaction History</h1>
          {/* Search and Add Row Buttons in a single row */}
          <div className="flex items-center justify-between mb-4 gap-4">
            <form className="flex-grow flex items-center border border-gray-300 rounded-lg bg-white shadow-md">
              <label htmlFor="default-search" className="sr-only">Search</label>
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input 
                  type="search" 
                  id="default-search" 
                  className="block w-full p-4 pl-10 text-sm text-gray-900  rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Search Product Name" 
                />
              </div>
              <button 
                type="submit" 
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 mr-2 py-2"
              >
                Search
              </button>
            </form>

            <button 
              onClick={handleAddRow} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              Add Row
            </button>
          </div>

          {/* Table */}
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
            <table className="w-full text-lg text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-zinc-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Product Name</th>
                  <th scope="col" className="px-6 py-3">GST Number</th>
                  <th scope="col" className="px-6 py-3">Quantity</th>
                  <th scope="col" className="px-6 py-3">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4">2024-07-01</td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">Apple MacBook Pro 17"</th>
                  <td className="px-6 py-4">123456789</td>
                  <td className="px-6 py-4">10</td>
                  <td className="px-6 py-4 text-red-600">$2999</td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4">2024-07-02</td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">Microsoft Surface Pro</th>
                  <td className="px-6 py-4">987654321</td>
                  <td className="px-6 py-4">5</td>
                  <td className="px-6 py-4 text-red-600">$1999</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4">2024-07-03</td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">Magic Mouse 2</th>
                  <td className="px-6 py-4">456789123</td>
                  <td className="px-6 py-4">20</td>
                  <td className="px-6 py-4 text-red-600">$99</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRow;
