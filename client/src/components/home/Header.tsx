import { motion } from "framer-motion";
import { Link } from "react-router";

type Props = {
  backgroundUrl?: string;
};

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay: d } },
});

export default function Header({
  backgroundUrl = "/Home.png", // change si besoin
}: Props) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "68vh" }}
      aria-label="Hero MyScent"
    >
      {/* image de fond */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url('${backgroundUrl}')` }}
      />
      {/* voile sombre léger pour le contraste, comme sur la capture */}
      <div className="absolute inset-0 bg-[#0b0908]/60" />

      {/* contenu */}
      <div className="relative mx-auto flex h-full max-w-7xl flex-col px-6 py-10 md:px-10 lg:px-12">
        {/* bloc gauche : titre + CTAs */}
        <div className="mt-10 md:mt-16 lg:mt-20 max-w-2xl">
          <motion.h1
            {...fadeUp(0)}
            className="font-display text-white text-4xl leading-[1.1] md:text-5xl lg:text-[56px]"
          >
            Plongez dans
            <br />
            l’univers des
            <br />
            parfums de niche
          </motion.h1>

          <motion.div
            {...fadeUp(0.2)}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            {/* bouton rempli blanc */}
            <Link
              to="/decouvrir"
              className="rounded-[12px] bg-white px-5 py-2 text-sm font-medium text-[#0b0908] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/70"
            >
              Découvrir
            </Link>
            {/* bouton outline clair */}
            <Link
              to="/recherche"
              className="rounded-[12px] border border-white/70 px-5 py-2 text-sm font-medium text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              Recherche
            </Link>
          </motion.div>
        </div>

        {/* texte bas droite */}
        <motion.p
          {...fadeUp(0.3)}
          className="
            mt-auto self-end max-w-lg
            text-xs md:text-sm leading-relaxed text-white/85
            text-right
          "
        >
          Découvrez des fragrances uniques qui éveillent vos sens. Chaque parfum
          est une invitation à un voyage olfactif inoubliable.
        </motion.p>
      </div>
    </section>
  );
}
