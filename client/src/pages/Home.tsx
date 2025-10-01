import Features from "../components/home/Features";
import Header from "../components/home/Header";
import PerfumesMoment from "../components/home/PerfumesMoment";

function Home() {
  return (
    <div className="bg-primary">
      <Header />
      <div className="flex flex-col items-center justify-start">
        <PerfumesMoment />
      </div>
      <Features />
    </div>
  );
}

export default Home;
