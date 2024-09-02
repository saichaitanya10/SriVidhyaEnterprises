import React, { useEffect, useState } from "react";
import Navibar from "../components/Navibar";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
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

const Sales = () => {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "sales"));
        const salesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          salesDetails: doc.data().salesDetails || [], // Ensure salesDetails is always an array
        }));
        console.log("Fetched Sales Data:", salesList); // Check the fetched data
        setSalesData(salesList);
      } catch (error) {
        console.error("Error fetching sales data: ", error);
      }
    };

    fetchSalesData();
  }, []);

  const handleEdit = (id) => {
    navigate(`/add-salesrow/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, "sales", id));
        toast.success("Document deleted successfully!");
        setSalesData(salesData.filter((sale) => sale.id !== id));
      } catch (error) {
        console.error("Error deleting document: ", error);
        toast.error("Error deleting document.");
      }
    }
  };

  const handleAddRow = () => {
    navigate("/add-salesrow");
  };

  // Filtering sales data based on search query
  const filteredSalesData = salesData.filter((sale) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      (sale.partyName &&
        sale.partyName.toLowerCase().includes(lowerCaseQuery)) ||
      (sale.salesDetails?.[0]?.ItemName &&
        sale.salesDetails[0].ItemName.toLowerCase().includes(lowerCaseQuery)) ||
      (sale.salesDetails?.[0]?.ItemDescription &&
        sale.salesDetails[0].ItemDescription.toLowerCase().includes(
          lowerCaseQuery
        ))
    );
  });

  console.log("Filtered Sales Data:", filteredSalesData);

  // Function to highlight search query
  const highlightText = (text) => {
    if (!text || !searchQuery) return text;
    const regex = new RegExp(
      `(${searchQuery.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`,
      "gi"
    );
    return text.replace(regex, "<mark>$1</mark>");
  };

  return (
    <div>
      <Navibar />
      <div className="p-8 w-full bg-zinc-800/40 h-screen backdrop-blur-sm">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sales Transaction History
          </h1>

          <div className="flex items-center justify-between mb-4 gap-4">
            <form className="flex-grow flex items-center border border-gray-300 rounded-lg bg-white shadow-md">
              <label htmlFor="default-search" className="sr-only">
                Search
              </label>
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-4 pl-10 text-sm text-gray-900 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    console.log("Updated Search Query:", e.target.value); // Check query value
                  }}
                />
              </div>
              <button
                type="submit"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 mr-2 py-2"
              >
                Search
              </button>
            </form>

            <button
              onClick={handleAddRow}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              Add Row
            </button>
          </div>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th scope="col" className="px-2 py-3 w-20">
                    Date
                  </th>
                  <th scope="col" className="px-2 py-3 w-24">
                    Vendor Name
                  </th>
                  <th scope="col" className="px-2 py-3 w-24">
                    GST Number
                  </th>
                  <th scope="col" className="px-2 py-3 w-24">
                    Item Name
                  </th>
                  <th scope="col" className="px-2 py-3 w-40">
                    Description
                  </th>
                  <th scope="col" className="px-2 py-3 w-24">
                    HSN/SAC Code
                  </th>
                  <th scope="col" className="px-2 py-3 w-24">
                    GST Number
                  </th>
                  <th scope="col" className="px-2 py-3 w-24">
                    Invoice Number
                  </th>
                  <th scope="col" className="px-2 py-3 w-16">
                    Quantity
                  </th>
                  <th scope="col" className="px-2 py-3 w-24">
                    Taxable Value
                  </th>
                  <th scope="col" className="px-2 py-3 w-16">
                    GST Rate
                  </th>
                  <th scope="col" className="px-2 py-3 w-16">
                    CGST
                  </th>
                  <th scope="col" className="px-2 py-3 w-16">
                    SGST
                  </th>
                  <th scope="col" className="px-2 py-3 w-16">
                    IGST
                  </th>
                  <th scope="col" className="px-2 py-3 w-24">
                    Total Tax
                  </th>
                  <th scope="col" className="px-2 py-3 w-24">
                    Final Amount
                  </th>
                  <th scope="col" className="px-2 py-3 w-24">
                    Payment Mode
                  </th>
                  <th scope="col" className="px-2 py-3 w-32">
                    Remark
                  </th>
                  <th scope="col" className="px-2 py-3 w-24">
                    Payment Status
                  </th>
                  <th scope="col" className="px-2 py-3 w-28">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {salesData.length > 0 ? (
                  salesData.map((sale) => (
                    <tr key={sale.id} className="bg-white border-b">
                      <td className="px-2 py-2 text-center">
                        {sale.Date || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {sale.PartyName || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {sale.GstNumber || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {sale.ItemName || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {sale.ItemDescription || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {sale.HsnSacCode || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {sale.GstNumber || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {sale.InvoiceNumber || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {sale.Quantity || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {sale.TaxableValue || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {sale.GstRate || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {sale.CGST || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {sale.SGST || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {sale.IGST || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {sale.TotalTax || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {sale.FinalAmount || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {sale.PaymentMode || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {sale.Remark || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {sale.PaymentStatus || "N/A"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        <button
                          onClick={() => handleEdit(sale.id)}
                          className="text-blue-600 hover:underline mr-2 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(sale.id)}
                          className="text-red-600 hover:underline text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="19" className="px-2 py-2 text-center">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
