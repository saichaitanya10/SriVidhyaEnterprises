import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navibar from '../components/Navibar';
import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore'; 
import { toast } from 'react-hot-toast';

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

const ItemRow = () => {
  const [rows, setRows] = useState([{
    serialNo: 0, // Placeholder, will be updated dynamically
    date: '',
    itemCode: '',
    itemDescription: '',
    hsnCode: '',
    unitOfMeasurement: '',
    purchasePrice: '',
    gstRate: '',
    taxAmount: '',
    purchaseAmountWithTax: '',
  }]);
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL

  // Fetch item count and details if editing
  useEffect(() => {
    const fetchItemData = async () => {
      if (id) {
        // Fetch details for editing
        try {
          const docRef = doc(db, 'items', id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setRows(data.items || [{
              serialNo: 0,
              date: '',
              itemCode: '',
              itemDescription: '',
              hsnCode: '',
              unitOfMeasurement: '',
              purchasePrice: '',
              gstRate: '',
              taxAmount: '',
              purchaseAmountWithTax: '',
            }]);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching item details: ", error);
        }
      } else {
        // Fetch item count for new entry
        try {
          const querySnapshot = await getDocs(collection(db, 'items'));
          const itemCount = querySnapshot.size;

          // Update the serial number based on the current count
          setRows(rows.map((row, index) => ({
            ...row,
            serialNo: itemCount + index + 1
          })));
        } catch (error) {
          console.error("Error fetching item count: ", error);
        }
      }
    };

    fetchItemData();
  }, [id]);

  const handleInputChange = (index, field, value) => {
    const newRows = rows.map((row, i) => {
      if (i === index) {
        row[field] = value;

        if (field === 'purchasePrice' || field === 'gstRate') {
          const purchasePrice = parseFloat(row.purchasePrice) || 0;
          const gstRate = parseFloat(row.gstRate) || 0;

          row.taxAmount = ((gstRate / 100) * purchasePrice).toFixed(2);
          row.purchaseAmountWithTax = (purchasePrice + parseFloat(row.taxAmount)).toFixed(2);
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
      if (id) {
        // Update existing item
        const docRef = doc(db, 'items', id);
        await setDoc(docRef, { items: rows, updatedAt: new Date() }, { merge: true });
        toast.success('Item updated successfully!');
      } else {
        // Add new item
        await addDoc(collection(db, 'items'), {
          items: rows,
          createdAt: new Date()
        });
        toast.success('New item added successfully!');
      }
      
      setRows([{
        serialNo: rows.length + 1, // Set the next serial number
        date: '',
        itemCode: '',
        itemDescription: '',
        hsnCode: '',
        unitOfMeasurement: '',
        purchasePrice: '',
        gstRate: '',
        taxAmount: '',
        purchaseAmountWithTax: '',
      }]);
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert('Error submitting form');
    }

    navigate(-1);
  };

  return (
    <div>
      <Navibar />
      <div className='p-12 w-full bg-zinc-800/40 h-screen backdrop-blur-sm'>
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {id ? 'Edit Item Details' : 'Enter Item Details'}
            </h1>
            <button 
              onClick={() => navigate(-1)} 
              className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
            >
              Back
            </button>
          </div>

          {rows.map((row, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block font-medium">Serial No</label>
                  <input
                    type="text"
                    value={row.serialNo} // Serial number from state
                    readOnly
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium">Date</label>
                  <input
                    type="date"
                    value={row.date}
                    onChange={(e) => handleInputChange(index, 'date', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium">Item Code</label>
                  <input
                    type="text"
                    value={row.itemCode}
                    onChange={(e) => handleInputChange(index, 'itemCode', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium">Item Description</label>
                  <input
                    type="text"
                    value={row.itemDescription}
                    onChange={(e) => handleInputChange(index, 'itemDescription', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium">HSN Code</label>
                  <input
                    type="text"
                    value={row.hsnCode}
                    onChange={(e) => handleInputChange(index, 'hsnCode', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium">Unit of Measurement</label>
                  <select
                    value={row.unitOfMeasurement}
                    onChange={(e) => handleInputChange(index, 'unitOfMeasurement', e.target.value)}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Select Unit</option>
                    <option value="EA">EA</option>
                    <option value="SET">SET</option>
                    <option value="KG">KG</option>
                    <option value="ROLL">ROLL</option>
                    <option value="M">M</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block font-medium">Purchase Price (Without Tax)</label>
                  <input
                    type="number"
                    value={row.purchasePrice}
                    onChange={(e) => handleInputChange(index, 'purchasePrice', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium">GST Rate</label>
                  <select
                    value={row.gstRate}
                    onChange={(e) => handleInputChange(index, 'gstRate', e.target.value)}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Select GST Rate</option>
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block font-medium">Tax Amount</label>
                  <input
                    type="text"
                    value={row.taxAmount}
                    readOnly
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium">Purchase Amount with Tax</label>
                  <input
                    type="text"
                    value={row.purchaseAmountWithTax}
                    readOnly
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center mb-4 mt-4">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={handleAgreeChange}
              className="mr-2"
            />
            <label className="block font-medium text-white">I agree with the terms and conditions</label>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {id ? 'Update' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemRow;
  