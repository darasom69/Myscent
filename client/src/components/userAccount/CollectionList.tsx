import type { Perfume } from "../../context/PerfumeContext";

type Props = {
  perfumes: Perfume[];
};

function CollectionList({ perfumes }: Props) {
  if (!perfumes.length) {
    return (
      <p className="text-gray-500 text-sm mt-4">
        Aucun parfum dans cette catégorie.
      </p>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center px-4">
      {perfumes.map((perfume) => (
        <div
          key={perfume.id}
          className="bg-white p-4 rounded-lg border text-center shadow-sm"
        >
          <img
            src={perfume.image_url ?? "/default-image.png"} // Utilisation d'une image par défaut
            alt={perfume.name}
            className="h-40 mx-auto mb-2 object-contain"
          />
          <p className="font-semibold text-sm">{perfume.name}</p>
          <p className="text-xs text-gray-500">{perfume.brand_id}</p>
        </div>
      ))}
    </div>
  );
}

export default CollectionList;
