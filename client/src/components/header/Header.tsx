import { User } from "lucide-react";

function Header() {
  return (
    <section className="bg-[url('/Fond.png')] bg-cover bg-center h-20 flex items-center justify-between px-6 shadow-md">
      {/* Logo */}
      <section className="flex items-center space-x-15">
        <img className="h-20" src="/Myscent.png" alt="logo Myscent" />
      </section>

      {/* Navigation */}
      <nav className="flex items-center space-x-8 text-lg font-medium">
        <a
          href="#marque"
          className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black hover:after:w-full after:transition-all after:duration-300"
        >
          Marque
        </a>
        <a
          href="#parfum"
          className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black hover:after:w-full after:transition-all after:duration-300"
        >
          Parfum
        </a>
        <a
          href="#quiz"
          className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black hover:after:w-full after:transition-all after:duration-300"
        >
          Quizz
        </a>
      </nav>

      {/* User Icon */}
      <section>
        <button type="button" className="p-2 hover:bg-black/10 rounded-full">
          <User size={22} />
        </button>
      </section>
    </section>
  );
}

export default Header;
