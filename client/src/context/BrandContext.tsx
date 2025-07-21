import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// -------- Typage d'une marque --------
export type Brand = {
  id: number;
  name: string;
};

// -------- Typage du contexte --------
type BrandContextType = {
  brands: Brand[];
  brandSelected: Brand | null;
  setBrandSelected: (brand: Brand | null) => void;
  fetchBrands: () => Promise<void>;
  getBrandById: (id: number) => Promise<Brand | null>;
  createBrand: (brand: Omit<Brand, "id">) => Promise<number>;
  updateBrand: (id: number, data: Partial<Brand>) => Promise<void>;
  deleteBrand: (id: number) => Promise<void>;
};

// -------- Création du contexte --------
const BrandContext = createContext<BrandContextType | undefined>(undefined);

// -------- Provider du contexte --------
export const BrandProvider = ({ children }: { children: React.ReactNode }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandSelected, setBrandSelected] = useState<Brand | null>(() => {
    const storedBrand = localStorage.getItem("brandSelected");
    return storedBrand ? JSON.parse(storedBrand) : null;
  });

  // Sauvegarde la sélection dans localStorage
  useEffect(() => {
    if (brandSelected) {
      localStorage.setItem("brandSelected", JSON.stringify(brandSelected));
    } else {
      localStorage.removeItem("brandSelected");
    }
  }, [brandSelected]);

  // -------- Récupérer toutes les marques --------
  const fetchBrands = useCallback(async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/brands`);
    const data = await res.json();
    setBrands(data);
  }, []);

  // Charger toutes les marques au montage
  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // -------- Récupérer une marque par ID --------
  const getBrandById = async (id: number): Promise<Brand | null> => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/brands/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  };

  // -------- Créer une marque --------
  const createBrand = async (newBrand: Omit<Brand, "id">): Promise<number> => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/brands`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBrand),
    });
    const data = await res.json();
    await fetchBrands();
    return data.insertId;
  };

  // -------- Modifier une marque --------
  const updateBrand = async (
    id: number,
    updateData: Partial<Brand>,
  ): Promise<void> => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/brands/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
    await fetchBrands();
  };

  // -------- Supprimer une marque --------
  const deleteBrand = async (id: number): Promise<void> => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/brands/${id}`, {
      method: "DELETE",
    });
    await fetchBrands();
  };

  return (
    <BrandContext.Provider
      value={{
        brands,
        brandSelected,
        setBrandSelected,
        fetchBrands,
        getBrandById,
        createBrand,
        updateBrand,
        deleteBrand,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

// -------- Hook personnalisé --------
export const useBrandContext = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("useBrandContext doit être utilisé dans un BrandProvider");
  }
  return context;
};
