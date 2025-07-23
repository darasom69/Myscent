import { User, X } from "lucide-react";
import { useState } from "react";
import { useUserContext } from "../../context/UserContext";

type AuthModalProps = {
  onClose: () => void;
};

function AuthModal({ onClose }: AuthModalProps) {
  const { login } = useUserContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = await login(email, password);
    if (success) {
      onClose();
    } else {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <section className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <section className="relative bg-primary rounded-2xl shadow-lg w-full max-w-md p-8 border border-gray-300">
        {/* Bouton fermer */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/10"
          aria-label="Fermer la fenêtre de connexion"
        >
          <X size={22} />
        </button>

        {/* Icone utilisateur */}
        <section className="flex justify-center mb-6">
          <div className="w-20 h-20 border rounded-full flex items-center justify-center">
            <User size={44} />
          </div>
        </section>

        {/* Titre */}
        <h2 className="text-2xl font-bold text-center mb-8">Connexion</h2>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <label htmlFor="auth-email" className="text-base font-medium mb-1">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Entrez votre email"
            required
          />

          <label htmlFor="auth-password" className="text-base font-medium mb-1">
            Mot de passe
          </label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Entrez votre mot de passe"
            required
          />

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-white text-black font-semibold text-lg py-3 rounded-full shadow mt-2 hover:bg-gray-100 transition"
          >
            Connexion
          </button>
        </form>

        {/* Lien inscription */}
        <section className="mt-8 text-center text-base text-black/80">
          Vous n’avez pas encore de compte ?
          <br />
          <button
            type="button"
            className="underline hover:text-black font-semibold"
            // Ici tu pourras gérer l’affichage du form d’inscription
          >
            Créez-en un
          </button>
        </section>
      </section>
    </section>
  );
}

export default AuthModal;
