
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Buy from "./pages/Buy";
import Rent from "./pages/Rent";
import Sell from "./pages/Sell";
import SmartMatch from "./pages/SmartMatch";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProperties from "./pages/admin/ManageProperties";
import ManageUsers from "./pages/admin/ManageUsers";

import SellerDashboard from "./pages/seller/SellerDashboard";
import AddProperty from "./pages/seller/AddProperty";
import MyProperties from "./pages/seller/MyProperties";

function SiteLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/smart-match" element={<SmartMatch />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin-only pages */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN", "MAIN_ADMIN"]}
              />
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route
              path="/admin/properties"
              element={<ManageProperties />}
            />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>

          {/* Seller and admin property management */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={["SELLER", "ADMIN", "MAIN_ADMIN"]}
              />
            }
          >
            <Route path="/seller" element={<SellerDashboard />} />
            <Route
              path="/seller/add-property"
              element={<AddProperty />}
            />
            <Route
              path="/seller/my-properties"
              element={<MyProperties />}
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
