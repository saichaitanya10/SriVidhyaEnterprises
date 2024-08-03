import React, { useState, useEffect } from 'react';
import Navibar from '../components/Navibar';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

const VendorSupplier = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVendors, setFilteredVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "vendors"));
        const vendorsList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt ? data.createdAt.toDate().toLocaleDateString() : 'N/A'
          };
        });
        setVendors(vendorsList);
        setFilteredVendors(vendorsList);
      } catch (error) {
        console.error("Error fetching vendor data: ", error);
      }
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    const results = vendors.filter(vendor =>
      vendor.partyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVendors(results);
  }, [searchTerm, vendors]);

  const handleAddRow = () => {
    navigate('/VendorDetails'); // Adjust the navigation path as needed
  };

  const handleInputChange = (index, field, value) => {
    const newVendors = vendors.map((vendor, i) => {
      if (i === index) {
        return { ...vendor, [field]: value };
      }
      return vendor;
    });
    setVendors(newVendors);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <Navibar />
      <div className='p-8 w-full bg-zinc-800/40 h-screen backdrop-blur-sm'>
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Vendor Details</h1>

          <div className="flex items-center justify-between mb-4 gap-4">
            <form 
              className="flex-grow flex items-center border border-gray-300 rounded-lg bg-white shadow-md"
              onSubmit={(e) => e.preventDefault()} // Prevent form submission
            >
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
                  placeholder="Search Party Name" 
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

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
            <table className="w-full text-lg text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th scope="col" className="px-4 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Party Name</th>
                  <th scope="col" className="px-6 py-3">Contact Number</th>
                  <th scope="col" className="px-6 py-3">GST Number</th>
                  <th scope="col" className="px-6 py-3">Billing Address</th>
                  <th scope="col" className="px-6 py-3">Shipping Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor, index) => (
                  <tr key={vendor.id} className="bg-white">
                    <td className="px-4 py-4 whitespace-nowrap">{vendor.createdAt}</td>
                    <td className="px-6 py-4">
                      <input 
                        type="text" 
                        value={vendor.partyName} 
                        onChange={(e) => handleInputChange(index, 'partyName', e.target.value)} 
                        className="w-full p-2"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="text" 
                        value={vendor.contactNumber} 
                        onChange={(e) => handleInputChange(index, 'contactNumber', e.target.value)} 
                        className="w-full p-2"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="text" 
                        value={vendor.gstNumber} 
                        onChange={(e) => handleInputChange(index, 'gstNumber', e.target.value)} 
                        className="w-full p-2"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="text" 
                        value={vendor.billingAddress} 
                        onChange={(e) => handleInputChange(index, 'billingAddress', e.target.value)} 
                        className="w-full p-2"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="text" 
                        value={vendor.shippingAddress} 
                        onChange={(e) => handleInputChange(index, 'shippingAddress', e.target.value)} 
                        className="w-full p-2"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSupplier;
