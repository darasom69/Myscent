import { motion } from "framer-motion";

function Footer() {
  return (
    <section className="bg-[url('/Fond.png')] bg-cover bg-center px-6 py-8 text-sm">
      <section className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
        {/* Bloc centre : Newsletter */}
        <section className="flex flex-col items-start max-w-md">
          <h2 className="font-semibold mb-2 text-lg">Newsletter</h2>
          <p className="mb-2">
            Abonnez-vous pour suivre notre actualité olfactive
          </p>
          <section className="w-full flex items-center border-b border-black">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-transparent outline-none py-1 text-black placeholder:text-gray-500"
            />
            <button
              type="button"
              className="ml-2 text-sm font-medium hover:underline"
            >
              OK
            </button>
          </section>
        </section>

        {/* Bloc droit : Liens */}
        <section className="flex flex-col items-start space-y-1">
          <p className="hover:underline">Mentions légales</p>
          <p className="hover:underline">Politique de confidentialité</p>
          <p className="hover:underline flex items-center">
            Contactez-nous <span className="ml-1">➔</span>
          </p>
        </section>
      </section>
      <div className="my-8 h-px bg-gray-200" />
      {/* Bas de page */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <p className="text-gray-500 text-sm leading-relaxed">
          © 2025 MyScent. Tous droits réservés.
          <br />
          Images utilisées uniquement à des fins pédagogiques. Ce projet n'est
          pas destiné à une diffusion publique ni commerciale.
        </p>
      </motion.div>
    </section>
  );
}
export default Footer;
