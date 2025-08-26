// client/src/pages/Quizz.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { type Perfume, usePerfumeContext } from "../context/PerfumeContext";

// ---- Types ----
type Option = { label: string; tags: string[] };
type Question = { id: number; text: string; options: Option[] };
type NoteRow = { type: "top" | "heart" | "base" | string; value: string };

// ---- Questions (adapte les tags aux noms EXACTS de ta BDD) ----
const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Quelle ambiance te parle le plus ?",
    options: [
      {
        label: "Un jardin fleuri au printemps",
        tags: ["rose", "jasmin", "floral"],
      },
      {
        label: "Une forêt humide après la pluie",
        tags: ["cèdre", "vétiver", "mousse", "boisé"],
      },
      {
        label: "Une plage au coucher du soleil",
        tags: ["ambre gris", "sel", "aquatique"],
      },
      {
        label: "Un marché d’épices oriental",
        tags: ["vanille", "cannelle", "ambre", "oriental"],
      },
      { label: "Une bibliothèque ancienne", tags: ["cuir", "tabac"] },
    ],
  },
  {
    id: 2,
    text: "Quel premier geste t’attire le matin ?",
    options: [
      {
        label: "Un bouquet sur la table",
        tags: ["muguet", "pivoine", "floral"],
      },
      { label: "Café corsé / bois torréfié", tags: ["café", "boisé"] },
      {
        label: "Douche fraîche vivifiante",
        tags: ["citron", "bergamote", "hespéridé", "frais"],
      },
      { label: "Thé chaud aux épices", tags: ["cardamome", "épices"] },
      { label: "Enfiler un blouson cuir", tags: ["cuir"] },
    ],
  },
  {
    id: 3,
    text: "Ta tenue de cœur ?",
    options: [
      { label: "Légère & aérienne", tags: ["pivoine", "floral"] },
      { label: "Matières brutes", tags: ["cèdre", "vétiver", "boisé"] },
      {
        label: "Linen oversize + sneakers",
        tags: ["hespéridé", "citron", "frais"],
      },
      { label: "Riche & opulent", tags: ["ambre", "vanille", "oriental"] },
      { label: "Cuir noir minimal", tags: ["cuir"] },
    ],
  },
  {
    id: 4,
    text: "Le mood d’une soirée parfaite ?",
    options: [
      { label: "Terrasse au bord de l’eau", tags: ["aquatique"] },
      { label: "Feu de camp entre amis", tags: ["encens", "boisé"] },
      { label: "Bar à cocktails épicés", tags: ["poivre", "épices"] },
      {
        label: "Cinéma & plaid cozy",
        tags: ["gourmand", "vanille", "fève tonka"],
      },
      { label: "Soirée chic & feutrée", tags: ["ambre", "oriental"] },
    ],
  },
  {
    id: 5,
    text: "Quel parfum te suit au quotidien ?",
    options: [
      {
        label: "Frais, propre, lumineux",
        tags: ["hespéridé", "citron", "frais"],
      },
      { label: "Crémeux, réconfortant", tags: ["gourmand", "vanille"] },
      { label: "Fleurs, pétales, bouquet", tags: ["rose", "jasmin", "floral"] },
      { label: "Bois, mousse, résines", tags: ["cèdre", "mousse", "boisé"] },
      {
        label: "Épices, ambre, vanille",
        tags: ["épices", "ambre", "vanille", "oriental"],
      },
    ],
  },
];

