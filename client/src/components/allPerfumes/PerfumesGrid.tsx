import type { Perfume } from "../../context/PerfumeContext";
import PerfumeCard from "./PerfumesCard";

interface PerfumesGridProps {
  perfumes: Perfume[];
  onSelect: (id: number | string) => void;
}

export default function PerfumesGrid({
  perfumes,
  onSelect,
}: PerfumesGridProps) {
  if (!perfumes || perfumes.length === 0) {
    return (
      <p className="col-span-full text-center text-sm text-neutral-500">
        Aucun parfum trouvé.
      </p>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-2 gap-x-8 gap-y-16
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
      "
    >
      {perfumes.map((p) => (
        <PerfumeCard key={p.id} perfume={p} onClick={() => onSelect(p.id)} />
      ))}
    </div>
  );
}
