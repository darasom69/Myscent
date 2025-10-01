import { motion } from "framer-motion";
// src/components/home/FeaturesUniverse.tsx
import type { JSX } from "react";

type Features = {
  title: string;
  description: string;
  img: string; // chemin de ton illustration (SVG/PNG)
  alt: string;
};

const items: Features[] = [
  {
    title: "Explorer les parfums",
    description: "Découvrez des senteurs qui vous correspondent.",
    img: "/Explorer.png",
    alt: "Explorer les parfums",
  },
  {
    title: "Exprimez-vous",
    description: "Donnez votre avis et échangez avec les autres.",
    img: "/Avis.png",
    alt: "Exprimez-vous",
  },
  {
    title: "Faites le quizz",
    description: "Des questions simples pour un résultat personnalisé.",
    img: "/Quizz.png",
    alt: "Faites le quizz",
  },
  {
    title: "Consulter les fiches",
    description: "Accédez aux notes, familles et avis détaillés.",
    img: "/Fiche.png",
    alt: "Consulter les fiches",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.08 },
  },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function FeaturesUniverse(): JSX.Element {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        {/* Titre */}
        <h2 className="text-center font-display text-2xl md:text-3xl text-[#070605]">
          Notre univers olfactif
        </h2>

        {/* Grille de features */}
        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Fonctionnalités MyScent"
        >
          {items.map(({ title, description, img, alt }) => (
            <motion.li key={title} variants={item} className="text-center">
              <div className="mx-auto h-28 w-28 md:h-32 md:w-32">
                <img
                  src={img}
                  alt={alt}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>

              <h3 className="mt-5 font-display text-lg text-[#070605]">
                {title}
              </h3>

              <p className="mx-auto mt-2 max-w-[22ch] text-sm leading-relaxed text-neutral-600">
                {description}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
