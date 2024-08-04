import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navibar from '../components/Navibar';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

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

const EditSalesRow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [row, setRow] = useState({
    Date: '',
    ItemName: '',
    ItemDescription: '',
    HsnSacCode: '',
    GstNumber: '',
    InvoiceNumber: '',
    Quantity: '',
    TaxableValue: '',
    GstRate: '',
    CGST: '',
    SGST: '',
    IGST: '',
    TotalTax: '',
    FinalAmount: '',
    PaymentMode: '',
    Remark: '',
    PaymentStatus: 'Pending'
  });
  
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        if (!id) return;
        const docRef = doc(db, 'sales', id);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          let data = docSnap.data();
          let salesDetails = data.salesDetails || [];
          
          // Ensure that salesDetails is an array and has at least one element
          if (salesDetails.length > 0) {
            // Assuming salesDetails[0] contains the required fields
            let salesData = salesDetails[0]; 
  
            // Map the fields to their corresponding state elements
            const mappedData = {
              Date: salesData.Date || '',
              ItemName: salesData.ItemName || '',
              ItemDescription: salesData.ItemDescription || '',
              HsnSacCode: salesData.HsnSacCode || '',
              GstNumber: salesData.GstNumber || '',
              InvoiceNumber: salesData.InvoiceNumber || '',
              Quantity: salesData.Quantity || '',
              TaxableValue: salesData.TaxableValue || '',
              GstRate: salesData.GstRate || '',
              CGST: salesData.CGST || '',
              SGST: salesData.SGST || '',
              IGST: salesData.IGST || '',
              TotalTax: salesData.TotalTax || '',
              FinalAmount: salesData.FinalAmount || '',
              PaymentMode: salesData.PaymentMode || '',
              Remark: salesData.Remark || '',
              PaymentStatus: salesData.PaymentStatus || 'Pending'
            };
  
            console.log(mappedData);
            setRow(mappedData);
          } else {
            toast.error('Sales details are empty!');
          }
        } else {
          toast.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        toast.error('Error fetching data.');
      }
    };
  
    fetchSalesData();
  }, [id]);

  const handleInputChange = (key, value) => {
    setRow(prevRow => {
      const updatedRow = { ...prevRow, [key]: value };

      if (key === 'GstRate' || key === 'TaxableValue') {
        const gstRate = parseFloat(updatedRow.GstRate) || 0;
        const taxableValue = parseFloat(updatedRow.TaxableValue) || 0;

        updatedRow.CGST = ((gstRate / 2) / 100 * taxableValue).toFixed(2);
        updatedRow.SGST = ((gstRate / 2) / 100 * taxableValue).toFixed(2);
        updatedRow.IGST = (gstRate / 100 * taxableValue).toFixed(2);
        updatedRow.TotalTax = (parseFloat(updatedRow.CGST) + parseFloat(updatedRow.SGST) + parseFloat(updatedRow.IGST)).toFixed(2);
        updatedRow.FinalAmount = (taxableValue + parseFloat(updatedRow.TotalTax)).toFixed(2);
      }

      return updatedRow;
    });
  };

  const handleAgreeChange = () => {
    setIsAgreed(!isAgreed);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!isAgreed) {
      toast.error('You must agree to the terms and conditions to proceed.');
      return;
    }

    try {
      const docRef = doc(db, 'sales', id);
      await updateDoc(docRef, {
        salesDetails: [row],
        updatedAt: new Date()
      });
      toast.success('Document updated successfully!');
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Error updating document.');
    }

    navigate('/sales');
  };

  const formatLabel = (key) => {
    switch (key) {
      case 'GstNumber':
        return 'GST Number';
      case 'HsnSacCode':
        return 'HSN/SAC Code';
      case 'GstRate':
        return 'GST Rate';
      default:
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
  };

  return (
    <div>
      <Navibar />
      <div className='p-10 w-full bg-zinc-800/40 h-screen backdrop-blur-sm'>
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Sales Details</h1>
            <button 
              onClick={() => navigate('/sales')} 
              className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
            >
              Back
            </button>
          </div>
          <div className="p-4 border border-gray-300 rounded-lg bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(row).map((key, idx) => {
                if (key === 'PaymentMode') {
                  return (
                    <div key={idx} className="col-span-1">
                      <label className="block font-medium">Mode of Payment</label>
                      <select 
                        value={row[key]}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Select Payment Mode</option>
                        <option value="PhonePe/GPay/Paytm">PhonePe/GPay/Paytm</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cheque">Cheque</option>
                      </select>
                    </div>
                  );
                }
                if (key === 'PaymentStatus') {
                  return (
                    <div key={idx} className="col-span-1 flex items-center">
                      <label className="block font-medium mr-2">Payment Status:</label>
                      <button 
                        onClick={() => handleInputChange(key, row[key] === 'Pending' ? 'Successful' : 'Pending')}
                        className={`py-2 px-4 rounded ${row[key] === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'} text-white`}
                      >
                        {row[key]}
                      </button>
                    </div>
                  );
                }
                return (
                  <div key={idx} className="col-span-1">
                    <label className="block font-medium">{formatLabel(key)}</label>
                    <input
                      type="text"
                      value={row[key]}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={handleAgreeChange}
              className="mr-2"
            />
            <label className='text-white'>I agree to the terms and conditions</label>
          </div>
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSalesRow;
