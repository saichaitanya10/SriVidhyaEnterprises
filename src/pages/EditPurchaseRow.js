import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navibar from "../components/Navibar";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc ,collection,getDocs} from "firebase/firestore";
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

const EditPurchaseRow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [row, setRow] = useState({
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
    IGST: "",
    CGST: "",
    SGST: "",
    TotalTax: "",
    FinalAmount: "",
    PaymentMode: "",
    Remark: "",
    PaymentStatus: "Pending",
  });
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    const fetchPurchaseData = async () => {
      if (id) {
        try {
          const docRef = doc(db, "purchase", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const purchaseDetails = data.purchaseDetails || [];

            if (purchaseDetails.length > 0) {
              const purchaseData = purchaseDetails[0];
              const mappedData = {
                Date: purchaseData.Date || "",
                PartyName: purchaseData.PartyName || "",
                GstNumber: purchaseData.GstNumber || "",
                ItemName: purchaseData.ItemName || "",
                AddMoreItems: purchaseData.AddMoreItems || "",
                ItemDescription: purchaseData.ItemDescription || "",
                HsnSacCode: purchaseData.HsnSacCode || "",
                InvoiceNumber: purchaseData.InvoiceNumber || "",
                Quantity: purchaseData.Quantity || "",
                TaxableValue: purchaseData.TaxableValue || "",
                SelectState: purchaseData.SelectState || "",
                GstRate: purchaseData.GstRate || "",
                IGST: purchaseData.IGST || "",
                CGST: purchaseData.CGST || "",
                SGST: purchaseData.SGST || "",
                TotalTax: purchaseData.TotalTax || "",
                FinalAmount: purchaseData.FinalAmount || "",
                PaymentMode: purchaseData.PaymentMode || "",
                Remark: purchaseData.Remark || "",
                PaymentStatus: purchaseData.PaymentStatus || "Pending",
              };

              console.log(mappedData);
              setRow(mappedData);
            } else {
              toast.error("Purchase details are empty!");
            }
          } else {
            toast.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching document:", error);
          toast.error("Error fetching data.");
        }
      }
    };

    fetchPurchaseData();
    const fetchVendors = async () => {
      try {
        const q = collection(db, "suppliers");
        const querySnapshot = await getDocs(q);
        const vendorsList = querySnapshot.docs.map((doc) => doc.data());
        // console.log(vendorsList)
        setVendors(vendorsList);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        toast.error("Error fetching vendors: " + error.message);
      }
    };
    fetchVendors();
  }, [id]);

  const handleInputChange = (key, value) => {
    setRow((prevRow) => {
      const updatedRow = { ...prevRow, [key]: value };

      if (key === "GstRate" || key === "TaxableValue") {
        const gstRate = parseFloat(updatedRow.GstRate) || 0;
        const taxableValue = parseFloat(updatedRow.TaxableValue) || 0;
        updatedRow.CGST = ((gstRate / 2 / 100) * taxableValue).toFixed(2);
        updatedRow.SGST = ((gstRate / 2 / 100) * taxableValue).toFixed(2);
        updatedRow.IGST = ((gstRate / 100) * taxableValue).toFixed(2);
        updatedRow.TotalTax = updatedRow.IGST;
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
      const docRef = doc(db, "purchase", id);
      await updateDoc(docRef, {
        purchaseDetails: [row],
        updatedAt: new Date(),
      });
      toast.success("Document updated successfully!");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Error updating document.");
    }

    navigate("/purchase");
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

  const [vendors, setVendors] = useState([]);
  return (
    <div>
      <Navibar />
      <div className="p-10 w-full bg-zinc-800/40 h-screen backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit Purchase Details
            </h1>
            <button
              onClick={() => navigate("/purchase")}
              className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
            >
              Back
            </button>
          </div>
          <div className="p-4 border border-gray-300 rounded-lg bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(row).map((key, idx) => {
                  if (key === "PartyName") {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium text-md">
                          Supplier Name
                        </label>
                        <select
                          value={row[key]}
                          onChange={(e) =>
                            handleInputChange( key, e.target.value)
                          }
                          className="w-full border p-2 rounded"
                        >
                          <option value="">Select Supplier</option>
                          {vendors.map((vendor, vIdx) => (
  <option key={vIdx} value={vendor.partyName}>
    {vendor.partyName}
  </option>
))}
  
                        </select>
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
                        onChange={(e) => handleInputChange(key, e.target.value)}
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
                else if (key === "SelectState") {
                  return (
                    <div key={idx} className="col-span-1  ">
                      <div>
                        <label className="block font-medium text-md">
                          {formatLabel(key)}
                        </label>{" "}
                        {/* Adjusted label size */}
                        <select
                          value={row[key]}
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          className="w-full border p-2 rounded"
                        >
                          <option value="">Select GST Type</option>
                          <option value="Inter">Inter</option>
                          <option value="Intra">Intra</option>
                        </select>
                      </div>
                      {row.SelectState == "Intra" && (
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
                      {row.SelectState == "Inter" && (
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
                } else if (key === "GstRate") {
                  return (
                    <div key={idx} className="col-span-1">
                      <label className="block font-medium text-md">
                        {formatLabel(key)}
                      </label>{" "}
                      {/* Adjusted label size */}
                      <select
                        value={row[key]}
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
                } else if (key !== "IGST" && key !== "SGST" && key !== "CGST") {
                  return (
                    <div key={idx} className="col-span-1">
                      <label className="block font-medium text-md">
                        {formatLabel(key)}
                      </label>{" "}
                      {/* Adjusted label size */}
                      <input
                        type={
                          key === "Quantity" || key === "TaxableValue"
                            ? "number"
                            : key === "Date"
                            ? "date"
                            : "text"
                        }
                        value={row[key]}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="w-full border p-2 rounded text-md" // Reduced font size
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

export default EditPurchaseRow;
