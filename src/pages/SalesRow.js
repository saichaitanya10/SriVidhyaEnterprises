import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navibar from '../components/Navibar';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
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

const SalesRow = () => {
  const [rows, setRows] = useState([{
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
  }]);
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();

  const fetchItemDetails = async (itemCode, index) => {
    try {
      console.log('Fetching item details for itemCode:', itemCode);
  
      // Fetch all documents from the 'items' collection
      const q = query(collection(db, 'items'));
      const querySnapshot = await getDocs(q);
      console.log('Query results:', querySnapshot.docs);
  
      let found = false;
  
      querySnapshot.forEach(doc => {
        const data = doc.data();
        
        if (data.items && Array.isArray(data.items)) {
          const item = data.items.find(i => i.itemCode === itemCode);
          
          if (item) {
            const updatedRows = [...rows];
            updatedRows[index] = {
              ...updatedRows[index],
              ItemDescription: item.itemDescription || '',
              HsnSacCode: item.hsnCode || '',
              GstRate: item.gstRate || '',
            };
            setRows(updatedRows);
            found = true;
          }
        }
      });
  
      if (!found) {
        toast.error('Item not found.');
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
      setTimeout(() => {
        toast.error('Error fetching item details: ' + error.message);
      }, 2000); // 2000 milliseconds = 2 seconds
    }
  };

  const fetchPartyDetails = async (partyName, index) => {
    try {
      console.log('Fetching vendor details for partyName:', partyName);
  
      // Fetch all documents from the 'vendors' collection
      const q = query(collection(db, 'vendors'));
      const querySnapshot = await getDocs(q);
      console.log('Query results:', querySnapshot.docs);
  
      let found = false;
  
      querySnapshot.forEach(doc => {
        const data = doc.data();
        
        if (data.partyName && data.partyName.toLowerCase() === partyName.toLowerCase()) {
          const updatedRows = [...rows];
          updatedRows[index] = {
            ...updatedRows[index],
            GstNumber: data.gstNumber || '',
            BillingAddress: data.billingAddress || '',
            ShippingAddress: data.shippingAddress || ''
          };
          setRows(updatedRows);
          toast.success("Vendor found.");
          found = true;
        }
      });
  
      if (!found) {
        toast.error('Vendor not found.');
      }
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      setTimeout(() => {
        toast.error('Error fetching vendor details: ' + error.message);
      }, 2000); // 2000 milliseconds = 2 seconds
    }
  };

  const handleInputChange = (index, field, value) => {
    const newRows = rows.map((row, i) => {
      if (i === index) {
        row[field] = value;

        if (field === 'ItemName') {
          fetchItemDetails(value, index);
        }

        if(field === 'PartyName') {
          fetchPartyDetails(value, index);
        }

        // Calculate CGST, SGST, IGST, Total Tax, and Final Amount based on the GST Rate and Taxable Value
        if (field === 'GstRate' || field === 'TaxableValue') {
          const gstRate = parseFloat(row.GstRate) || 0;
          const taxableValue = parseFloat(row.TaxableValue) || 0;
  
          row.CGST = ((gstRate / 2) / 100 * taxableValue).toFixed(2);
          row.SGST = ((gstRate / 2) / 100 * taxableValue).toFixed(2);
          row.IGST = (gstRate / 100 * taxableValue).toFixed(2);
          row.TotalTax = (parseFloat(row.CGST) + parseFloat(row.SGST) + parseFloat(row.IGST)).toFixed(2);
          row.FinalAmount = (taxableValue + parseFloat(row.TotalTax)).toFixed(2);
        }
      }
      return row;
    });
    setRows(newRows);
  };

  const handleAgreeChange = () => {
    setIsAgreed(!isAgreed);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAgreed) {
      toast.error('You must agree with the terms and conditions to proceed.');
      return;
    }

    try {
      await addDoc(collection(db, 'sales'), {
        salesDetails: rows,
        createdAt: new Date()
      });
      toast.success('Form submitted successfully!');
      setRows([{
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
      }]);
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error('Error submitting form');
    }

    navigate(-1);
  };

  const togglePaymentStatus = (index) => {
    const newRows = rows.map((row, i) => {
      if (i === index) {
        row.PaymentStatus = row.PaymentStatus === 'Pending' ? 'Successful' : 'Pending';
      }
      return row;
    });
    setRows(newRows);
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
      <div className='p-4 w-full bg-zinc-800/40 h-screen backdrop-blur-sm'>
        <div className="container mx-auto">
          <div className="flex justify-between items-center ">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Enter Sales Details</h1>
            <button 
              onClick={() => navigate(-1)} 
              className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600 text-sm"
            >
              Back
            </button>
          </div>
          {rows.map((row, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(row).map((key, idx) => {
                  if (key === 'GstRate') {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium text-sm">GST Rate</label>
                        <select 
                          value={row[key]}
                          onChange={(e) => handleInputChange(index, key, e.target.value)}
                          className="w-full border p-2 rounded text-sm"
                        >
                          <option value="">Select GST Rate</option>
                          <option value="5">5%</option>
                          <option value="12">12%</option>
                          <option value="18">18%</option>
                          <option value="28">28%</option>
                        </select>
                      </div>
                    );
                  }
                  if (key === 'PaymentMode') {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium text-sm">Mode of Payment</label>
                        <select 
                          value={row[key]}
                          onChange={(e) => handleInputChange(index, key, e.target.value)}
                          className="w-full border p-2 rounded text-sm"
                        >
                          <option value="">Select Payment Mode</option>
                          <option value="PhonePe/GPay/Paytm">PhonePe/GPay/Paytm</option>
                          <option value="Netbanking">Netbanking</option>
                          <option value="UPI">UPI</option>
                          <option value="Cash">Cash</option>
                        </select>
                      </div>
                    );
                  }
                  if (key === 'PaymentStatus') {
                    return (
                      <div key={idx} className="col-span-1 flex items-center">
                        <label className="block font-medium mr-2 text-sm">Payment Status:</label>
                        <button 
                          onClick={() => togglePaymentStatus(index)} 
                          className={`py-1 px-2 rounded ${row[key] === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'} text-sm`}
                        >
                          {row[key]}
                        </button>
                      </div>
                    );
                  }
                  if (key === 'Date') {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium text-sm">Date</label>
                        <input
                          type="date"
                          value={row[key]}
                          onChange={(e) => handleInputChange(index, key, e.target.value)}
                          className="w-full border p-2 rounded text-sm"
                        />
                      </div>
                    );
                  }
                  return (
                    <div key={idx} className="col-span-1">
                      <label className="block font-medium text-sm">{formatLabel(key)}</label>
                      <input
                        type="text"
                        value={row[key]}
                        onChange={(e) => handleInputChange(index, key, e.target.value)}
                        className="w-full border p-2 rounded text-sm"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={handleAgreeChange}
              className="mr-2"
            />
            <label className='text-white text-sm'>I agree to the terms and conditions</label>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 text-sm"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesRow;
