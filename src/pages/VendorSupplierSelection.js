import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Navibar from '../components/Navibar';

const VendorSupplierSelection = () => {
  return (
    <div>
      <Navibar />
      <div className='p-6 w-full bg-zinc-800/40 h-screen backdrop-blur-sm flex flex-col items-center'>
        <div className='mt-32 flex flex-col items-center flex-grow'>
          <h1 className="text-3xl font-bold mb-8 text-white">Vendor & Supplier Data</h1>
          <div className="flex space-x-20">
            <Link to="/vendorSupplier"> {/* Path for vendor entry */}
              <button className="bg-gradient-to-r from-slate-500 to-slate-800 py-8 px-16 text-3xl font-semibold tracking-wide uppercase rounded-lg hover:opacity-80 hover:scale-105 transform transition-transform duration-300">
                <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
                  VENDOR ENTRY
                </span>
              </button>
            </Link>
            <Link to="/supplierDetails"> {/* Path for supplier entry */}
              <button className="bg-gradient-to-r from-slate-500 to-slate-800 py-8 px-16 text-3xl font-semibold tracking-wide uppercase rounded-lg hover:opacity-80 hover:scale-105 transform transition-transform duration-300">
                <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
                  SUPPLIER ENTRY
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSupplierSelection;
