import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navibar from '../components/Navibar';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
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

const VendorDetails = () => {
  const [vendors, setVendors] = useState([
    {
      serialNo: 0, // Placeholder, will be updated dynamically
      partyName: '',
      contactNumber: '+91',
      gstNumber: '',
      billingAddress: '',
      shippingAddress: '',
    }
  ]);

  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorCount = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "vendors"));
        const vendorCount = querySnapshot.size;

        // Update the serial number based on the current count
        setVendors(vendors.map((vendor, index) => ({
          ...vendor,
          serialNo: vendorCount + index + 1
        })));
      } catch (error) {
        console.error("Error fetching vendor count: ", error);
      }
    };

    fetchVendorCount();
  }, []);

  const handleInputChange = (index, field, value) => {
    const newVendors = vendors.map((vendor, i) => {
      if (i === index) {
        vendor[field] = value;
      }
      return vendor;
    });
    setVendors(newVendors);
  };

  const handleAgreeChange = () => {
    setIsAgreed(!isAgreed);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Check if any of the fields are empty
    for (const vendor of vendors) {
      if (
        !vendor.partyName || 
        !vendor.contactNumber || 
        !vendor.gstNumber || 
        !vendor.billingAddress || 
        !vendor.shippingAddress
      ) {
        toast.error('All fields must be filled out.');
        return;
      }
    }

    if (!isAgreed) {
      toast.error('You must agree with the terms and conditions to proceed.');
      return;
    }

    // Add the current date and time
    const vendorWithDate = vendors.map(vendor => ({
      ...vendor,
      createdAt: new Date()
    }));

    try {
      await addDoc(collection(db, "vendors"), vendorWithDate[0]);
      toast.success('Form submitted successfully!');
      navigate(-1);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert('Error submitting the form. Please try again.');
    }
  };

  return (
    <div>
      <Navibar />
      <div className='p-20 w-full bg-zinc-800/40 h-screen backdrop-blur-sm'>
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 ">Enter Vendor Details</h1>
            <button 
              onClick={() => navigate(-1)} 
              className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
            >
              Back
            </button>
          </div>
          {vendors.map((vendor, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block font-medium">Serial No</label>
                  <input
                    type="text"
                    value={vendor.serialNo} // Updated serial number
                    readOnly
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium">Party Name</label>
                  <input
                    type="text"
                    value={vendor.partyName}
                    onChange={(e) => handleInputChange(index, 'partyName', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium">Contact Number</label>
                  <input
                    type="text"
                    value={vendor.contactNumber}
                    onChange={(e) => handleInputChange(index, 'contactNumber', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium">GST Number</label>
                  <input
                    type="text"
                    value={vendor.gstNumber}
                    onChange={(e) => handleInputChange(index, 'gstNumber', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium">Billing Address</label>
                  <input
                    type="text"
                    value={vendor.billingAddress}
                    onChange={(e) => handleInputChange(index, 'billingAddress', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium">Shipping Address</label>
                  <input
                    type="text"
                    value={vendor.shippingAddress}
                    onChange={(e) => handleInputChange(index, 'shippingAddress', e.target.value)}
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
            Submit
          </button>
        </div>
      </div>
    </div>
)};

export default VendorDetails;
