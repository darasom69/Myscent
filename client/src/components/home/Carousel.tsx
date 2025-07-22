import { EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { usePerfumeContext } from "../../context/PerfumeContext";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

function Carousel() {
  const { perfumes, setPerfumeSelected } = usePerfumeContext();

  // On sélectionne par exemple les 10 premiers
  const featuredPerfumes = perfumes.filter(
    (p) => [49, 26, 2, 58, 33, 5, 56, 1, 17, 25, 57].includes(p.id), // exemple : liste précise d'IDs
  );

  return (
    <section className="bg-primary py-10">
      <h2 className="text-center text-xl font-serif mb-8">
        Découvre le Parfum qui vous ressemble
      </h2>

      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={5}
        loop={true}
        spaceBetween={30}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 200,
          modifier: 2.5,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow]}
        className="mySwiper"
        // À chaque changement de slide on met à jour perfumeSelected
        onSlideChange={(swiper) => {
          const currentIndex = swiper.realIndex; // index du slide actuel
          setPerfumeSelected(featuredPerfumes[currentIndex]);
        }}
      >
        {featuredPerfumes.map((p) => (
          <SwiperSlide key={p.id} className="flex flex-col items-center">
            <img
              src={p.image_url ?? "/placeholder.png"}
              alt={p.name}
              className="w-32 h-32 object-contain"
            />
            <p className="mt-2 text-center text-sm">{p.name}</p>
          </SwiperSlide>
        ))}
      </Swiper>

      <section className="flex justify-center mt-6">
        <img src="/Socle.png" alt="socle" className="h-50" />
      </section>
    </section>
  );
}

export default Carousel;
