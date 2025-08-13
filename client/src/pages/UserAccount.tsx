import { useEffect, useState } from "react";
import CollectionList from "../components/userAccount/CollectionList";
import { useAuthContext } from "../context/AuthContext";
import type { Perfume } from "../context/PerfumeContext";

const UserAccount = () => {
  const { user } = useAuthContext();
  const [owned, setOwned] = useState<Perfume[]>([]);
  const [tested, setTested] = useState<Perfume[]>([]);
  const [wishlist, setWishlist] = useState<Perfume[]>([]);
  const [selectedTab, setSelectedTab] = useState<
    "owned" | "tested" | "wishlist"
  >("owned");

  useEffect(() => {
    const fetchCollection = async (type: "owned" | "tested" | "wishlist") => {
      try {
        const res = await fetch(
          `/api/users/${user?.id}/collection?type=${type}`,
        );
        const data = await res.json();
        if (type === "owned") setOwned(data);
        else if (type === "tested") setTested(data);
        else setWishlist(data);
      } catch (error) {
        console.error("Erreur de chargement de la collection:", error);
      }
    };

    if (user) {
      fetchCollection("owned");
      fetchCollection("tested");
      fetchCollection("wishlist");
    }
  }, [user]);

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="min-h-screen bg-[#f8f3ef] px-4 py-8 text-center">
      {/* Profil */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-24 h-24 rounded-full border border-gray-400 flex items-center justify-center text-4xl">
          👤
        </div>
        <p className="text-xl font-semibold uppercase">{user.username}</p>
        <button
          type="button"
          className="mt-2 px-4 py-1 border rounded text-sm hover:bg-gray-100"
        >
          Modifier mon profil
        </button>
      </div>

      {/* Infos */}
      <div className="mt-6 text-left max-w-md mx-auto">
        <h2 className="font-semibold mb-2">MES INFORMATIONS</h2>
        <p>
          <strong>Nom :</strong> {user.username}
        </p>
        <p>
          <strong>Email :</strong> {user.email}
        </p>
        <p>
          <strong>Mot de passe :</strong>{" "}
          <span className="text-blue-600 underline cursor-pointer">
            Modifier
          </span>
        </p>
      </div>

      {/* Collection */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">MA COLLECTION</h2>

        {/* Onglets */}
        <div className="flex justify-center gap-6 text-sm border-b max-w-xs mx-auto">
          <button
            type="button"
            className={`pb-2 ${selectedTab === "owned" ? "border-b-2 border-black font-medium" : "text-gray-500"}`}
            onClick={() => setSelectedTab("owned")}
          >
            Possède
          </button>
          <button
            type="button"
            className={`pb-2 ${selectedTab === "tested" ? "border-b-2 border-black font-medium" : "text-gray-500"}`}
            onClick={() => setSelectedTab("tested")}
          >
            Testé
          </button>
          <button
            type="button"
            className={`pb-2 ${selectedTab === "wishlist" ? "border-b-2 border-black font-medium" : "text-gray-500"}`}
            onClick={() => setSelectedTab("wishlist")}
          >
            Wishlist
          </button>
        </div>

        {/* Liste des parfums */}
        <div className="mt-6">
          {selectedTab === "owned" && <CollectionList perfumes={owned} />}
          {selectedTab === "tested" && <CollectionList perfumes={tested} />}
          {selectedTab === "wishlist" && <CollectionList perfumes={wishlist} />}
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
