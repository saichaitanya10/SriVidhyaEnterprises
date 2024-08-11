import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navibar from '../components/Navibar';
import { initializeApp } from "firebase/app";
import { toast } from 'react-hot-toast';
import { getFirestore, collection, addDoc, updateDoc, doc, getDoc, setDoc,getDocs } from "firebase/firestore";

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

const AddSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState({
    serialNo: '',
    partyName: '',
    contactNumber: '+91',
    gstNumber: '',
    address: ''
  });
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        if (id) {
          const supplierDoc = doc(db, "suppliers", id);
          const supplierSnap = await getDoc(supplierDoc);
          if (supplierSnap.exists()) {
            setSupplier({ ...supplierSnap.data()});
          } else {
            console.log("No such document!");
          }
        } else {
          // Fetch the count of suppliers to generate the new serial number
          const suppliersCollectionRef = collection(db, "suppliers");
          const suppliersSnapshot = await getDocs(suppliersCollectionRef);
          const count = suppliersSnapshot.size;
  
          // Generate the new serial number
          const newSerialNo = count + 1;
  
          // Update the state of the supplier with the new serial number
          setSupplier({ ...supplier, serialNo: newSerialNo.toString() });
        }
      } catch (error) {
        console.error("Error fetching supplier data: ", error);
      }
    };
  
    fetchSupplierData();
  }, [id]); // Dependency array
  
  

  const handleInputChange = (field, value) => {
    setSupplier({ ...supplier, [field]: value });
  };

  const handleAgreeChange = () => {
    setIsAgreed(!isAgreed);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAgreed) {
      alert('You must agree to the terms and conditions.');
      return;
    }

    try {
      if (id) {
        const docRef = doc(db, "suppliers", id);
        await updateDoc(docRef, {
          ...supplier,
          updatedAt: new Date()
        });
        toast.success('Supplier updated successfully!');
      } else {
        const collectionRef = collection(db, "suppliers");
        await addDoc(collectionRef, {
          ...supplier,
          createdAt: new Date()
        });
        toast.success('Supplier added successfully!');
      }
      navigate('/SupplierDetails');
    } catch (error) {
      console.error("Error saving supplier: ", error);
      alert('Error submitting the form. Please try again.');
    }
  };

  return (
    <div>
      <Navibar />
      <div className='p-20 w-full bg-zinc-800/40 h-screen backdrop-blur-sm'>
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {id ? 'Edit Supplier Details' : 'Enter Supplier Details'}
            </h1>
            <button 
              onClick={() => navigate('/SupplierDetails')} 
              className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
            >
              Back
            </button>
          </div>
          <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block font-medium">Serial No</label>
                <input
                  type="text"
                  value={supplier.serialNo}
                  readOnly
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="col-span-1">
                <label className="block font-medium">Party Name</label>
                <input
                  type="text"
                  value={supplier.partyName}
                  onChange={(e) => handleInputChange('partyName', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="col-span-1">
                <label className="block font-medium">Contact Number</label>
                <input
                  type="text"
                  value={supplier.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="col-span-1">
                <label className="block font-medium">GST Number</label>
                <input
                  type="text"
                  value={supplier.gstNumber}
                  onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="col-span-1">
                <label className="block font-medium">Address</label>
                <input
                  type="text"
                  value={supplier.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
          </div>

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

export default AddSupplier;
