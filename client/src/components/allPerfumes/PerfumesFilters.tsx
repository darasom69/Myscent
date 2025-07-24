interface PerfumesFiltersProps {
  search: string;
  setSearch: (v: string) => void;
}

export default function PerfumesFilters({
  search,
  setSearch,
}: PerfumesFiltersProps) {
  return (
    <div className="flex justify-center mb-8">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un parfum…"
        className="w-full md:w-[400px] border border-black rounded-md px-4 py-2 text-sm"
      />
    </div>
  );
}
