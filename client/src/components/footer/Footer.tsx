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

      {/* Bas de page */}
      <section className="mt-6 pt-4 text-center border-t border-black text-xs text-gray-700">
        Images utilisées uniquement à des fins pédagogiques. Ce projet n'est pas
        destiné à une diffusion publique ni commerciale.
      </section>
    </section>
  );
}

export default Footer;
