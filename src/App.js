import "./index.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ItemEntry from "./pages/ItemEntry";
import ItemRow from "./pages/ItemRow";
import VendorSupplier from "./pages/VendorSupplier";
import VendorDetails from "./pages/VendorDetails";
import SupplierDetails from "./pages/SupplierDetails";
import VendorSupplierSelection from "./pages/VendorSupplierSelection";
import Sales from "./pages/Sales";
import Purchase from "./pages/Purchase";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import AddRow from "./pages/SalesRow";
import PurchaseRow from "./pages/PurchaseRow";
import { Toaster } from "react-hot-toast";
import EditSalesRow from "./pages/EditSalesRow";
import EditPurchaseRow from "./pages/EditPurchaseRow";
import AddSupplier from "./pages/AddSupplier";
import Login from "./components/Login";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import carImg from "./assets/car.jpeg";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, []);
  return (
    <div
      className=" "
      // style={{ backgroundImage: `url(${carImg})` }}
    >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ItemEntry" element={<ItemEntry />} />
        <Route
          path="/VendorSupplierSelection"
          element={<VendorSupplierSelection />}
        />
        <Route path="/VendorSupplier" element={<VendorSupplier />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/invoicegenerator" element={<InvoiceGenerator />} />
        <Route path="/add-purchaserow" element={<PurchaseRow />} />
        <Route path="/add-purchaserow/:id" element={<EditPurchaseRow />} />
        <Route path="/add-salesrow" element={<AddRow />} />
        <Route path="/add-salesrow/:id" element={<EditSalesRow />} />
        <Route path="/ItemRow" element={<ItemRow />} />
        <Route path="/ItemRow/:id" element={<ItemRow />} />
        <Route path="/VendorDetails" element={<VendorDetails />} />
        <Route path="/VendorDetails/:id" element={<VendorDetails />} />
        <Route path="/SupplierDetails" element={<SupplierDetails />} />
        <Route path="/AddSupplier/:id" element={<AddSupplier />} />
        <Route path="/AddSupplier" element={<AddSupplier />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
