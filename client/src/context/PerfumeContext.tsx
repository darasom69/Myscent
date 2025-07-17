import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// -------- Typage d'un parfum --------
export type Perfume = {
  id: number;
  name: string;
  brand_id: number;
  release_year: number;
  gender_id: number;
  image_url?: string | null;
  description?: string | null;
};

// -------- Typage du contexte --------
type PerfumeContextType = {
  perfumes: Perfume[];
  perfumeSelected: Perfume | null;
  setPerfumeSelected: (perfume: Perfume | null) => void;
  fetchPerfumes: () => Promise<void>;
  getPerfumeById: (id: number) => Promise<Perfume | null>;
  createPerfume: (perfume: Omit<Perfume, "id">) => Promise<number>;
  updatePerfume: (id: number, data: Partial<Perfume>) => Promise<void>;
  deletePerfume: (id: number) => Promise<void>;
};

// -------- Création du contexte --------
const PerfumeContext = createContext<PerfumeContextType | undefined>(undefined);

// -------- Provider du contexte --------
export const PerfumeProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [perfumeSelected, setPerfumeSelected] = useState<Perfume | null>(() => {
    const storedPerfume = localStorage.getItem("perfumeSelected");
    return storedPerfume ? JSON.parse(storedPerfume) : null;
  });

  // Sauvegarder dans le localStorage
  useEffect(() => {
    if (perfumeSelected) {
      localStorage.setItem("perfumeSelected", JSON.stringify(perfumeSelected));
    } else {
      localStorage.removeItem("perfumeSelected");
    }
  }, [perfumeSelected]);

  // Charger tous les parfums au montage
  useEffect(() => {
    fetchPerfumes();
  }, []);

  // -------- Méthode pour récupérer tous les parfums --------
  const fetchPerfumes = useCallback(async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/perfumes`);
    const data = await res.json();
    setPerfumes(data);
  }, []);

  // -------- Méthode pour récupérer un parfum par ID --------
  const getPerfumeById = async (id: number): Promise<Perfume | null> => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/perfumes/${id}`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  };

  // -------- Méthode pour créer un parfum --------
  const createPerfume = async (
    newPerfume: Omit<Perfume, "id">,
  ): Promise<number> => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/perfumes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPerfume),
    });
    const data = await res.json();
    await fetchPerfumes();
    return data.insertId;
  };

  // -------- Méthode pour modifier un parfum --------
  const updatePerfume = async (
    id: number,
    updateData: Partial<Perfume>,
  ): Promise<void> => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/perfumes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
    await fetchPerfumes();
  };

  // -------- Méthode pour supprimer un parfum --------
  const deletePerfume = async (id: number): Promise<void> => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/perfumes/${id}`, {
      method: "DELETE",
    });
    await fetchPerfumes();
  };

  return (
    <PerfumeContext.Provider
      value={{
        perfumes,
        perfumeSelected,
        setPerfumeSelected,
        fetchPerfumes,
        getPerfumeById,
        createPerfume,
        updatePerfume,
        deletePerfume,
      }}
    >
      {children}
    </PerfumeContext.Provider>
  );
};

// -------- Hook personnalisé --------
export const usePerfumeContext = () => {
  const context = useContext(PerfumeContext);
  if (!context) {
    throw new Error(
      "usePerfumeContext doit être utilisé dans un PerfumeProvider",
    );
  }
  return context;
};
