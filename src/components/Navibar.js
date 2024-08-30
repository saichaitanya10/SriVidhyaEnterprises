import React, { useState } from 'react';
import img from '../assets/upscale.png'

const Navibar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim() !== '') {
      console.log('Search term:', searchTerm);
      // Implement your search logic here
    }
  };

  const handleLogout = () => {
    // Clear user session data from localStorage
    localStorage.removeItem('isLoggedIn'); // Adjust key name based on your localStorage setup
    console.log('User logged out');
    window.location.href = '/'; // Redirect to the login page or home page
  };

  return (
    <div className=' bg-white'>
      <nav className="bg-white  w-[90vw] px-1 py-1">
        <div className="    flex p-4 items-center  justify-between">
          <a className="flex items-center ">
            <img src={img} className="h-8" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">Sri Vidhya Enterprises</span>
          </a>
          
          <div className="items-center justify-between hidden w-full md:flex md:w-auto ">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
              <li>
                <a href="/" className="block py-2 px-5 hover:text-white text-gray-900 rounded-lg hover:bg-gray-100 md:hover:bg-transparent md:hover:bg-zinc-700">Home</a>
              </li>
              <li className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-between w-full py-2 px-5 hover:text-white text-gray-900 rounded-lg hover:bg-gray-100 md:hover:bg-transparent md:hover:bg-zinc-700"
                >
                  Services
                  <svg
                    className="w-4 h-4 ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <ul className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <li>
                      <a href="/ItemEntry" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        Item Entry
                      </a>
                    </li>
                    <li>
                      <a href="/VendorSupplierSelection" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        Vendor & Supplier Data
                      </a>
                    </li>
                    <li>
                      <a href="/purchase" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        Purchase Entry
                      </a>
                    </li>
                    <li>
                      <a href="/sales" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        Sales Entry
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <a href="#" className="block py-2 px-5 hover:text-white text-gray-900 rounded-lg hover:bg-gray-100 md:hover:bg-transparent md:hover:bg-zinc-700">Invoice</a>
              </li>
            </ul>
          </div>
          <div className="flex ">
            <button
              data-collapse-toggle="navbar-search"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-search"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="-mr-20 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navibar;
