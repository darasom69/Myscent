import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../context/AuthContext";
import { useUserContext } from "../context/UserContext";

type Tab = "users" | "perfumes" | "reviews" | "stats" | "settings";

/* ---------- Modale réutilisable ---------- */
function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-lg border border-black">
        <div className="flex items-center justify-between px-4 py-3 border-b border-black">
          <h3 className="font-semibold">{title}</h3>
          <button type="button" className="text-sm underline" onClick={onClose}>
            Fermer
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Formulaire utilisateur (création/édition) ---------- */
function UserForm({
  mode,
  defaults,
  onSubmit,
  submitting,
}: {
  mode: "create" | "edit";
  defaults?: {
    username?: string;
    email?: string;
    role?: "user" | "admin";
  };
  submitting?: boolean;
  onSubmit: (data: {
    username: string;
    email: string;
    password?: string;
    role: "user" | "admin";
  }) => Promise<void>;
}) {
  const [username, setUsername] = useState(defaults?.username ?? "");
  const [email, setEmail] = useState(defaults?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">(defaults?.role ?? "user");

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit({
          username,
          email,
          password: password || undefined,
          role,
        });
      }}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-sm">
          Nom
        </label>
        <input
          id="username"
          className="border border-black rounded px-2 py-1"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="border border-black rounded px-2 py-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {mode === "create" && (
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            className="border border-black rounded px-2 py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="role" className="text-sm">
          Rôle
        </label>
        <select
          id="role"
          className="border border-black rounded px-2 py-1"
          value={role}
          onChange={(e) => setRole(e.target.value as "user" | "admin")}
        >
          <option value="user">Utilisateur</option>
          <option value="admin">Administrateur</option>
        </select>
      </div>

      <div className="pt-2 flex justify-end gap-2">
        <button
          type="submit"
          disabled={submitting}
          className={`border border-black rounded px-3 py-1 text-sm ${
            submitting
              ? "opacity-60 cursor-not-allowed"
              : "bg-white hover:bg-black hover:text-white"
          }`}
        >
          {mode === "create" ? "Créer" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

/* ---------- Tableau des utilisateurs ---------- */
function UsersTab() {
  const { users, fetchUsers, deleteUser, updateUser, createUser } =
    useUserContext();

  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const editingUser = useMemo(
    () => users.find((u) => u.id === editingId),
    [users, editingId],
  );

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        await fetchUsers();
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [fetchUsers]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Gestion des utilisateurs</h2>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="border border-black rounded px-3 py-1 text-sm bg-white hover:bg-black hover:text-white"
        >
          Ajouter
        </button>
      </div>

      <div className="rounded-lg border border-black bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b border-black">
            <tr className="[&>th]:text-left [&>th]:px-3 [&>th]:py-2">
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th className="w-32">Action</th>
            </tr>
          </thead>
        </table>
        <div className="max-h-[420px] overflow-y-auto">
          <table className="w-full text-sm">
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-3 py-4 text-center" colSpan={4}>
                    Chargement…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-center" colSpan={4}>
                    Aucun utilisateur.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-black/20 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2">{u.username}</td>
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2">{u.role}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(u.id)}
                          className="text-xs underline"
                        >
                          Éditer
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (
                              window.confirm(
                                `Supprimer l’utilisateur “${u.username}” ?`,
                              )
                            ) {
                              await deleteUser(u.id);
                            }
                          }}
                          className="text-xs text-red-600 underline"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modale création */}
      {showCreate && (
        <Modal
          title="Ajouter un utilisateur"
          onClose={() => setShowCreate(false)}
        >
          <UserForm
            mode="create"
            onSubmit={async (data) => {
              await createUser({
                username: data.username,
                email: data.email,
                password: data.password ?? "",
                role: data.role,
              });
              setShowCreate(false);
            }}
          />
        </Modal>
      )}

      {/* Modale édition */}
      {editingUser && (
        <Modal
          title={`Éditer ${editingUser.username}`}
          onClose={() => setEditingId(null)}
        >
          <UserForm
            mode="edit"
            defaults={{
              username: editingUser.username,
              email: editingUser.email,
              role: editingUser.role,
            }}
            onSubmit={async (data) => {
              await updateUser(editingUser.id, {
                username: data.username,
                email: data.email,
                role: data.role,
              });
              setEditingId(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

/* ---------- Page Admin principale ---------- */
export default function Admin() {
  const { isAuthenticated, user } = useAuthContext();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("users");

  useEffect(() => {
    // Garde simple côté front : on dégage si pas admin
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-[#f4efe9]">
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-16">
        <h1 className="text-3xl font-playfair text-center mb-10">
          Administrateur
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[220px,1fr] gap-6">
          {/* Sidebar */}
          <aside className="md:sticky md:top-8 h-max">
            <div className="rounded-lg border border-black bg-white shadow-sm p-3">
              <nav className="flex md:flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setTab("users")}
                  className={`w-full text-left px-3 py-2 rounded border ${
                    tab === "users"
                      ? "bg-black text-white border-black"
                      : "bg-white border-black hover:bg-black/5"
                  }`}
                >
                  👤 Gestion des utilisateurs
                </button>
                <button
                  type="button"
                  onClick={() => setTab("perfumes")}
                  className={`w-full text-left px-3 py-2 rounded border ${
                    tab === "perfumes"
                      ? "bg-black text-white border-black"
                      : "bg-white border-black hover:bg-black/5"
                  }`}
                >
                  🌸 Gestion des parfums
                </button>
                <button
                  type="button"
                  onClick={() => setTab("reviews")}
                  className={`w-full text-left px-3 py-2 rounded border ${
                    tab === "reviews"
                      ? "bg-black text-white border-black"
                      : "bg-white border-black hover:bg-black/5"
                  }`}
                >
                  ⭐ Gestion des avis
                </button>
                <button
                  type="button"
                  onClick={() => setTab("stats")}
                  className={`w-full text-left px-3 py-2 rounded border ${
                    tab === "stats"
                      ? "bg-black text-white border-black"
                      : "bg-white border-black hover:bg-black/5"
                  }`}
                >
                  📊 Statistiques
                </button>
                <button
                  type="button"
                  onClick={() => setTab("settings")}
                  className={`w-full text-left px-3 py-2 rounded border ${
                    tab === "settings"
                      ? "bg-black text-white border-black"
                      : "bg-white border-black hover:bg-black/5"
                  }`}
                >
                  ⚙️ Paramètres
                </button>
              </nav>
            </div>
          </aside>

          {/* Contenu */}
          <main>
            {tab === "users" && <UsersTab />}

            {tab !== "users" && (
              <div className="rounded-lg border border-black bg-white shadow-sm p-6">
                {tab === "perfumes" && (
                  <p className="text-sm">
                    👉 Ici, tu pourras réutiliser ton{" "}
                    <strong>PerfumeContext</strong> pour lister / créer / éditer
                    / supprimer des parfums (même pattern que “Utilisateurs”).
                  </p>
                )}
                {tab === "reviews" && (
                  <p className="text-sm">
                    👉 Ici, liste des avis, modération (supprimer, éditer), tri
                    par parfum / utilisateur.
                  </p>
                )}
                {tab === "stats" && (
                  <p className="text-sm">
                    👉 Ici, affiche quelques stats (nb de parfums, nb d’avis,
                    top marques…). Tu pourras commencer simple avec des
                    compteurs côté front.
                  </p>
                )}
                {tab === "settings" && (
                  <p className="text-sm">
                    👉 Paramètres généraux (logo, couleurs, messages, etc.).
                  </p>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
