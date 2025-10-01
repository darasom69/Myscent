import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuthContext } from "../../context/AuthContext";
import { useBrandContext } from "../../context/BrandContext";
import AuthModal from "../navbar/AuthModal";
import RegisterModal from "../navbar/RegistreModal";

export default function Navbar() {
  const [modal, setModal] = useState<null | "login" | "register">(null);
  const [openBrands, setOpenBrands] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  const { isAuthenticated, logout, user } = useAuthContext();
  const { brands } = useBrandContext();

  const navigate = useNavigate();

  const brandsRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  // Ferme menus au changement de page
  useEffect(() => {
    setOpenBrands(false);
    setOpenUserMenu(false);
    setOpenMobile(false);
  }, []); // Run only once on mount

  // Ferme au clic dehors / touche ESC
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (brandsRef.current && !brandsRef.current.contains(e.target as Node))
        setOpenBrands(false);
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      )
        setOpenUserMenu(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenBrands(false);
        setOpenUserMenu(false);
        setOpenMobile(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const navLink =
    "tracking-[0.14em] uppercase text-xs md:text-sm text-[#070605] hover:opacity-80 transition-opacity";
  const active = "underline underline-offset-8 decoration-[1.5px]";

  return (
    <>
      {/* Barre blanche 72px */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/5">
        <div className="mx-auto max-w-7xl px-6">
          {/* ⬇️ justify-start + spacer pour pousser les actions */}
          <div className="h-[72px] flex items-center justify-start gap-0">
            {/* Bloc gauche : Logo + Liens (collés) */}
            <div className="flex items-center gap-10">
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center"
                aria-label="Aller à l’accueil Myscent"
              >
                <img
                  src="/Myscent.png"
                  alt="MyScent"
                  className="h-10 w-auto object-contain"
                />
              </Link>

              {/* Liens */}
              <nav className="hidden md:flex items-center gap-8">
                {/* Marques (dropdown) */}
                <div className="relative" ref={brandsRef}>
                  <button
                    type="button"
                    onClick={() => setOpenBrands((p) => !p)}
                    aria-haspopup="menu"
                    aria-expanded={openBrands}
                    aria-controls="menu-marques"
                    className={`${navLink} flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded`}
                  >
                    Marques
                    <motion.span
                      animate={{ rotate: openBrands ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} aria-hidden />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {openBrands && (
                      <motion.div
                        id="menu-marques"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-4 w-[80vw] max-w-3xl bg-[#f8f3ef] text-[#111] border border-black/10 rounded-xl shadow-xl px-6 py-5 z-50"
                        role="menu"
                      >
                        <p className="text-xs tracking-widest uppercase text-gray-500 mb-3">
                          Toutes les marques
                        </p>
                        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {brands.map((b) => (
                            <li key={b.id}>
                              <Link
                                to={`/marque/${b.id}`}
                                onClick={() => setOpenBrands(false)}
                                className="block text-sm font-medium text-gray-800 hover:text-black hover:underline underline-offset-4"
                                role="menuitem"
                              >
                                {b.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <NavLink
                  to="/parfums"
                  className={({ isActive }) =>
                    `${navLink} ${isActive ? active : ""}`
                  }
                >
                  Parfums
                </NavLink>

                {/* Ajuste en /quizz si c’est ta vraie route */}
                <NavLink
                  to="/quizz"
                  className={({ isActive }) =>
                    `${navLink} ${isActive ? active : ""}`
                  }
                >
                  Quizz
                </NavLink>
              </nav>
            </div>

            {/* ⬅️ Spacer pour décoller les actions */}
            <div className="flex-1" />

            {/* Bloc droite : actions */}
            <div className="flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={() => setModal("register")}
                    className="px-5 py-2 rounded-xl border border-[#07060526] bg-transparent hover:bg-gray-50 text-sm text-[#070605]"
                  >
                    S’inscrire
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal("login")}
                    className="px-5 py-2 rounded-xl text-sm text-white bg-[linear-gradient(135deg,rgba(136,112,99,1)_0%,rgba(220,204,191,1)_100%)] hover:opacity-90"
                  >
                    Connexion
                  </button>
                </>
              ) : (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setOpenUserMenu((p) => !p)}
                    className="p-2 rounded-full text-[#070605] hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                    aria-haspopup="menu"
                    aria-expanded={openUserMenu}
                    aria-controls="menu-user"
                  >
                    <User size={20} aria-hidden />
                    <span className="sr-only">Menu utilisateur</span>
                  </button>
                  <AnimatePresence>
                    {openUserMenu && (
                      <motion.div
                        id="menu-user"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl overflow-hidden z-50"
                        role="menu"
                      >
                        {user?.role === "admin" ? (
                          <button
                            type="button"
                            onClick={() => {
                              navigate("/admin");
                              setOpenUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 font-medium"
                            role="menuitem"
                          >
                            Administrateur
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              navigate("/moncompte");
                              setOpenUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50"
                            role="menuitem"
                          >
                            Mon compte
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            navigate("/");
                            setOpenUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                          role="menuitem"
                        >
                          Déconnexion
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Burger mobile */}
              <button
                type="button"
                onClick={() => setOpenMobile((p) => !p)}
                className="md:hidden p-2 rounded-md text-[#070605] hover:bg-black/5"
                aria-label="Ouvrir le menu"
                aria-expanded={openMobile}
                aria-controls="menu-mobile"
              >
                {openMobile ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <AnimatePresence>
        {openMobile && (
          <motion.nav
            id="menu-mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-[#f8f3ef] border-b border-black/10 px-4 py-4"
          >
            <details className="[&>summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between py-2 cursor-pointer select-none">
                <span className="text-sm tracking-widest uppercase text-gray-900">
                  Marques
                </span>
                <ChevronDown size={18} />
              </summary>
              <ul className="mt-2 grid grid-cols-2 gap-3">
                {brands.map((b) => (
                  <li key={b.id}>
                    <Link
                      to={`/marque/${b.id}`}
                      onClick={() => setOpenMobile(false)}
                      className="block text-sm text-gray-800 hover:underline underline-offset-4"
                    >
                      {b.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>

            <NavLink
              to="/parfums"
              onClick={() => setOpenMobile(false)}
              className="block py-2 text-sm uppercase text-gray-900"
            >
              Parfums
            </NavLink>
            <NavLink
              to="/quiz" /* change en /quizz si besoin */
              onClick={() => setOpenMobile(false)}
              className="block py-2 text-sm uppercase text-gray-900"
            >
              Quiz
            </NavLink>
          </motion.nav>
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
