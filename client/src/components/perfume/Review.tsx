import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";

type Review = {
  id: number;
  text: string;
  rating: number;
  user?: { username?: string };
};

type ReviewSectionProps = {
  perfumeId: number;
};

const Review = ({ perfumeId }: ReviewSectionProps) => {
  const { isAuthenticated, user, token } = useAuthContext();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Charger les reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/perfumes/${perfumeId}/reviews`,
        );
        if (!res.ok) throw new Error("Erreur chargement avis");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Erreur fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [perfumeId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      alert("Veuillez vous connecter pour laisser un avis");
      return;
    }
    if (!newReview.trim() || rating === 0) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/perfumes/${perfumeId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            text: newReview,
            rating,
            userId: user.id,
          }),
        },
      );
      if (!res.ok) throw new Error("Erreur ajout avis");
      const created = await res.json();
      setReviews((prev) => [...prev, created]);
      setNewReview("");
      setRating(0);
      setShowReviewForm(false);
    } catch (err) {
      console.error("Erreur submit review:", err);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto">
      {/* Carte des reviews */}
      <motion.div
        className="w-full rounded-2xl border border-black shadow bg-white overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-4">
          <h3 className="text-xl font-playfair text-center mb-4">Avis</h3>

          {/* étoiles moyennes */}
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className="w-5 h-5 text-yellow-500 fill-yellow-500"
              />
            ))}
          </div>

          {/* Liste des avis */}
          <div className="max-h-72 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black" />
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((r) => (
                <div key={r.id} className="flex items-start mb-4">
                  <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-sm">
                    {r.user?.username?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                  <div className="ml-3 text-sm">
                    <p className="font-semibold">
                      {r.user?.username ?? "Utilisateur"}
                    </p>
                    <p>{r.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-600">
                Aucun avis pour le moment.
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Bouton pour ouvrir formulaire */}
      <div className="mt-4 text-right">
        {!showReviewForm ? (
          <motion.button
            className="text-black underline text-sm"
            onClick={() => setShowReviewForm(true)}
            whileHover={{ scale: 1.05 }}
          >
            Laisse un avis...
          </motion.button>
        ) : (
          <AnimatePresence>
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmitReview}
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
                placeholder="Partagez votre expérience..."
              >
                s
              </textarea>
              <div className="flex justify-end gap-2 mt-3">
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
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
                  disabled={!newReview.trim() || rating === 0}
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
