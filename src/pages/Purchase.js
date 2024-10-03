import React, { useEffect, useState } from "react";
import Navibar from "../components/Navibar";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { CSVLink } from 'react-csv';
import toast from "react-hot-toast";
import dayjs from "dayjs";

const PurchaseRow = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const db = getFirestore();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const q = query(
          collection(db, "purchase"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedPurchases = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPurchases(fetchedPurchases);
      } catch (error) {
        console.error("Error fetching purchase details:", error);
      }
    };

    fetchPurchases();
  }, [db]);

  const handleAddRow = () => {
    navigate("/add-purchaserow");
  };

  const handleEdit = (id) => {
    navigate(`/add-purchaserow/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, "purchase", id));
        setPurchases(purchases.filter((purchase) => purchase.id !== id));
        toast.success("Successfully deleted purchase");
      } catch (error) {
        console.error("Error deleting purchase:", error);
      }
    }
  };

  // Highlight matching text
  const highlightText = (text) => {
    if (!searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={index} className="bg-yellow-300">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const DownloadCSVButton = () => {
    const transformedData = transformData(purchases); // Apply the transformation here
  
    return (
      <CSVLink
        data={transformedData}
        filename={"purchaseData.csv"}
        className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 mr-2 py-2"
        target="_blank"
      >
        Download
      </CSVLink>
    );
  };

  // Filter purchases based on search query
  const filteredPurchases = purchases.filter((purchase) =>
    purchase.purchaseDetails.some((row) =>
      [row.PartyName, row.ItemName, row.ItemDescription].some((field) =>
        field.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  );

  const transformData = (data) => {
    // Flatten the purchaseDetails array and create an array of objects
    return data.flatMap(purchase => 
      purchase.purchaseDetails.map(detail => ({
        Date: detail.Date ? dayjs(detail.Date).format("D/M/YYYY") : '', 
        PartyName: detail.PartyName || '',
        GstNumber: detail.GstNumber || '',
        ItemName: detail.ItemName || '',
        AddMoreItems: detail.AddMoreItems || '',
        ItemDescription: detail.ItemDescription || '',
        HsnSacCode: detail.HsnSacCode || '',
        InvoiceNumber: detail.InvoiceNumber || '',
        Quantity: detail.Quantity || '',
        TaxableValue: detail.TaxableValue || '',
        GstRate: detail.GstRate || '',
        CGST: detail.CGST || '',
        SGST: detail.SGST || '',
        IGST: detail.IGST || '',
        TotalTax: detail.TotalTax || '',
        FinalAmount: detail.FinalAmount || '',
        PaymentMode: detail.PaymentMode || '',
        PaymentStatus: detail.PaymentStatus || '',
        Remark: detail.Remark || ''
      }))
    );
  };
  

  return (
    <div>
      <Navibar />
      <div className="p-4 sm:p-6 w-full bg-zinc-800/40 min-h-screen backdrop-blur-sm">
        <div className="container mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Purchase Transaction History
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <form
              className="flex-grow flex items-center border border-gray-300 rounded-lg bg-white shadow-md"
              onSubmit={(e) => e.preventDefault()}
            >
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
                  className="block w-full p-2 pl-10 text-sm text-gray-900 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search Product Name"
                  value={searchQuery} // Bind searchQuery state to input
                  onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
                />
              </div>
              <button
                type="submit"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none mx-2 my-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-2"
              >
                Search
              </button>
              <DownloadCSVButton />
            </form>

            <button
              onClick={handleAddRow}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              Add Row
            </button>
          </div>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
            <table className="w-full border-collapse text-xs sm:text-sm text-left rtl:text-right text-gray-500 border-spacing-0">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr className="bg-gray-200">
                  <th className="px-2 py-2 w-12">Date</th>
                  <th className="px-2 py-2 w-20">Supplier Name</th>
                  <th className="px-2 py-2 w-20">GST Number</th>
                  <th className="px-2 py-2 w-20">Item Name</th>
                  <th className="px-2 py-2 w-20">More Items</th>
                  <th className="px-2 py-2 w-32">Item Description</th>
                  <th className="px-2 py-2 w-20">HSN/SAC Code</th>
                  <th className="px-2 py-2 w-20">Invoice Number</th>
                  <th className="px-2 py-2 w-16">Quantity</th>
                  <th className="px-2 py-2 w-24">Taxable Value</th>
                  <th className="px-2 py-2 w-16">GST Rate</th>
                  <th scope="col" className="px-2 py-3 w-16">
                    CGST
                  </th>
                  <th scope="col" className="px-2 py-3 w-16">
                    SGST
                  </th>
                  <th className="px-2 py-2 w-16">IGST</th>
                  <th className="px-2 py-2 w-24">Total Tax</th>
                  <th className="px-2 py-2 w-24">Final Amount</th>
                  <th className="px-2 py-2 w-24">Payment Mode</th>
                  <th className="px-2 py-2 w-24">Remark</th>
                  <th className="px-2 py-2 w-24">Payment Status</th>
                  <th className="px-2 py-2 w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.length > 0 ? (
                  filteredPurchases.map((purchase) => (
                    <React.Fragment key={purchase.id}>
                      {purchase.purchaseDetails.map((row, idx) => (
                        <tr
                          key={idx}
                          className="bg-white text-xs sm:text-sm border-b border-gray-300"
                        >
                          <td className="px-2 py-2">
                            {dayjs(row.Date).format("D/M/YYYY")}
                          </td>
                          <td className="px-2 py-2">
                            {highlightText(row.PartyName)}
                          </td>
                          <td className="px-2 py-2">{row.GstNumber}</td>
                          <td className="px-2 py-2">
                            {highlightText(row.ItemName)}
                          </td>
                          <td className="px-2 py-2">
                            {highlightText(row.AddMoreItems)}
                          </td>
                          <td className="px-2 py-4">
                            {highlightText(row.ItemDescription)}
                          </td>
                          <td className="px-2 py-2">{row.HsnSacCode}</td>
                          <td className="px-2 py-2">{row.InvoiceNumber}</td>
                          <td className="px-2 py-2">{row.Quantity}</td>
                          <td className="px-2 py-2">{row.TaxableValue}</td>
                          <td className="px-2 py-2">{row.GstRate}%</td>
                          <td className="px-2 py-2 text-center">
                            {row.CGST || "N/A"}
                          </td>
                          <td className="px-2 py-2 text-center">
                            {row.SGST || "N/A"}
                          </td>
                          <td className="px-2 py-2">{row.IGST || "N/A"}</td>
                          <td className="px-2 py-2">{row.TotalTax}</td>
                          <td className="px-2 py-2">{row.FinalAmount}</td>
                          <td className="px-2 py-2">{row.PaymentMode}</td>
                          <td className="px-2 py-2">{row.Remark}</td>
                          <td
                            className={`px-2 py-2 ${
                              row.PaymentStatus === "Pending"
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {row.PaymentStatus}
                          </td>
                          <td className="px-2 py-2">
                            <button
                              onClick={() => handleEdit(purchase.id)}
                              className="text-blue-600 hover:underline mr-2 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(purchase.id)}
                              className="text-red-600 hover:underline text-xs"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="17" className="text-center py-4">
                      No data found
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

export default PurchaseRow;
