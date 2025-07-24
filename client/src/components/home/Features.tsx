import { motion } from "framer-motion";

interface Feature {
  title: string;
  description: string;
  image: string;
}

const Features: React.FC = () => {
  // Feature sections data
  const features: Feature[] = [
    {
      title: "Explorer les parfums",
      description: "Découvrez des senteurs qui vous correspondent.",
      image: "Explorer.png",
    },
    {
      title: "Faites le quizz",
      description: "Des questions simples pour un résultat personnalisé.",
      image: "Quizz.png",
    },
    {
      title: "Exprimez-vous",
      description: "Donnez votre avis et échangez avec les autres.",
      image: "Avis.png",
    },
    {
      title: "Consulter les fiches",
      description: "Accédez aux notes, familles et avis détaillés.",
      image: "Fiche.png",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="w-full py-4 md:py-8 flex flex-col items-center"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Mobile layout */}
      <div className="md:hidden">
        {features.map((feature) => (
          <motion.div
            key={feature.title} // Utilisation d'une propriété unique comme clé
            className="flex flex-col items-center mb-6 px-4 group"
            variants={item}
          >
            <motion.img
              className="w-[60px] h-[60px] object-cover mb-2"
              alt={feature.title}
              src={feature.image}
              whileHover={{
                scale: 1.2,
                rotate: 5,
                transition: { duration: 0.3 },
              }}
            />
            <div className="w-full font-normal text-xs text-center">
              <motion.h3
                className="font-bold mb-1"
                whileHover={{ scale: 1.05 }}
              >
                {feature.title}
              </motion.h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block">
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            className="flex items-center mb-8 px-4 group"
            variants={item}
          >
            <motion.img
              className="w-[75px] h-[75px] object-cover mr-4"
              alt={feature.title}
              src={feature.image}
              whileHover={{
                scale: 1.2,
                rotate: 5,
                transition: { duration: 0.3 },
              }}
            />
            <div className="w-[360px] font-normal text-xs text-center">
              <motion.h3
                className="font-bold mb-1"
                whileHover={{ scale: 1.05 }}
              >
                {feature.title}
              </motion.h3>
              <p>{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Features;
