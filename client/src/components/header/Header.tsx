import { User } from "lucide-react";
import { useState } from "react";
import AuthModal from "../header/AuthModal";

function Header() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <header className="bg-[url('/Fond.png')] bg-cover bg-center h-20 flex items-center justify-between px-6 shadow-md">
        {/* Logo */}
        <div className="flex items-center space-x-15">
          <img className="h-20" src="/Myscent.png" alt="logo Myscent" />
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-12 text-lg font-medium self-end pb-2">
          <a href="#marque" className="hover:underline">
            Marque
          </a>
          <a href="#parfum" className="hover:underline">
            Parfum
          </a>
          <a href="#quiz" className="hover:underline">
            Quizz
          </a>
        </nav>

        {/* User Icon */}
        <div>
          <button
            type="button"
            onClick={() => setShowAuth(true)}
            className="p-2 hover:bg-black/10 rounded-full"
          >
            <User size={22} />
          </button>
        </div>
      </header>

      {/* Pop up */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}

export default Header;
