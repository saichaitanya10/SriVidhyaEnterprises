import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navibar from "../components/Navibar";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-hot-toast";

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

const EditSalesRow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [row, setRow] = useState({
    Date: "",
    ItemName: "",
    ItemDescription: "",
    HsnSacCode: "",
    GstNumber: "",
    InvoiceNumber: "",
    Quantity: "",
    TaxableValue: "",
    SelectState: "",
    GstRate: "",
    CGST: "",
    SGST: "",
    IGST: "",
    TotalTax: "",
    FinalAmount: "",
    PaymentMode: "",
    Remark: "",
    PaymentStatus: "Pending",
  });

  const [isAgreed, setIsAgreed] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsCollection = collection(db, "sales");
        const itemsSnapshot = await getDocs(itemsCollection);
        const itemsList = itemsSnapshot.docs.map((doc) => doc.data().ItemName);
        setItems(itemsList);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("Error fetching items.");
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        if (!id) return;

        const docRef = doc(db, "sales", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const salesDetails = docSnap.data();
          console.log(salesDetails);

          // Map the fields directly from the salesDetails object
          const mappedData = {
            Date: salesDetails.Date || "",
            ItemName: salesDetails.ItemName || "",
            ItemDescription: salesDetails.ItemDescription || "",
            HsnSacCode: salesDetails.HsnSacCode || "",
            GstNumber: salesDetails.GstNumber || "",
            InvoiceNumber: salesDetails.InvoiceNumber || "",
            Quantity: salesDetails.Quantity || "",
            TaxableValue: salesDetails.TaxableValue || "",
            GstRate: salesDetails.GstRate || "",
            SelectState: salesDetails.SelectState || "",
            CGST: salesDetails.CGST || "",
            SGST: salesDetails.SGST || "",
            IGST: salesDetails.IGST || "",
            TotalTax: salesDetails.TotalTax || "",
            FinalAmount: salesDetails.FinalAmount || "",
            PaymentMode: salesDetails.PaymentMode || "",
            Remark: salesDetails.Remark || "",
            PaymentStatus: salesDetails.PaymentStatus || "Pending",
          };

          setRow(mappedData);
        } else {
          toast.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        toast.error("Error fetching data.");
      }
    };

    fetchSalesData();
  }, [id]);

  const handleInputChange = (key, value) => {
    setRow((prevRow) => {
      const updatedRow = { ...prevRow, [key]: value };
  
      if (key === "GstRate" || key === "TaxableValue") {
        const gstRate = parseFloat(updatedRow.GstRate) || 0;
        const taxableValue = parseFloat(updatedRow.TaxableValue) || 0;
  
        if (updatedRow.SelectState === "Inter") {
          updatedRow.IGST = gstRate > 0 ? ((gstRate / 100) * taxableValue).toFixed(2) : "N/A";
          updatedRow.CGST = "N/A";
          updatedRow.SGST = "N/A";
        } else if (updatedRow.SelectState === "Intra") {
          updatedRow.CGST = gstRate > 0 ? ((gstRate / 2 / 100) * taxableValue).toFixed(2) : "N/A";
          updatedRow.SGST = gstRate > 0 ? ((gstRate / 2 / 100) * taxableValue).toFixed(2) : "N/A";
          updatedRow.IGST = "N/A";
        }
  
        updatedRow.TotalTax = (
          parseFloat(updatedRow.CGST === "N/A" ? 0 : updatedRow.CGST) +
          parseFloat(updatedRow.SGST === "N/A" ? 0 : updatedRow.SGST) +
          parseFloat(updatedRow.IGST === "N/A" ? 0 : updatedRow.IGST)
        ).toFixed(2);
  
        updatedRow.FinalAmount = (
          taxableValue + parseFloat(updatedRow.TotalTax)
        ).toFixed(2);
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
      toast.error("You must agree to the terms and conditions to proceed.");
      return;
    }
  
    try {
      const docRef = doc(db, "sales", id);
      await updateDoc(docRef, {
        ...row, // This spreads the row object directly into the document without nesting it inside `salesDetails`.
        updatedAt: new Date(),
      });
      toast.success("Document updated successfully!");
      navigate("/sales");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Error updating document.");
    }
  };
  

  const formatLabel = (key) => {
    switch (key) {
      case "GstNumber":
        return "GST Number";
      case "HsnSacCode":
        return "HSN/SAC Code";
      case "GstRate":
        return "GST Rate";
      default:
        return key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
    }
  };

  return (
    <div>
      <Navibar />
      <div className="p-10 w-full bg-zinc-800/40 h-screen backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit Sales Details
            </h1>
            <button
              onClick={() => navigate("/sales")}
              className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
            >
              Back
            </button>
          </div>
          <div className="p-4 border border-gray-300 rounded-lg bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(row).map((key, idx) => {
                if (key === "PaymentMode") {
                  return (
                    <div key={idx} className="col-span-1">
                      <label className="block font-medium">
                        Mode of Payment
                      </label>
                      <select
                        value={row[key]}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Select Payment Mode</option>
                        <option value="PhonePe/GPay/Paytm">
                          PhonePe/GPay/Paytm
                        </option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cheque">Cheque</option>
                      </select>
                    </div>
                  );
                }
                if (key === "SelectState") {
                  return (
                    <div key={idx} className="col-span-1  ">
                      <div>
                        <label className="block font-medium text-md">
                          {formatLabel(key)}
                        </label>{" "}
                        {/* Adjusted label size */}
                        <select
  value={row.SelectState}
  onChange={(e) => handleInputChange('SelectState', e.target.value)}
  className="w-full border p-2 rounded"
>
  <option value="">Select GST Type</option>
  <option value="Inter">Inter</option>
  <option value="Intra">Intra</option>
</select>

                      </div>
                      {row.SelectState == "Inter" && (
                        <>
                          <div key={idx} className="col-span-1">
                            <label className="block font-medium text-md">
                              {formatLabel("IGST")}
                            </label>{" "}
                            {/* Adjusted label size */}
                            <input
                              type="number"
                              value={row["IGST"]}
                              onChange={(e) =>
                                handleInputChange(key, e.target.value)
                              }
                              className="w-full border p-2 rounded text-md" // Reduced font size
                            />
                          </div>
                        </>
                      )}
                      {row.SelectState == "Intra" && (
                        <>
                          <div key={idx} className="col-span-1">
                            <label className="block font-medium text-md">
                              {formatLabel("CGST")}
                            </label>{" "}
                            {/* Adjusted label size */}
                            <input
                              type="number"
                              value={row["CGST"]}
                              onChange={(e) =>
                                handleInputChange(key, e.target.value)
                              }
                              className="w-full border p-2 rounded text-md" // Reduced font size
                            />
                          </div>
                          <div key={idx} className="col-span-1">
                            <label className="block font-medium text-md">
                              {formatLabel("SGST")}
                            </label>{" "}
                            {/* Adjusted label size */}
                            <input
                              type="number"
                              value={row["SGST"]}
                              onChange={(e) =>
                                handleInputChange(key, e.target.value)
                              }
                              className="w-full border p-2 rounded text-md" // Reduced font size
                            />
                          </div>
                        </>
                      )}
                    </div>
                  );
                }
                if (key === "ItemName") {
                  return (
                    <div key="ItemName" className="col-span-1">
                      <label className="block font-medium">Item Name</label>
                      <select
                        value={row.ItemName}
                        onChange={(e) =>
                          handleInputChange("ItemName", e.target.value)
                        }
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Select Item</option>
                        {items.map((item, idx) => (
                          <option key={idx} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }
                if (key === "PaymentStatus") {
                  return (
                    <div key={idx} className="col-span-1 flex items-center">
                      <label className="block font-medium mr-2">
                        Payment Status:
                      </label>
                      <button
                        onClick={() =>
                          handleInputChange(
                            key,
                            row[key] === "Pending" ? "Successful" : "Pending"
                          )
                        }
                        className={`py-2 px-4 rounded ${
                          row[key] === "Pending"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        } text-white`}
                      >
                        {row[key]}
                      </button>
                    </div>
                  );
                }
                else if (key === "GstRate") {
                  return (
                    <div key={idx} className="col-span-1">
                      <label className="block font-medium text-md">
                        {formatLabel(key)}
                      </label>{" "}
                      {/* Adjusted label size */}
                      <select
                        value={row.GstRate}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="w-full border p-2 rounded"
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
                else if (key !== "IGST" && key !== "SGST" && key !== "CGST") {
                  return (
                    <div key={idx} className="col-span-1">
                      <label className="block font-medium">
                        {formatLabel(key)}
                      </label>
                      <input
                        type="text"
                        value={row[key]}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                  );
                }
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
            <label className="text-white">
              I agree to the terms and conditions
            </label>
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
