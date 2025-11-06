// src/components/common/NewsletterBanner.tsx
import type { JSX } from "react";
import { useState } from "react";

export default function NewsletterBanner(): JSX.Element {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await new Promise((r) => setTimeout(r, 600)); // demo
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-2xl border border-black/10 bg-[#f5f5f4] px-6 py-10 text-center shadow-sm">
        <h3 className="font-display text-2xl text-[#0b0908]">Restez informé</h3>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-[#2d261f]/80">
          Recevez nos dernières découvertes et offres exclusives directement
          dans votre boîte de réception.
        </p>
        {status !== "ok" ? (
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-5 flex w-full max-w-md items-center gap-2"
            noValidate
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Votre email
            </label>
            <div className="relative flex-1">
              <input
                id="newsletter-email"
                type="email"
                inputMode="email"
                required
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-[#0b0908] placeholder:text-black/40 outline-none focus:ring-2 focus:ring-[#c9b3a2]"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-full bg-[#c9b3a2] px-4 py-2 text-sm font-medium text-[#2b1f18] hover:brightness-95"
            >
              S'inscrire
            </button>
          </form>
        ) : (
          <p className="mt-5 text-sm text-green-600">
            Merci pour votre inscription !
          </p>
        )}
      </div>
    </section>
  );
}