export default function Quizz() {
  const { perfumes, fetchPerfumes } = usePerfumeContext();

  const [step, setStep] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [answers, setAnswers] = useState<string[][]>(
    Array(QUESTIONS.length).fill([]),
  );

  const [loadingPerfumes, setLoadingPerfumes] = useState(false);
  const [buildingIndex, setBuildingIndex] = useState(false);
  const [scoring, setScoring] = useState(false);

  const [indexNotes, setIndexNotes] = useState<Record<number, string[]>>({}); // perfumeId -> notes(tags)
  const [results, setResults] = useState<
    (Perfume & { score: number })[] | null
  >(null);

  const total = QUESTIONS.length;
  const current = QUESTIONS[step];

  // S’assurer qu’on a les parfums
  useEffect(() => {
    const ensure = async () => {
      if (!perfumes || perfumes.length === 0) {
        setLoadingPerfumes(true);
        try {
          await fetchPerfumes();
        } finally {
          setLoadingPerfumes(false);
        }
      }
    };
    void ensure();
  }, [perfumes, fetchPerfumes]);

  // Construit l’index des notes localement en appelant /api/perfumes/:id/notes pour CHAQUE parfum
  const buildIndexIfNeeded = async () => {
    if (Object.keys(indexNotes).length > 0) return;

    setBuildingIndex(true);
    try {
      const base = import.meta.env.VITE_API_URL ?? "";
      const entries: [number, string[]][] = [];

      // Pour éviter de bombarder le serveur, on fait ça en petites séquences.
      for (const p of perfumes) {
        try {
          const res = await fetch(`${base}/api/perfumes/${p.id}/notes`);
          if (!res.ok) continue;
          const rows = (await res.json()) as NoteRow[];
          // Normaliser : on met en minuscules
          const tags = rows.map((r) => String(r.value).toLowerCase().trim());
          entries.push([p.id, Array.from(new Set(tags))]);
        } catch {
          // ignore pour ce parfum
        }
      }

      setIndexNotes(Object.fromEntries(entries));
    } finally {
      setBuildingIndex(false);
    }
  };

  // Scoring local
  const handleNext = async () => {
    if (selectedIdx === null) return;

    // Mémorise les tags pour la question courante
    const chosenTags = current.options[selectedIdx].tags.map((t) =>
      t.toLowerCase().trim(),
    );
    const tmp = [...answers];
    tmp[step] = chosenTags;
    setAnswers(tmp);
    setSelectedIdx(null);

    // Si dernière question → calcul local
    if (step === total - 1) {
      await buildIndexIfNeeded();

      // Agrège tous les tags utilisateur
      const userTags = tmp.flat().map((t) => t.toLowerCase().trim());
      const userTagSet = new Set(userTags);

      setScoring(true);
      try {
        // Score simple : +2 si note exacte match, +1 si "famille" implicite (mot-clé contenu)
        const scored: (Perfume & { score: number })[] = perfumes.map((p) => {
          const tags = indexNotes[p.id] ?? [];
          let score = 0;

          for (const tag of tags) {
            if (userTagSet.has(tag)) score += 2;
            // Petit bonus si tag utilisateur inclus dans la note (ex: "boisé" avec "cèdre")
            for (const ut of userTagSet) {
              if (tag.includes(ut) || ut.includes(tag)) {
                score += 1;
              }
            }
          }
          return { ...p, score };
        });

        // Garde ceux qui ont un score > 0, tri desc
        const top = scored
          .filter((p) => p.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 6);

        setResults(top);
      } finally {
        setScoring(false);
      }
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setSelectedIdx(null);
    setAnswers(Array(QUESTIONS.length).fill([]));
    setResults(null);
  };

  const progress = useMemo(() => {
    if (results) return 100;
    return Math.round((step / total) * 100);
  }, [results, step, total]);

  const disabled =
    loadingPerfumes || buildingIndex || scoring || selectedIdx === null;

  return (
    <div className="min-h-screen bg-[#f4efe9]">
      <div className="mx-auto max-w-4xl px-4 pt-14 pb-8 text-center">
        <h1 className="font-playfair text-3xl md:text-4xl">
          Découvre le Parfum qui vous ressemble
        </h1>

        <div className="mt-6">
          <div className="mx-auto h-[2px] w-64 bg-black/20" />
          <p className="mt-2 text-sm">
            {results ? "Résultat" : `Question ${step + 1} sur ${total}`}
          </p>
          <div className="mx-auto mt-3 h-2 w-64 rounded bg-black/10 overflow-hidden">
            <div
              className="h-full bg-black transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-16">
        <div className="rounded-2xl border border-black bg-white shadow p-6 md:p-8">
          {/* Mode questions */}
          {!results && (
            <>
              <p className="text-center text-[15px] md:text-base mb-6">
                {current.text}
              </p>

              <div className="flex flex-col gap-3">
                {current.options.map((opt, idx) => {
                  const active = selectedIdx === idx;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setSelectedIdx(idx)}
                      className={[
                        "w-full rounded-full border border-black px-5 py-2 text-sm transition",
                        active
                          ? "bg-black text-white"
                          : "bg-white hover:bg-black/5",
                      ].join(" ")}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={handleNext}
                  className={`rounded-full px-5 py-2 border border-black text-sm ${
                    disabled
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-white hover:bg-black hover:text-white"
                  }`}
                >
                  {step === total - 1
                    ? scoring
                      ? "Calcul..."
                      : "Voir le résultat"
                    : "Suivant"}
                </button>
              </div>
            </>
          )}

          {/* Mode résultats */}
          {results && (
            <>
              <h2 className="text-center text-xl font-semibold mb-2">
                Ta sélection personnalisée
              </h2>

              {results.length === 0 ? (
                <p className="text-center text-sm text-gray-600">
                  Aucun parfum ne correspond suffisamment à tes réponses.
                </p>
              ) : (
                <>
                  <p className="text-center text-sm text-gray-700 mb-6">
                    Voici les parfums qui matchent le mieux tes préférences.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {results.map((p) => (
                      <Link
                        key={p.id}
                        to={`/parfum/${p.id}`}
                        className="group border border-black rounded-lg p-3 bg-[#fffcfc] hover:-translate-y-0.5 transition shadow-sm flex flex-col items-center"
                      >
                        <div className="h-[180px] w-full border border-black bg-white flex items-center justify-center">
                          <img
                            src={p.image_url ?? "/default-perfume.png"}
                            alt={p.name}
                            className="max-h-[160px] object-contain p-2"
                          />
                        </div>
                        <div className="mt-3 text-center">
                          <div className="font-medium text-sm">{p.name}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            Score : {p.score}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="rounded-full px-4 py-2 border border-black text-sm bg-white hover:bg-black hover:text-white"
                >
                  Rejouer
                </button>
                <Link
                  to="/parfums"
                  className="rounded-full px-4 py-2 border border-black text-sm bg-white hover:bg-black hover:text-white"
                >
                  Voir tous les parfums
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
