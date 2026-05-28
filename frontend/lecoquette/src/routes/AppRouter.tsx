import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login/Login";
import Registro from "../pages/auth/Registro/Registro";
import ForgotPassword from "../pages/auth/Forgotpassword/Forgotpassword";

// MainLayout
import MainLayout from "../layout/MainLayout";

// Billing pages
import Dashboard from "../pages/Billing/Dashboard/Dashboard";
import Invoices from "../pages/Billing/Invoices/Invoices";
import Customers from "../pages/Billing/Customers/Customers";
import Analytics from "../pages/Billing/Analytics/Analytics";
import Settings from "../pages/Billing/Settings/Settings";
import Users from "../pages/Billing/Users/Users";

// Profile page
import ProfilePage from "../pages/Billing/UserProfile/ProfilePage/ProfilePage";
import AccountSettingsPage from "../pages/Billing/UserProfile/AccountSettings/AccountSettingsPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar-contrasena" element={<ForgotPassword />} />

        {/* Rutas protegidas con layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<Users />} />

          {/* Perfil y ajustes de la cuenta */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/account-settings" element={<AccountSettingsPage />} />
        </Route>

        {/* Defaults */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;