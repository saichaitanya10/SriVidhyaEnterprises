import React, { useState, useEffect } from 'react';
import Navibar from '../components/Navibar';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import toast from 'react-hot-toast';

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

const SupplierDetails = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "suppliers"));
        const suppliersList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt ? data.createdAt.toDate().toLocaleDateString() : 'N/A'
          };
        });
        setSuppliers(suppliersList);
        setFilteredSuppliers(suppliersList);
      } catch (error) {
        console.error("Error fetching supplier data: ", error);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const results = suppliers.filter(supplier =>
      supplier.partyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuppliers(results);
  }, [searchTerm, suppliers]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddRow = () => {
    navigate('/AddSupplier'); // Path for adding a new supplier
  };

  const handleEdit = (id) => {
    navigate(`/AddSupplier/${id}`); // Path for editing supplier details
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    try {
      await deleteDoc(doc(db, "suppliers", id));
      setSuppliers(suppliers.filter(supplier => supplier.id !== id));
      setFilteredSuppliers(filteredSuppliers.filter(supplier => supplier.id !== id));
      toast.success('Supplier deleted successfully!');
    } catch (error) {
      console.error("Error deleting supplier: ", error);
      toast.error('Error deleting supplier. Please try again.');
    }
  };

  return (
    <div>
      <Navibar />
      <div className='p-6 w-full bg-zinc-800/40 h-screen backdrop-blur-sm'>
        <div className="container mx-auto">
          <div className="relative mb-4">
            <button 
              onClick={() => navigate('/VendorSupplierSelection')} 
              className="absolute right-4 bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
            >
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Supplier Data Entry</h1>
          </div>

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
                  className="block w-full p-3 pl-10 text-sm text-gray-900 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Search Party Name" 
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <button 
                type="submit" 
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 mr-2 py-2"
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
            <table className="w-full text-sm text-left rtl:text-right text-gray-700 border-collapse border border-gray-300">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 border-b border-gray-300">
                <tr>
                  <th scope="col" className="px-4 py-2">Date</th>
                  <th scope="col" className="px-4 py-2">Party Name</th>
                  <th scope="col" className="px-4 py-2">Contact Number</th>
                  <th scope="col" className="px-4 py-2">GST Number</th>
                  <th scope="col" className="px-4 py-2">Address</th>
                  <th scope="col" className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="bg-white border-b border-gray-300">
                    <td className="px-4 py-4 whitespace-nowrap">{supplier.createdAt}</td>
                    <td className="px-4 py-4">{supplier.partyName}</td>
                    <td className="px-4 py-4">{supplier.contactNumber}</td>
                    <td className="px-4 py-4">{supplier.gstNumber}</td>
                    <td className="px-4 py-4">{supplier.address}</td>
                    <td className="px-4 py-4">
                      <button 
                        onClick={() => handleEdit(supplier.id)} 
                        className="text-blue-600 hover:underline mr-2"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(supplier.id)} 
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
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

export default SupplierDetails;
