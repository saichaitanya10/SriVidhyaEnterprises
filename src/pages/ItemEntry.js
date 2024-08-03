import React, { useEffect, useState } from 'react';
import Navibar from '../components/Navibar';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjeK6iwS-yU7HcqAN1IaYdRApSxo_PNzA",
  authDomain: "sri-vidhya-enterprises.firebaseapp.com",
  projectId: "sri-vidhya-enterprises",
  storageBucket: "sri-vidhya-enterprises.appspot.com",
  messagingSenderId: "877623071348",
  appId: "1:877623071348:web:1d75d4660a42846d38b721",
  measurementId: "G-NZBHTQHH4N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ItemEntry = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch items from Firestore in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'items'), (querySnapshot) => {
      const itemsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(itemsList);
    }, (error) => {
      console.error("Error fetching documents: ", error);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);
  console.log(items)

  // Search functionality
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter items based on search term
  const filteredItems = items.filter(item => {
    // Ensure itemDescription is a string before applying toLowerCase
    const description = item.itemDescription ? item.itemDescription.toLowerCase() : '';
    return description.includes(searchTerm.toLowerCase());
  });

  const handleAddRow = () => {
    navigate('/ItemRow'); // Adjust the navigation path as needed
  };

  return (
    <div>
      <Navibar />
      <div className='p-8 w-full bg-zinc-800/40 h-screen backdrop-blur-sm'>
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Item Details</h1>

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
                  className="block w-full p-4 pl-10 text-sm text-gray-900 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Search Item Description" 
                  value={searchTerm}
                  onChange={handleSearchChange}
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
              Add Details
            </button>
          </div>

          {/* Table */}
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white mb-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table className="w-full text-lg text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Item Code</th>
                  <th scope="col" className="px-6 py-3">Item Description</th>
                  <th scope="col" className="px-6 py-3">HSN Code</th>
                  <th scope="col" className="px-6 py-3">Unit of Measurement</th>
                  <th scope="col" className="px-6 py-3">GST Rate</th>
                  <th scope="col" className="px-6 py-3">Tax Amount</th>
                  <th scope="col" className="px-6 py-3">Purchase Amount (without tax)</th>
                </tr>
              </thead>
              <tbody className='overflow-y-scroll'>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <tr key={index} className="bg-white border-b">
                      <td className="px-6 py-4">{item.items[0].date || 'N/A'}</td>
                      <td className="px-6 py-4">{item.items[0].itemCode || 'N/A'}</td>
                      <td className="px-6 py-4">{item.items[0].itemDescription || 'N/A'}</td>
                      <td className="px-6 py-4">{item.items[0].hsnCode || 'N/A'}</td>
                      <td className="px-6 py-4">{item.items[0].unitOfMeasurement || 'N/A'}</td>
                      <td className="px-6 py-4">{item.items[0].gstRate || 'N/A'}</td>
                      <td className="px-6 py-4">{item.items[0].taxAmount || 'N/A'}</td>
                      <td className="px-6 py-4 text-green-600">{`₹${item.items[0].purchasePrice || '0'}`}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No items found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemEntry;
