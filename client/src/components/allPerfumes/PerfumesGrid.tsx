import type { Perfume } from "../../context/PerfumeContext";
import PerfumeCard from "./PerfumesCard";

interface PerfumesGridProps {
  perfumes: Perfume[];
  onSelect: (id: number) => void;
}

export default function PerfumesGrid({
  perfumes,
  onSelect,
}: PerfumesGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {perfumes.map((p) => (
        <PerfumeCard key={p.id} perfume={p} onClick={() => onSelect(p.id)} />
      ))}
    </div>
  );
}
