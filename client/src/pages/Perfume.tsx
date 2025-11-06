import { useParams } from "react-router";
import PerfumeDetail from "../components/perfume/PerfumeDetail";
import Review from "../components/perfume/Review";

function Perfume() {
  const { id } = useParams();
  const perfumeId = Number(id);

  if (!id || Number.isNaN(perfumeId)) {
    return (
      <div className="bg-primary p-4">
        <p>Parfum introuvable.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <PerfumeDetail />
      <Review perfumeId={perfumeId} />
    </div>
  );
}

export default Perfume;
