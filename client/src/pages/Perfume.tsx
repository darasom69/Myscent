import PerfumeDetail from "../components/perfumes/PerfumeDetail";
import Review from "../components/perfumes/Review";

function Perfume() {
  return (
    <div className="bg-primary p-4">
      <PerfumeDetail />
      <Review perfumeId={1} />
    </div>
  );
}
export default Perfume;
