import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";

type ReviewRow = {
  id: number;
  rating: number;
  comment?: string | null; // backend actuel
  text?: string | null; // compat éventuelle
  user_name?: string | null; // renvoyé par le repo
  user_id?: number;
  review_date?: string;
  created_at?: string;
};

type Props = {
  perfumeId: number;
};

const Review = ({ perfumeId }: Props) => {
  const { isAuthenticated, user, token } = useAuthContext();

  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews/perfume/${perfumeId}`,
      );
      if (!res.ok) throw new Error("Erreur chargement avis");
      const data = (await res.json()) as ReviewRow[];
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [perfumeId]);

  useEffect(() => {
    void fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchReviews]);

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
        user_id: user.id, // sera ignoré si le back lit req.user
        rating,
        comment: newReview, // le back attend 'comment'
        text: newReview, // compat si jamais
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ne jamais envoyer ""
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Erreur ajout avis: ${t}`);
      }

      await fetchReviews();
      setNewReview("");
      setRating(0);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur submit review:", err);
      alert("Impossible d’ajouter l’avis");
    }
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const renderStars = (value: number) => {
    const rounded = Math.round(value);
    return (
      <>
        {"★".repeat(rounded)}
        {"☆".repeat(5 - rounded)}
      </>
    );
  };

  return (
    <section className="w-full max-w-md mx-auto">
      <motion.div
        className="w-full rounded-2xl border border-black shadow bg-white overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-4">
          <h3 className="text-xl text-center mb-4">Avis</h3>

          <div className="flex justify-center items-center gap-2 mb-4">
            {averageRating !== null ? (
              <>
                <span className="text-yellow-500 text-lg">
                  {renderStars(averageRating)}
                </span>
                <span className="text-sm">
                  {averageRating}/5 ({reviews.length} avis)
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-500">
                Aucune note pour l’instant
              </span>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black" />
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((r) => {
                const content =
                  typeof r.comment !== "undefined" ? r.comment : r.text;
                return (
                  <div key={r.id} className="flex items-start mb-4">
                    <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-sm">
                      {r.user_name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                    <div className="ml-3 text-sm">
                      <p className="font-semibold">
                        {r.user_name ?? "Utilisateur"} — {r.rating}/5
                      </p>
                      {content && <p>{content}</p>}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-sm text-gray-600">
                Aucun avis pour le moment.
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* bouton / formulaire */}
      <div className="mt-4 text-right">
        {!showForm ? (
          <motion.button
            className="text-black underline text-sm"
            onClick={() => setShowForm(true)}
            whileHover={{ scale: 1.05 }}
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
              className="mt-4 bg-white p-4 rounded-lg border border-black"
            >
              <div className="flex justify-center mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <motion.button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHoveredRating(s)}
                    onMouseLeave={() => setHoveredRating(0)}
                    whileHover={{ scale: 1.2 }}
                    aria-label={`Note ${s}`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        (hoveredRating || rating) >= s
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-400"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>

              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded min-h-[80px] focus:outline-none focus:border-black"
                placeholder="Partagez votre expérience…"
              />

              <div className="flex justify-end gap-2 mt-3">
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setNewReview("");
                    setRating(0);
                  }}
                  className="px-3 py-1 border border-gray-400 rounded text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  Annuler
                </motion.button>
                <motion.button
                  type="submit"
                  className="px-3 py-1 bg-black text-white rounded text-sm"
                  whileHover={{ scale: 1.05 }}
                  disabled={
                    !newReview.trim() || rating === 0 || !isAuthenticated
                  }
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
};

export default Review;
