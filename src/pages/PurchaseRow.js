import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navibar from '../components/Navibar';

const AddRow = () => {
  const [rows, setRows] = useState([{
    Date: '',
    ItemName: '',
    GstNumber: '',
    InvoiceNumber: '',
    Quantity: '',
    HsnSacCode: '',
    GstRate: '',
    TaxableValue: '',
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
  const navigate = useNavigate();

  const handleInputChange = (index, field, value) => {
    const newRows = rows.map((row, i) => {
      if (i === index) {
        row[field] = value;

        if (field === 'GstRate' || field === 'TaxableValue') {
          const gstRate = parseFloat(row.GstRate) || 0;
          const taxableValue = parseFloat(row.TaxableValue) || 0;

          row.CGST = gstRate && !row.CGST ? ((gstRate / 2) / 100 * taxableValue).toFixed(2) : row.CGST;
          row.SGST = gstRate && !row.SGST ? ((gstRate / 2) / 100 * taxableValue).toFixed(2) : row.SGST;
          row.IGST = gstRate && !row.IGST ? (gstRate / 100 * taxableValue).toFixed(2) : row.IGST;
          row.TotalTax = gstRate ? (parseFloat(row.CGST) + parseFloat(row.SGST) + parseFloat(row.IGST)).toFixed(2) : row.TotalTax;
          row.FinalAmount = taxableValue ? (taxableValue + parseFloat(row.TotalTax)).toFixed(2) : row.FinalAmount;
        }
      }
      return row;
    });
    setRows(newRows);
  };

  const handleAgreeChange = () => {
    setIsAgreed(!isAgreed);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    if (!isAgreed) {
      alert('You must agree with the terms and conditions to proceed.');
      return;
    }
    alert('Form submitted successfully!');
    // Handle form submission logic here
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
      <div className='p-10 w-full bg-zinc-800/40 h-screen backdrop-blur-sm'>
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enter Purchase Details</h1>
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
                {Object.keys(row).map((key, idx) => {
                  if (key === 'PaymentMode') {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium">Mode of Payment</label>
                        <select 
                          value={row[key]}
                          onChange={(e) => handleInputChange(index, key, e.target.value)}
                          className="w-full border p-2 rounded"
                        >
                          <option value="">Select Payment Mode</option>
                          <option value="PhonePe/GPay/Paytm">PhonePe/GPay/Paytm</option>
                          <option value="Netbanking">Netbanking</option>
                          <option value="UPI">UPI</option>
                          <option value="Cash">Cash</option>
                        </select>
                      </div>
                    );
                  } else if (key === 'Remark') {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium">Remark</label>
                        <input 
                          type="text" 
                          value={row[key]} 
                          onChange={(e) => handleInputChange(index, key, e.target.value)}
                          className="w-full border p-2 rounded"
                        />
                      </div>
                    );
                  } else if (key === 'PaymentStatus') {
                    return (
                      <div key={idx} className="col-span-1 flex items-center">
                        <label className="block font-medium mr-2">Payment Status:</label>
                        <button 
                          onClick={() => togglePaymentStatus(index)} 
                          className={`py-2 px-4 rounded ${row[key] === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'} text-white`}
                        >
                          {row[key]}
                        </button>
                      </div>
                    );
                  } else {
                    return (
                      <div key={idx} className="col-span-1">
                        <label className="block font-medium">{formatLabel(key)}</label>
                        <input 
                          type={key === 'Quantity' || key === 'GstRate' || key === 'TaxableValue' ? 'number' : key === 'Date' ? 'date' : 'text'}
                          value={row[key]} 
                          onChange={(e) => handleInputChange(index, key, e.target.value)}
                          className="w-full border p-2 rounded"
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
  );
}

export default AddRow;
