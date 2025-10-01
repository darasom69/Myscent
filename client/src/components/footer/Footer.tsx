import { motion } from "framer-motion";
import { ArrowRight, Facebook, Instagram, Twitter } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export const Footer = (): React.ReactElement => {
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();

  const socialLinks = [
    {
      Icon: Facebook,
      name: "Facebook",
      href: "https://www.facebook.com/yourpage",
      label: "Ouvrir Facebook (nouvelle fenêtre)",
    },
    {
      Icon: Instagram,
      name: "Instagram",
      href: "https://www.instagram.com/yourpage",
      label: "Ouvrir Instagram (nouvelle fenêtre)",
    },
    {
      Icon: Twitter, // libellé X mais icône Twitter lucide-react
      name: "X",
      href: "https://x.com/yourpage",
      label: "Ouvrir X (nouvelle fenêtre)",
    },
  ];

  const footerLinks = [
    { label: "Politique de confidentialité", to: "/legal/confidentialite" },
    { label: "Mentions légales", to: "/legal/mentions-legales" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: appel API d'abonnement (ex: /api/newsletter)
    // toast.success("Merci ! Vous êtes abonné(e).");
    setEmail("");
  };

  return (
    <footer className="w-full text-neutral-900 bg-cover bg-center">
      <div className="mx-auto w-full max-w-screen-xl px-6 py-16 md:px-8 lg:px-10">
        {/* top grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* brand + newsletter */}
          <div className="md:col-span-6">
            <div className="h-9 w-24">
              <img
                src="/Myscent.png"
                alt="Myscent"
                className="h-9 w-20 object-contain"
              />
            </div>

            <h2 className="mt-6 font-display text-xl font-semibold">
              Newsletter
            </h2>
            <p className="mt-2 max-w-prose font-sans text-base leading-relaxed text-neutral-800">
              Abonnez-vous pour suivre notre actualité olfactive.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3" noValidate>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Adresse e-mail
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  inputMode="email"
                  placeholder="Entrez votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-required="true"
                  className="w-full rounded-lg border border-neutral-300 bg-white/70 px-3 py-2 text-sm placeholder:text-neutral-500 backdrop-blur focus:outline-none focus:ring-2 focus:ring-accent sm:flex-1"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  S’abonner
                </button>
              </div>

              <p className="text-xs text-neutral-700">
                En vous abonnant, vous acceptez notre{" "}
                <Link
                  to="/legal/confidentialite"
                  className="underline underline-offset-2 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  Politique de confidentialité
                </Link>
                .
              </p>
            </form>
          </div>

          {/* liens & social */}
          <div className="md:col-span-6 grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-lg font-semibold">Contact</h3>
              <nav className="mt-2 space-y-2 text-sm">
                <a
                  href="mailto:contact@myscent.app"
                  className="hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  contact@myscent.app
                </a>
                <p className="text-neutral-600">Paris, France</p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1 hover:underline focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  Contactez-nous <ArrowRight className="h-4 w-4" />
                </Link>
              </nav>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold">
                Suivez-nous
              </h3>
              <nav className="mt-2 flex flex-col">
                {socialLinks.map(({ Icon, name, href, label }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-3 py-2 text-sm transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                    <span>{name}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* separator */}
        <div className="my-10 h-px w-full bg-black/10" />

        {/* bottom legal */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex flex-col items-start justify-between gap-6 sm:flex-row"
        >
          <p className="max-w-lg text-sm text-neutral-800">
            © {year} Myscent.
            <br />
            Images utilisées uniquement à des fins pédagogiques. Ce projet n’est
            pas destiné à une diffusion publique ni commerciale.
          </p>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="underline underline-offset-2 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
