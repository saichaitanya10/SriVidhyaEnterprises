import React, { useEffect, useState } from 'react';
import Navibar from '../components/Navibar';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjeK6iwS-yU7HcqAN1IaYdRApSxo_PNzA",
  authDomain: "sri-vidhya-enterprises.firebaseapp.com",
  projectId: "sri-vidhya-enterprises",
  storageBucket: "sri-vidhya-enterprises.appspot.com",
  messagingSenderId: "877623071348",
  appId: "1:877623071348:web:1d75d4660a42846d38b721",
  measurementId: "G-NZBHTQHH4N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Sales = () => {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'sales'));
        const salesList = querySnapshot.docs.map(doc => ({
          id: doc.id, // Include the document id
          ...doc.data()
        }));
        setSalesData(salesList);
      } catch (error) {
        console.error("Error fetching sales data: ", error);
      }
    };

    fetchSalesData();
  }, []);

  const handleEdit = (id) => {
    navigate(`/add-salesrow/${id}`); // Navigate to the edit page with the id as a parameter
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, 'sales', id));
        toast.success('Document deleted successfully!');
        setSalesData(salesData.filter(sale => sale.id !== id)); // Remove deleted document from state
      } catch (error) {
        console.error("Error deleting document: ", error);
        toast.error('Error deleting document.');
      }
    }
  };

  const handleAddRow = () => {
    navigate('/add-salesrow');
  };

  return (
    <div>
      <Navibar />
      <div className='p-8 w-full bg-zinc-800/40 h-screen backdrop-blur-sm'>
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sales Transaction History</h1>

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

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th scope="col" className="px-2 py-3 w-20">Date</th>
                  <th scope="col" className="px-2 py-3 w-24">Product Name</th>
                  <th scope="col" className="px-2 py-3 w-40">Description</th>
                  <th scope="col" className="px-2 py-3 w-24">HSN/SAC Code</th>
                  <th scope="col" className="px-2 py-3 w-24">GST Number</th>
                  <th scope="col" className="px-2 py-3 w-24">Invoice Number</th>
                  <th scope="col" className="px-2 py-3 w-16">Quantity</th>
                  <th scope="col" className="px-2 py-3 w-24">Taxable Value</th>
                  <th scope="col" className="px-2 py-3 w-16">GST Rate</th>
                  <th scope="col" className="px-2 py-3 w-16">CGST</th>
                  <th scope="col" className="px-2 py-3 w-16">SGST</th>
                  <th scope="col" className="px-2 py-3 w-16">IGST</th>
                  <th scope="col" className="px-2 py-3 w-24">Total Tax</th>
                  <th scope="col" className="px-2 py-3 w-24">Final Amount</th>
                  <th scope="col" className="px-2 py-3 w-24">Payment Mode</th>
                  <th scope="col" className="px-2 py-3 w-32">Remark</th>
                  <th scope="col" className="px-2 py-3 w-24">Payment Status</th>
                  <th scope="col" className="px-2 py-3 w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((sale) => (
                  <tr key={sale.id} className="bg-white border-b">
                    <td className="px-2 py-4 text-xs">{new Date(sale.createdAt.seconds * 1000).toLocaleDateString()}</td>
                    <td className="px-2 py-4 text-xs font-medium text-gray-900">{sale.salesDetails[0].ItemName}</td>
                    <td className="px-2 py-4 text-xs">{sale.salesDetails[0].ItemDescription}</td>
                    <td className="px-2 py-4 text-xs">{sale.salesDetails[0].HsnSacCode}</td>
                    <td className="px-2 py-4 text-xs">{sale.salesDetails[0].GstNumber}</td>
                    <td className="px-2 py-4 text-xs">{sale.salesDetails[0].InvoiceNumber}</td>
                    <td className="px-2 py-4 text-xs">{sale.salesDetails[0].Quantity}</td>
                    <td className="px-2 py-4 text-xs">{sale.salesDetails[0].TaxableValue}</td>
                    <td className="px-2 py-4 text-xs">{sale.salesDetails[0].GstRate}</td>
                    <td className="px-2 py-4 text-xs">{sale.salesDetails[0].CGST}</td>
                    <td className="px-2 py-4 text-xs">{sale.salesDetails[0].SGST}</td>
                    <td className="px-2 py-4 text-xs">{sale.salesDetails[0].IGST}</td>
                    <td className="px-2 py-4 text-xs">{sale.salesDetails[0].TotalTax}</td>
                    <td className="px-2 py-4 text-xs">{sale.salesDetails[0].FinalAmount}</td>
                    <td className="px-2 py-4 text-xs">{sale.salesDetails[0].PaymentMode}</td>
                    <td className="px-2 py-4 text-xs">{sale.salesDetails[0].Remark}</td>
                    <td className={`px-2 py-4 text-xs ${sale.salesDetails[0].PaymentStatus === 'Successful' ? 'text-green-600' : sale.salesDetails[0].PaymentStatus === 'Pending' ? 'text-yellow-600' : ''}`}>
                      {sale.salesDetails[0].PaymentStatus}
                    </td>
                    <td className="px-2 py-4 text-xs">
                      <button 
                        onClick={() => handleEdit(sale.id)} 
                        className="text-blue-600 hover:underline mr-2"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(sale.id)} 
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

export default Sales;
