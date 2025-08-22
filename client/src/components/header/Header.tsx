import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthContext } from "../../context/AuthContext";
import { useBrandContext } from "../../context/BrandContext";
import AuthModal from "../header/AuthModal";
import RegisterModal from "../header/RegistreModal";

function Header() {
  const [modal, setModal] = useState<null | "login" | "register">(null);
  const [openBrands, setOpenBrands] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const navigate = useNavigate();

  const { isAuthenticated, logout } = useAuthContext();
  const { brands } = useBrandContext();

  return (
    <>
      <header className="bg-[url('/Fond.png')] bg-cover bg-center h-20 flex items-center justify-between px-6 shadow-md relative z-50">
        {/* Logo */}
        <div className="flex items-center space-x-15">
          <Link to="/">
            <img className="h-20" src="/Myscent.png" alt="logo Myscent" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-12 text-lg font-medium self-end pb-2">
          <button
            type="button"
            onClick={() => setOpenBrands((prev) => !prev)}
            className="flex items-center gap-2 hover:underline"
          >
            Marque
            <motion.div
              animate={{ rotate: openBrands ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={18} />
            </motion.div>
          </button>
          <Link to="/parfums" className="hover:underline">
            Parfum
          </Link>
          <Link to="/quizz" className="hover:underline">
            Quizz
          </Link>
        </nav>

        {/* User Icon / Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              isAuthenticated
                ? setOpenUserMenu((prev) => !prev)
                : setModal("login")
            }
            className="p-2 hover:bg-black/10 rounded-full"
          >
            <User size={22} />
          </button>

          {isAuthenticated && openUserMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
              <button
                type="button"
                onClick={() => {
                  navigate("/moncompte");
                  setOpenUserMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Mon compte
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                  setOpenUserMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Dropdown marques */}
      <AnimatePresence>
        {openBrands && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-[#f8f3ef] border-b border-black px-6 py-4"
          >
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {brands.map((brand) => (
                <li key={brand.id}>
                  <Link
                    to={`/marque/${brand.id}`}
                    className="block text-sm font-medium text-gray-800 hover:text-black hover:underline"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modales */}
      {modal === "login" && (
        <AuthModal
          onClose={() => setModal(null)}
          onSwitchToRegister={() => setModal("register")}
        />
      )}
      {modal === "register" && (
        <RegisterModal
          onClose={() => setModal(null)}
          onSwitchToLogin={() => setModal("login")}
        />
      )}
    </>
  );
}

export default Header;
