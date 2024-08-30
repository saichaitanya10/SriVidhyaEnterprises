import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navibar from '../components/Navibar';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
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
    PartyName: '',
    GstNumber: '',
    ItemName: '',
    ItemDescription: '',
    HsnSacCode: '',
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
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const q = query(collection(db, 'suppliers'));
        const querySnapshot = await getDocs(q);
        const suppliers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          partyName: doc.data().partyName,
          gstNumber: doc.data().gstNumber,
        }));
        console.log(suppliers)
        setSupplierOptions(suppliers);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        toast.error('Error fetching suppliers');
      }
    };
  
    const fetchItems = async () => {
      try {
        const q = query(collection(db, 'items'));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
          
     
            id: doc.id,
            itemDescription: doc.data().items[0].itemDescription || '',
            hsnCode: doc.data().items[0].hsnCode || '',
            // itemDescripdtion: doc.data().itemDescription || ''
        
        }));
        console.log('Items:', items); // Debugging
        setItemOptions(items);
      } catch (error) {
        console.error('Error fetching items:', error);
        toast.error('Error fetching items');
      }
    };
  
    fetchSuppliers();
    fetchItems();
  }, []);
  

  const fetchItemDetails = (itemCode, index) => {
    const selectedItem = itemOptions.find(item => item.itemCode === itemCode);
    if (selectedItem) {
      const newRows = rows.map((row, i) => {
        if (i === index) {
          row.ItemDescription = selectedItem.itemDescription;
          row.HsnSacCode = selectedItem.hsnCode; // Assuming you want to set HSN Code as well
        }
        return row;
      });
      setRows(newRows);
    }
  };

  const fetchPartyDetails = (partyName, index) => {
    const selectedParty = supplierOptions.find(supplier => supplier.partyName === partyName);
    if (selectedParty) {
      const newRows = rows.map((row, i) => {
        if (i === index) {
          row.GstNumber = selectedParty.gstNumber;
        }
        return row;
      });
      setRows(newRows);
    }
  };

  const handleInputChange = (index, field, value) => {
    const newRows = rows.map((row, i) => {
      if (i === index) {
        row[field] = value;

        if (field === 'ItemName') {
          const itemCode = itemOptions.find(item => item.itemName === value)?.itemCode;
          if (itemCode) {
            fetchItemDetails(itemCode, index);
          }
        }

        if (field === 'PartyName') {
          fetchPartyDetails(value, index);
        }

        // Your existing tax calculation code
      }
      return row;
    });
    setRows(newRows);
  };

  const handleDateChange = (date, index) => {
    const newRows = rows.map((row, i) => {
      if (i === index) {
        row.Date = date;
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
    // Your existing form submission code
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
          <div className="flex justify-between items-center">
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
                  if (key === 'PartyName') {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium text-sm">Party Name</label>
                        <select
                          value={row[key]}
                          onChange={(e) => handleInputChange(index, key, e.target.value)}
                          className="w-full border p-2 rounded text-sm"
                        >
                          <option value="">Select Party Name</option>
                          {supplierOptions.map(supplier => (
                            <option key={supplier.id} value={supplier.partyName}>
                              {supplier.partyName}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (key === 'ItemName') {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium text-sm">Item Name</label>
                        <select
                          value={row[key]}
                          onChange={(e) => handleInputChange(index, key, e.target.value)}
                          className="w-full border p-2 rounded text-sm"
                        >
                          <option value="">Select Item Name</option>
                          {itemOptions.map(item => (
                            <option key={item.id} value={item.itemDescription}>
                              {item.itemDescription}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
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
                          <option value="5%">5%</option>
                          <option value="12%">12%</option>
                          <option value="18%">18%</option>
                          <option value="28%">28%</option>
                        </select>
                      </div>
                    );
                  }
                  if (key === 'PaymentMode') {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium text-sm">Payment Mode</label>
                        <select
                          value={row[key]}
                          onChange={(e) => handleInputChange(index, key, e.target.value)}
                          className="w-full border p-2 rounded text-sm"
                        >
                          <option value="">Select Payment Mode</option>
                          <option value="Cash">Cash</option>
                          <option value="Netbanking">Netbanking</option>
                          <option value="UPI">UPI</option>
                          <option value="PhonePe">PhonePe</option>
                          <option value="GPay">GPay</option>
                          <option value="Paytm">Paytm</option>
                        </select>
                      </div>
                    );
                  }
                  if (key === 'PaymentStatus') {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium text-sm">Payment Status</label>
                        <select
                          value={row[key]}
                          onChange={(e) => handleInputChange(index, key, e.target.value)}
                          className="w-full border p-2 rounded text-sm"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Successful">Successful</option>
                        </select>
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
              <button
                onClick={() => togglePaymentStatus(index)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Toggle Payment Status
              </button>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 mt-4"
            disabled={!isAgreed}
          >
            Submit
          </button>
          <div className="mt-4">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={handleAgreeChange}
              className="mr-2"
            />
            <label>I agree to the terms and conditions</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesRow;




