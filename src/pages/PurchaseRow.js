import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navibar from "../components/Navibar";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
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

const AddRow = () => {
  const [rows, setRows] = useState([
    {
      Date: "",
      PartyName: "",
      GstNumber: "",
      ItemName: "",
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
    },
  ]);
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const q = collection(db, "vendors");
        const querySnapshot = await getDocs(q);
        const vendorsList = querySnapshot.docs.map((doc) => doc.data());
        setVendors(vendorsList);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        toast.error("Error fetching vendors: " + error.message);
      }
    };
    const fetchItems = async () => {
      try {
        const q = collection(db, "items");
        const querySnapshot = await getDocs(q);
        const vendorsList = querySnapshot.docs.map((doc) => doc.data());
        setItems(vendorsList);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("Error fetching items: " + error.message);
      }
    };
    fetchItems();
    fetchVendors();
  }, []);
  // console.log(items)

  const fetchItemDetails = async (itemCode, index) => {
    try {
      console.log("Fetching item details for itemCode:", itemCode);

      // Fetch all documents from the 'items' collection
      const q = query(collection(db, "items"));
      const querySnapshot = await getDocs(q);
      console.log("Query results:", querySnapshot.docs);

      let found = false;

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.items && Array.isArray(data.items)) {
          const item = data.items.find((i) => i.itemCode === itemCode);

          if (item) {
            const updatedRows = [...rows];
            updatedRows[index] = {
              ...updatedRows[index],
              ItemDescription: item.itemDescription || "",
              HsnSacCode: item.hsnCode || "",
              GstRate: item.gstRate || "",
            };
            setRows(updatedRows);
            toast.success("Item found.");
            found = true;
          }
        }
      });

      if (!found) {
        toast.error("Item not found.");
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
      setTimeout(() => {
        toast.error("Error fetching item details: " + error.message);
      }, 2000); // 2000 milliseconds = 2 seconds
    }
  };

  const fetchPartyDetails = async (partyName, index) => {
    try {
      console.log("Fetching vendor details for partyName:", partyName);

      // Fetch all documents from the 'vendors' collection
      const q = query(collection(db, "vendors"));
      const querySnapshot = await getDocs(q);
      console.log("Query results:", querySnapshot.docs);

      let found = false;

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (
          data.partyName &&
          data.partyName.toLowerCase() === partyName.toLowerCase()
        ) {
          const updatedRows = [...rows];
          updatedRows[index] = {
            ...updatedRows[index],
            GstNumber: data.gstNumber || "",
            BillingAddress: data.billingAddress || "",
            ShippingAddress: data.shippingAddress || "",
          };
          setRows(updatedRows);
          toast.success("Vendor found.");
          found = true;
        }
      });

      if (!found) {
        toast.error("Vendor not found.");
      }
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      setTimeout(() => {
        toast.error("Error fetching vendor details: " + error.message);
      }, 2000); // 2000 milliseconds = 2 seconds
    }
  };

  const handleInputChange = (index, field, value) => {
    const newRows = rows.map((row, i) => {
      if (i === index) {
        row[field] = value;

        if (field === "ItemName") {
          fetchItemDetails(value, index);
        }

        if (field === "PartyName") {
          fetchPartyDetails(value, index);
        }

        // Clear fields based on SelectState value
        if (field === "SelectState") {
          if (value === "Intra") {
            row.CGST = "";
            row.SGST = "";
          } else if (value === "Inter") {
            row.IGST = "";
          }
        }

        // Calculate CGST, SGST, IGST, Total Tax, and Final Amount based on the GST Rate and Taxable Value
        if (field === "GstRate" || field === "TaxableValue") {
          const gstRate = parseFloat(row.GstRate) || 0;
          const taxableValue = parseFloat(row.TaxableValue) || 0;

          row.CGST = ((gstRate / 2 / 100) * taxableValue).toFixed(2);
          row.SGST = ((gstRate / 2 / 100) * taxableValue).toFixed(2);
          row.IGST = ((gstRate / 100) * taxableValue).toFixed(2);
          row.TotalTax = (parseFloat(row.CGST) + parseFloat(row.SGST)).toFixed(
            2
          );
          row.FinalAmount = (taxableValue + parseFloat(row.TotalTax)).toFixed(
            2
          );
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
      toast.error("You must agree with the terms and conditions to proceed.");
      return;
    }

    // Clean up rows data before pushing to database
    const cleanedRows = rows.map((row) => {
      if (row.SelectState === "Intra") {
        return { ...row, CGST: "", SGST: "", IGST: row.IGST || "" };
      } else if (row.SelectState === "Inter") {
        return { ...row, IGST: "", CGST: row.CGST || "", SGST: row.SGST || "" };
      }
      return row;
    });

    try {
      await addDoc(collection(db, "purchase"), {
        purchaseDetails: cleanedRows,
        createdAt: new Date(),
      });
      toast.success("Form submitted successfully!");
      setRows([
        {
          Date: "",
          ItemName: "",
          ItemDescription: "",
          PartyName: "",
          GstNumber: "",
          InvoiceNumber: "",
          Quantity: "",
          TaxableValue: "",
          HsnSacCode: "",
          GstRate: "",
          IGST: "",
          CGST: "",
          SGST: "",
          TotalTax: "",
          FinalAmount: "",
          PaymentMode: "",
          Remark: "",
          PaymentStatus: "Pending",
        },
      ]);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error submitting form");
    }

    navigate(-1);
  };

  const togglePaymentStatus = (index) => {
    const newRows = rows.map((row, i) => {
      if (i === index) {
        row.PaymentStatus =
          row.PaymentStatus === "Pending" ? "Successful" : "Pending";
      }
      return row;
    });
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
  const [State, setState] = useState("");

  return (
    <div>
      <Navibar />
      <div className="p-10 w-full bg-zinc-800/40 h-screen backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Enter Purchase Details
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
            >
              Back
            </button>
          </div>
          {rows.map((row, index) => (
            <div
              key={index}
              className="mb-4 p-4 border border-gray-300 rounded-lg bg-white"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-md">
                {" "}
                {/* Reduced font size */}
                {Object.keys(row).map((key, idx) => {
                  if (key === "PartyName") {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium text-md">
                          Party Name
                        </label>
                        <select
                          value={row[key]}
                          onChange={(e) =>
                            handleInputChange(index, key, e.target.value)
                          }
                          className="w-full border p-2 rounded"
                        >
                          <option value="">Select Party</option>
                          {vendors.map((vendor, vIdx) => (
                            <option key={vIdx} value={vendor.partyName}>
                              {vendor.partyName}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (key === "ItemName") {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium text-md">
                          Item Name
                        </label>
                        <select
                          value={row[key]}
                          onChange={(e) =>
                            handleInputChange(index, key, e.target.value)
                          }
                          className="w-full border p-2 rounded"
                        >
                          <option value="">Select Item</option>
                          {items.map((item, vIdx) => (
                            <option
                              className="text-black"
                              key={vIdx}
                              value={item.items[0].itemCode}
                            >
                              {item.items[0].itemCode}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (key === "PaymentMode") {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium text-md">
                          Mode of Payment
                        </label>{" "}
                        {/* Adjusted label size */}
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
                  } else if (key === "Remark") {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium text-md">
                          Remark
                        </label>{" "}
                        {/* Adjusted label size */}
                        <input
                          type="text"
                          value={row[key]}
                          onChange={(e) =>
                            handleInputChange(index, key, e.target.value)
                          }
                          className="w-full border p-2 rounded"
                        />
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
                  } else if (key === "SelectState") {
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
                              handleInputChange(index, key, e.target.value)
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
                            <div key={idx} className="col-span-1 w-full mt-3">
                              <label className="block font-medium text-md">
                                {formatLabel("IGST")}
                              </label>{" "}
                              {/* Adjusted label size */}
                              <input
                                type="number"
                                value={row["IGST"]}
                                onChange={(e) =>
                                  handleInputChange(index, key, e.target.value)
                                }
                                className="w-full border p-2 rounded text-md" // Reduced font size
                              />
                            </div>
                          </>
                        )}
                        {row.SelectState == "Inter" && (
                          <>
                            <div className=" flex w-[60rem] gap-5  col-span-2 mt-3">
                              <div key={idx} className="col-span-1 w-full">
                                <label className="block font-medium text-md">
                                  {formatLabel("CGST")}
                                </label>{" "}
                                {/* Adjusted label size */}
                                <input
                                  type="number"
                                  value={row["CGST"]}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      key,
                                      e.target.value
                                    )
                                  }
                                  className="w-full border p-2 rounded text-md" // Reduced font size
                                />
                              </div>
                              <div key={idx} className="col-span-1 w-full">
                                <label className="block font-medium text-md">
                                  {formatLabel("SGST")}
                                </label>{" "}
                                {/* Adjusted label size */}
                                <input
                                  type="number"
                                  value={row["SGST"]}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      key,
                                      e.target.value
                                    )
                                  }
                                  className="w-full border p-2 rounded text-md" // Reduced font size
                                />
                              </div>
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
                          onChange={(e) =>
                            handleInputChange(index, key, e.target.value)
                          }
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
                  } else if (
                    key !== "IGST" &&
                    key !== "SGST" &&
                    key !== "CGST"
                  ) {
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
                          onChange={(e) =>
                            handleInputChange(index, key, e.target.value)
                          }
                          className="w-full border p-2 rounded text-md" // Reduced font size
                        />
                      </div>
                    );
                  }
                })}
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
            <label className="block font-medium text-white text-sm">
              I agree with the terms and conditions
            </label>{" "}
            {/* Adjusted label size */}
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-xs"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRow;
