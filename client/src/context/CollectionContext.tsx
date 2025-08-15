import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthContext } from "./AuthContext";

export type Status = "owned" | "tested" | "wishlist";

type CollectionContextType = {
  ownedIds: number[];
  testedIds: number[];
  wishlistIds: number[];
  fetchCollection: () => Promise<void>;
  addToCollection: (perfumeId: number, status: Status) => Promise<void>;
  removeFromCollection: (perfumeId: number) => Promise<void>;
};

type Perfume = {
  id: number;
};

const CollectionContext = createContext<CollectionContextType | undefined>(
  undefined,
);

export const CollectionProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const { user, token, isAuthenticated } = useAuthContext();
  const [ownedIds, setOwnedIds] = useState<number[]>([]);
  const [testedIds, setTestedIds] = useState<number[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  const fetchCollection = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    const statuses: Status[] = ["owned", "tested", "wishlist"];
    const newData: Record<Status, number[]> = {
      owned: [],
      tested: [],
      wishlist: [],
    };

    for (const status of statuses) {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${user.id}/collection?type=${status}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data: Perfume[] = await res.json(); // Specify the type of the data
        newData[status] = data.map((p) => p.id); // Use the Perfume type
      }
    }

    setOwnedIds(newData.owned);
    setTestedIds(newData.tested);
    setWishlistIds(newData.wishlist);
  }, [isAuthenticated, user, token]);

  const addToCollection = async (perfumeId: number, status: Status) => {
    if (!user) return;

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/${user.id}/collection`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ perfumeId, status }),
      },
    );

    if (res.ok) {
      await fetchCollection();
    }
  };

  const removeFromCollection = async (perfumeId: number) => {
    if (!user) return;

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/${user.id}/collection/${perfumeId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (res.ok) {
      await fetchCollection();
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  return (
    <CollectionContext.Provider
      value={{
        ownedIds,
        testedIds,
        wishlistIds,
        fetchCollection,
        addToCollection,
        removeFromCollection,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollectionContext = () => {
  const context = useContext(CollectionContext);
  if (!context)
    throw new Error(
      "useCollectionContext doit être utilisé dans un CollectionProvider",
    );
  return context;
};
