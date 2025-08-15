import { useCallback, useMemo, useState } from "react";
import CollectionList from "../components/userAccount/CollectionList";
import { useAuthContext } from "../context/AuthContext";
import { useCollectionContext } from "../context/CollectionContext";
import { usePerfumeContext } from "../context/PerfumeContext";
import type { Perfume } from "../context/PerfumeContext";

const UserAccount = () => {
  const { user } = useAuthContext();
  const { ownedIds, testedIds, wishlistIds } = useCollectionContext();
  const { perfumes } = usePerfumeContext();

  const [selectedTab, setSelectedTab] = useState<
    "owned" | "tested" | "wishlist"
  >("owned");

  // Helper pour convertir une liste d'IDs -> objets Perfume depuis la liste globale
  const toPerfumeList = useCallback(
    (ids: number[]): Perfume[] => perfumes.filter((p) => ids.includes(p.id)),
    [perfumes],
  );

  const ownedPerfumes = useMemo(
    () => toPerfumeList(ownedIds),
    [toPerfumeList, ownedIds],
  );
  const testedPerfumes = useMemo(
    () => toPerfumeList(testedIds),
    [toPerfumeList, testedIds],
  );
  const wishlistPerfumes = useMemo(
    () => toPerfumeList(wishlistIds),
    [toPerfumeList, wishlistIds],
  );

  const counts = {
    owned: ownedIds.length,
    tested: testedIds.length,
    wishlist: wishlistIds.length,
  };

  if (!user) return <p>Chargement...</p>;

  // Optionnel : petit état de chargement si la liste globale n'est pas encore arrivée
  const loading = perfumes.length === 0; // PerfumeContext fetch au mount
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

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
            Possède ({counts.owned})
          </button>
          <button
            type="button"
            className={`pb-2 ${selectedTab === "tested" ? "border-b-2 border-black font-medium" : "text-gray-500"}`}
            onClick={() => setSelectedTab("tested")}
          >
            Testé ({counts.tested})
          </button>
          <button
            type="button"
            className={`pb-2 ${selectedTab === "wishlist" ? "border-b-2 border-black font-medium" : "text-gray-500"}`}
            onClick={() => setSelectedTab("wishlist")}
          >
            Wishlist ({counts.wishlist}/10)
          </button>
        </div>

        {/* Liste des parfums */}
        <div className="mt-6">
          {selectedTab === "owned" && (
            <CollectionList perfumes={ownedPerfumes} />
          )}
          {selectedTab === "tested" && (
            <CollectionList perfumes={testedPerfumes} />
          )}
          {selectedTab === "wishlist" && (
            <CollectionList perfumes={wishlistPerfumes} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
