import React, { useEffect, useState } from 'react';
import Navibar from '../components/Navibar';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const PurchaseRow = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const q = query(collection(db, 'purchase'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedPurchases = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPurchases(fetchedPurchases);
      } catch (error) {
        console.error('Error fetching purchase details:', error);
      }
    };

    fetchPurchases();
  }, [db]);

  const handleAddRow = () => {
    navigate('/add-purchaserow');
  };

  const handleEdit = (id) => {
    navigate(`/add-purchaserow/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'purchase', id));
      setPurchases(purchases.filter(purchase => purchase.id !== id));
      toast.success("Successfully deleted purchase")
    } catch (error) {
      console.error('Error deleting purchase:', error);
    }
  };

  return (
    <div>
      <Navibar />
      <div className='p-8 w-full bg-zinc-800/40 h-screen backdrop-blur-sm'>
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Purchase Transaction History</h1>
          
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
            <table className="w-full text-lg text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-zinc-700 uppercase bg-gray-50">
                <tr className='bg-zinc-200'>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">Date</th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">Party Name</th>
                  <th scope="col" className="px-6 py-3">GST Number</th>
                  <th scope="col" className="px-6 py-3">Item Name</th>
                  <th scope="col" className="px-6 py-3">Item Description</th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">HSN/SAC Code</th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">Invoice Number</th>
                  <th scope="col" className="px-6 py-3">Quantity</th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">Taxable Value</th>
                  <th scope="col" className="px-6 py-3">GST Rate</th>
                  <th scope="col" className="px-6 py-3">IGST</th>
                  <th scope="col" className="px-6 py-3 ">Total Tax</th>
                  <th scope="col" className="px-6 py-3">Final Amount</th>
                  <th scope="col" className="px-6 py-3">Payment Mode</th>
                  <th scope="col" className="px-6 py-3">Remark</th>
                  <th scope="col" className="px-6 py-3">Payment Status</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <React.Fragment key={purchase.id}>
                    {purchase.purchaseDetails.map((row, idx) => (
                      <tr key={idx} className="bg-white text-sm border-b">
                        <td className="px-6 py-4 whitespace-nowrap">{row.Date}</td>
                        <td className="px-6 py-4 ">{row.PartyName}</td>
                        <td className="px-6 py-4">{row.GstNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.ItemName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.ItemDescription}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.HsnSacCode}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.InvoiceNumber}</td>
                        <td className="px-6 py-4">{row.Quantity}</td>
                        <td className="px-6 py-4">{row.TaxableValue}</td>
                        <td className="px-6 py-4">{row.GstRate}</td>
                        <td className="px-6 py-4">{row.IGST}</td>
                        <td className="px-6 py-4">{row.TotalTax}</td>
                        <td className="px-6 py-4">{row.FinalAmount}</td>
                        <td className="px-6 py-4">{row.PaymentMode}</td>
                        <td className="px-6 py-4">{row.Remark}</td>
                        <td className="px-6 py-4">{row.PaymentStatus}</td>
                        <td className="px-6 py-4 flex items-center">
                          <button 
                            onClick={() => handleEdit(purchase.id)}
                            className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 mr-2"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(purchase.id)}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRow;
