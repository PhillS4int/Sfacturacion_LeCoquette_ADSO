import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

//Components
import Sidebar from "../components/ui/navigation/Sidebar";
import MobileMenu from "../components/ui/navigation/MobileMenu";

//Logo Le Coquette
import logo from "../assets/Le-Coquette-logo.svg";

const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      <Sidebar />

      {/* Header Mobile */}
      <div className="sticky top-0 z-10 flex h-16 border-b bg-(--color-fondo) md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="px-4 text-(--color-primario)"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>

        <div className="flex items-center px-4">
          <img src={logo} alt="Logo"/>          
        </div>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="md:pl-64">
        <main className="py-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default MainLayout;