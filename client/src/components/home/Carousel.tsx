import { usePerfumeContext } from "../../context/PerfumeContext";

export default function CarouselPerfumes() {
  const { perfumes } = usePerfumeContext();

  return (
    <section className="w-full bg-[#fdf8f4] py-6">
      <h2 className="text-center text-lg font-serif mb-6">
        Découvre le Parfum qui vous ressemble
      </h2>
      <div className="flex gap-6 overflow-x-auto px-6 scrollbar-hide">
        {perfumes.map((p) => (
          <div
            key={p.id}
            className="flex-shrink-0 w-32 flex flex-col items-center"
          >
            <img
              src={p.image_url ?? "/placeholder.png"}
              alt={p.name}
              className="w-24 h-24 object-contain mb-2"
            />
            <p className="text-sm text-center">{p.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
