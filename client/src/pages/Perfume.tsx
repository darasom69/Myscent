import PerfumeDetail from "../components/perfume/PerfumeDetail";
import Review from "../components/perfume/Review";

function Perfume() {
  return (
    <div className="bg-primary p-4">
      <PerfumeDetail />
      <Review perfumeId={1} />
    </div>
  );
}
export default Perfume;
