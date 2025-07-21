import { EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { usePerfumeContext } from "../../context/PerfumeContext";

import "swiper/css";
import "swiper/css/effect-coverflow";

function CarouselPerfumes() {
  const { perfumes } = usePerfumeContext();

  // On sélectionne les 10 premiers par exemple
  const featuredPerfumes = perfumes.slice(0, 10);

  return (
    <section className="min-h-screen bg-primary py-10">
      <h2 className="text-center text-xl font-serif mb-8">
        Découvre le Parfum qui vous ressemble
      </h2>

      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={5} //  5 visibles en même temps
        loop={true} //  boucle infinie
        spaceBetween={30} //  espace entre slides
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
      <section className="flex justify-center">
        <img src="/Socle.png" alt="Socle" className="h-50" />
      </section>
    </section>
  );
}

export default CarouselPerfumes;
