import BrandInfo from "../components/home/BrandInfo";
import Carousel from "../components/home/Carousel";
import Features from "../components/home/Features";
import SearchBar from "../components/home/SearchBar";

function Home() {
  return (
    <div className="bg-primary">
      <SearchBar />
      <Carousel />
      <div className="flex flex-col items-center justify-start">
        <BrandInfo />
      </div>
      <Features />
    </div>
  );
}

export default Home;
