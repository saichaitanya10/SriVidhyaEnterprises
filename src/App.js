import "./index.css";
import {Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import ItemEntry from "./pages/ItemEntry";
import ItemRow from "./pages/ItemRow";
import VendorSupplier from "./pages/VendorSupplier";
import VendorDetails from "./pages/VendorDetails";
import Sales from "./pages/Sales";
import Purchase from "./pages/Purchase";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import AddRow from "./pages/SalesRow";
import PurchaseRow from "./pages/PurchaseRow";
import { Toaster } from "react-hot-toast";
import EditSalesRow from "./pages/EditSalesRow";
import EditPurchaseRow from "./pages/EditPurchaseRow";



function App() {
  return (
    <div
      className="bg-cover bg-center h-screen"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1721843431268-b8e380c6892f?q=80&w=2854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
    >
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ItemEntry" element={<ItemEntry />} />
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
     </Routes>
     <Toaster/>
    </div>
  );
}

export default App;