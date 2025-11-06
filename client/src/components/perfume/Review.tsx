// src/components/reviews/Review.tsx
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";

type ReviewRow = {
  id: number;
  rating: number; // 1..5
  comment?: string | null; // backend actuel
  text?: string | null; // compat éventuelle
  user_name?: string | null; // renvoyé par le repo
  user_id?: number | null;
  review_date?: string | null;
  created_at?: string | null;
};

type Props = { perfumeId: number };

export default function Review({ perfumeId }: Props) {
  const { isAuthenticated, user, token } = useAuthContext();

  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  // slider
  const [index, setIndex] = useState(0);

  // form
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews/perfume/${perfumeId}`,
      );
      if (!res.ok) throw new Error("Erreur chargement avis");
      const data = (await res.json()) as ReviewRow[];
      setReviews(Array.isArray(data) ? data : []);
      setIndex(0);
    } catch (e) {
      console.error(e);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [perfumeId]);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    const sum = reviews.reduce((a, r) => a + (r.rating ?? 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const current = reviews[index];

  const next = () =>
    setIndex((i) => (i + 1) % Math.max(reviews.length || 1, 1));
  const prev = () =>
    setIndex(
      (i) =>
        (i - 1 + Math.max(reviews.length || 1, 1)) %
        Math.max(reviews.length || 1, 1),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      alert("Veuillez vous connecter pour laisser un avis");
      return;
    }
    if (!token) {
      alert("Session expirée. Reconnectez-vous.");
      return;
    }
    if (!newReview.trim() || rating < 1 || rating > 5) {
      alert("Renseigne une note (1–5) et un commentaire.");
      return;
    }

    try {
      const body = {
        perfume_id: perfumeId,
        user_id: user.id,
        rating,
        comment: newReview,
        text: newReview,
      };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());

      await fetchReviews();
      setShowForm(false);
      setNewReview("");
      setRating(0);
    } catch (err) {
      console.error("Erreur submit review:", err);
      alert("Impossible d’ajouter l’avis");
    }
  };

  const Stars = ({ value }: { value: number }) => {
    const v = Math.round(value);
    return (
      <div aria-label={`${v} sur 5`} className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={`star-${s}`}
            className={`h-4 w-4 ${s <= v ? "fill-black text-black" : "text-black/30"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Col gauche — titre + sous-titre */}
        <div>
          <h2 className="font-display text-2xl md:text-3xl text-[#0b0908]">
            Avis de la communauté
          </h2>
          <p className="mt-2 max-w-sm text-sm text-black/70">
            Découvrez ce que les passionnés de parfums pensent de cette création
          </p>

          {/* Moyenne (facultatif) */}
          {averageRating !== null && (
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2 text-sm">
              <Stars value={averageRating} />
              <span className="text-black/70">
                {averageRating}/5 • {reviews.length} avis
              </span>
            </div>
          )}
        </div>

        {/* Col droite — carte + pagination */}
        <div className="relative">
          <motion.div
            key={current?.id ?? "placeholder"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            className="rounded-xl border border-black/15 bg-white p-5 shadow-sm"
          >
            {/* Etoiles */}
            <div className="mb-3">
              {loading ? (
                <div className="h-4 w-24 animate-pulse rounded bg-black/10" />
              ) : current ? (
                <Stars value={current.rating ?? 0} />
              ) : (
                <div className="text-sm text-black/50">
                  Aucun avis pour le moment.
                </div>
              )}
            </div>

            {/* Commentaire */}
            <p className="text-sm text-[#0b0908]">
              {loading
                ? "Chargement…"
                : current?.comment || current?.text || "—"}
            </p>

            {/* Auteur */}
            {current && (
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-black/5 text-xs font-medium">
                  {(current.user_name?.[0] || "U").toUpperCase()}
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-[#0b0908]">
                    {current.user_name ?? "Utilisateur"}
                  </p>
                  <p className="text-black/50">Critique de parfum</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Dots + Arrows */}
          <div className="mt-4 flex items-center justify-between">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {reviews.map((review, i) => (
                <button
                  type="button"
                  key={review.id} // Use a unique identifier
                  aria-label={`Aller à l’avis ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 w-1.5 rounded-full ${
                    i === index ? "bg-black" : "bg-black/30"
                  }`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                className="rounded-md border border-black/10 p-2 hover:bg-black/5"
                aria-label="Précédent"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                className="rounded-md border border-black/10 p-2 hover:bg-black/5"
                aria-label="Suivant"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Laisser un avis (optionnel) */}
      <div className="mt-8 text-right">
        {!showForm ? (
          <motion.button
            className="text-sm underline underline-offset-4 hover:opacity-80"
            onClick={() => setShowForm(true)}
            whileHover={{ scale: 1.04 }}
          >
            Laisser un avis…
          </motion.button>
        ) : (
          <AnimatePresence>
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="mt-4 rounded-xl border border-black/15 bg-white p-4"
            >
              {/* Stars input */}
              <div className="mb-3 flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <motion.button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHoveredRating(s)}
                    onMouseLeave={() => setHoveredRating(0)}
                    whileHover={{ scale: 1.15 }}
                    aria-label={`Note ${s}`}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        (hoveredRating || rating) >= s
                          ? "fill-black text-black"
                          : "text-black/30"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>

              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Partagez votre expérience…"
                className="min-h-[90px] w-full rounded-md border border-black/15 p-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
              />

              <div className="mt-3 flex justify-end gap-2">
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setNewReview("");
                    setRating(0);
                  }}
                  className="rounded-md border border-black/20 px-3 py-1 text-sm"
                  whileHover={{ scale: 1.03 }}
                >
                  Annuler
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={
                    !newReview.trim() || rating === 0 || !isAuthenticated
                  }
                  className="rounded-md bg-black px-3 py-1 text-sm text-white disabled:opacity-50"
                  whileHover={{ scale: 1.03 }}
                >
                  Publier
                </motion.button>
              </div>
            </motion.form>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
