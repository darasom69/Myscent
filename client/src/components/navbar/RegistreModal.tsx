import { UserPlus, X } from "lucide-react";
import { useState } from "react";
import { useUserContext } from "../../context/UserContext";
type RegisterModalProps = {
  onClose: () => void;
  onSwitchToLogin: () => void; // pour retourner à AuthModal
};

function RegisterModal({ onClose, onSwitchToLogin }: RegisterModalProps) {
  const { createUser } = useUserContext(); // la méthode pour créer un user
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createUser({ username, email, password, role: "user" }); // rôle par défaut
      setLoading(false);
      onClose(); // ferme la modal après inscription
    } catch (err) {
      console.error(err);
      setError("Erreur inattendue. Réessaie.");
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <section className="relative bg-[#faf6f3] rounded-xl shadow-lg w-full max-w-md p-8">
        {/* bouton fermer */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/10"
        >
          <X size={20} />
        </button>

        {/* icone */}
        <section className="flex justify-center mb-6">
          <section className="w-20 h-20 border rounded-full flex items-center justify-center">
            <UserPlus size={40} />
          </section>
        </section>

        {/* titre */}
        <h2 className="text-2xl font-bold text-center mb-8">Créer un compte</h2>

        {/* formulaire */}
        <form onSubmit={handleRegister} className="space-y-4">
          <section>
            <label htmlFor="username" className="block text-sm font-medium">
              Pseudo
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Votre pseudo"
              required
            />
          </section>

          <section>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Votre email"
              required
            />
          </section>

          <section>
            <label htmlFor="password" className="block text-sm font-medium">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Votre mot de passe"
              required
            />
          </section>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-medium py-3 rounded-full hover:bg-gray-800"
          >
            {loading ? "Inscription..." : "S’inscrire"}
          </button>
        </form>

        {/* lien pour switch vers connexion */}
        <p className="text-center text-sm mt-6">
          Déjà un compte ?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 underline"
          >
            Se connecter
          </button>
        </p>
      </section>
    </section>
  );
}

export default RegisterModal;
