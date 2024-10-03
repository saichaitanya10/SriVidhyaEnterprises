import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navibar from "../components/Navibar";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, getDocs } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { addDoc } from "firebase/firestore";

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

const SalesRow = () => {
  const [rows, setRows] = useState([
    {
      Date: "",
      PartyName: "",
      GstNumber: "",
      ItemName: "",
      AddMoreItems: "",
      ItemDescription: "",
      HsnSacCode: "",
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
    },
  ]);
  const [isAgreed, setIsAgreed] = useState(false);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const q = query(collection(db, "vendors"));
        const querySnapshot = await getDocs(q);
        const suppliers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          partyName: doc.data().partyName,
          gstNumber: doc.data().gstNumber,
        }));
        setSupplierOptions(suppliers);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        toast.error("Error fetching suppliers");
      }
    };

    const fetchItems = async () => {
      try {
        const q = query(collection(db, "items"));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          itemDescription: doc.data().items[0].itemDescription || "",
          hsnCode: doc.data().items[0].hsnCode || "",
          itemName: doc.data().items[0].itemDescription || "",
        }));
        setItemOptions(items);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("Error fetching items");
      }
    };

    fetchSuppliers();
    fetchItems();
  }, []);

  const fetchItemDetails = (itemName, index) => {
    const selectedItem = itemOptions.find((item) => item.itemName === itemName);
    if (selectedItem) {
      const newRows = [...rows];
      newRows[index].ItemDescription = selectedItem.itemDescription;
      newRows[index].HsnSacCode = selectedItem.hsnCode;
      setRows(newRows);
    }
  };
  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];

    // Ensure the field exists and is updatable
    if (newRows[index]) {
      newRows[index][field] = value;

      // Tax calculation logic
      if (
        field === "TaxableValue" ||
        field === "GstRate" ||
        field === "SelectState"
      ) {
        const taxableValue = parseFloat(newRows[index].TaxableValue) || 0;
        const gstRate = parseFloat(newRows[index].GstRate) || 0;
        const state = newRows[index].SelectState;

        if (taxableValue > 0 && gstRate > 0) {
          const taxAmount = (taxableValue * gstRate) / 100;
          if (state === "Intra") {
            newRows[index].CGST = (taxAmount / 2).toFixed(2);
            newRows[index].SGST = (taxAmount / 2).toFixed(2);
            newRows[index].IGST = "";
          } else {
            newRows[index].CGST = "";
            newRows[index].SGST = "";
            newRows[index].IGST = taxAmount.toFixed(2);
          }
          newRows[index].TotalTax = taxAmount.toFixed(2);
          newRows[index].FinalAmount = (taxableValue + taxAmount).toFixed(2);
        } else {
          newRows[index].CGST = "";
          newRows[index].SGST = "";
          newRows[index].IGST = "";
          newRows[index].TotalTax = "";
          newRows[index].FinalAmount = "";
        }
      }

      if (field === "ItemName") {
        fetchItemDetails(value, index);
      }

      if (field === "PartyName") {
        fetchPartyDetails(value, index);
      }

      setRows(newRows);
    }
  };

  const fetchPartyDetails = (partyName, index) => {
    const selectedParty = supplierOptions.find(
      (supplier) => supplier.partyName === partyName
    );
    if (selectedParty) {
      const newRows = [...rows];
      newRows[index].GstNumber = selectedParty.gstNumber;
      setRows(newRows);
    }
  };

  const handleDateChange = (date, index) => {
    const newRows = [...rows];
    newRows[index].Date = date;
    setRows(newRows);
  };

  const handleAgreeChange = () => {
    setIsAgreed(!isAgreed);
  };

  const togglePaymentStatus = (index) => {
    const newRows = [...rows];
    newRows[index].PaymentStatus =
      newRows[index].PaymentStatus === "Pending" ? "Successful" : "Pending";
    setRows(newRows);
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
  const handleSubmit = async () => {
    if (!isAgreed) {
      toast.error("Please agree to the terms and conditions.");
      return;
    }

    try {
      for (const row of rows) {
        await addDoc(collection(db, "sales"), row);
      }
      toast.success("Sales entry saved successfully");
      navigate("/"); // Navigate to another page or clear the form as needed
    } catch (error) {
      console.error("Error adding document:", error);
      toast.error("Error saving sales entry");
    }
  };

  return (
    <div>
      <Navibar />
      <div className="p-4 w-full bg-zinc-800/40 h-screen backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Enter Sales Details
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600 text-sm"
            >
              Back
            </button>
          </div>
          {rows.map((row, index) => (
            <div
              key={index}
              className="mb-4 p-4 border border-gray-300 rounded-lg bg-white"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(row).map((key, idx) => {
                  if (key === "Date") {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium text-sm">
                          Date
                        </label>
                        <input
                          type="date"
                          value={row.Date}
                          onChange={(e) =>
                            handleDateChange(e.target.value, index)
                          }
                          className="w-full border p-2 rounded text-sm"
                        />
                      </div>
                    );
                  }
                  if (key === "PaymentMode") {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium">
                          Mode of Payment
                        </label>
                        <select
                          value={row[key]}
                          onChange={(e) =>
                            handleInputChange(index, key, e.target.value)
                          }
                          className="w-full border p-2 rounded"
                        >
                          <option value="">Select Payment Mode</option>
                          <option value="PhonePe/GPay/Paytm">
                            PhonePe/GPay/Paytm
                          </option>
                          <option value="Netbanking">Netbanking</option>
                          <option value="UPI">UPI</option>
                          <option value="Cash">Cash</option>
                        </select>
                      </div>
                    );
                  }
                  if (key === "PartyName") {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium text-sm">
                          Vendor Name
                        </label>
                        <select
                          value={row[key]}
                          onChange={(e) =>
                            handleInputChange(index, key, e.target.value)
                          }
                          className="w-full border p-2 rounded text-sm"
                        >
                          <option value="">Select Vendor Name</option>
                          {supplierOptions.map((supplier) => (
                            <option
                              key={supplier.id}
                              value={supplier.partyName}
                            >
                              {supplier.partyName}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (key === "ItemName") {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium text-sm">
                          Item Name
                        </label>
                        <select
                          value={row[key]}
                          onChange={(e) =>
                            handleInputChange(index, key, e.target.value)
                          }
                          className="w-full border p-2 rounded text-sm"
                        >
                          <option value="">Select Item Name</option>
                          {itemOptions.map((item) => (
                            <option key={item.id} value={item.itemName}>
                              {item.itemName}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (key === "SelectState") {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium text-sm">
                          Select State
                        </label>
                        <select
                          value={row[key]}
                          onChange={(e) =>
                            handleInputChange(index, key, e.target.value)
                          }
                          className="w-full border p-2 rounded text-sm"
                        >
                          <option value="">Select State</option>
                          <option value="Intra">Intra State</option>
                          <option value="Inter">Inter State</option>
                        </select>
                      </div>
                    );
                  } else if (key === "PaymentStatus") {
                    return (
                      <div key={idx} className="col-span-1 flex items-center">
                        <label className="block font-medium text-sm mr-2">
                          Payment Status:
                        </label>{" "}
                        {/* Adjusted label size */}
                        <button
                          onClick={() => togglePaymentStatus(index)}
                          className={`py-2 px-4 rounded ${
                            row[key] === "Pending"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          } text-white text-xs`} // Reduced font size
                        >
                          {row[key]}
                        </button>
                      </div>
                    );
                  }
                  if (["CGST", "SGST", "IGST"].includes(key)) {
                    const isGSTFieldVisible =
                      (row.SelectState === "Intra" &&
                        (key === "CGST" || key === "SGST")) ||
                      (row.SelectState === "Inter" && key === "IGST");
                    return (
                      <div
                        key={idx}
                        className={`col-span-1 ${
                          isGSTFieldVisible ? "" : "hidden"
                        }`}
                      >
                        <label className="block font-medium text-sm">
                          {formatLabel(key)}
                        </label>
                        <input
                          type="text"
                          value={row[key]}
                          onChange={(e) =>
                            handleInputChange(index, key, e.target.value)
                          }
                          className="w-full border p-2 rounded text-sm"
                        />
                      </div>
                    );
                  }
                  if (key === "GstRate") {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium text-sm">
                          GST Rate
                        </label>
                        <select
                          value={row[key]}
                          onChange={(e) =>
                            handleInputChange(index, key, e.target.value)
                          }
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
                  return (
                    <div key={idx} className="col-span-1">
                      <label className="block font-medium text-sm">
                        {formatLabel(key)}
                      </label>
                      <input
                        type="text"
                        value={row[key]}
                        onChange={(e) =>
                          handleInputChange(index, key, e.target.value)
                        }
                        className="w-full border p-2 rounded text-sm"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={handleAgreeChange}
              className="mr-2"
            />
            <label className="text-sm text-white">
              I agree to the terms and conditions.
            </label>
          </div>
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
              disabled={!isAgreed}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesRow;
