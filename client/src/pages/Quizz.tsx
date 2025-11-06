import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { type Perfume, usePerfumeContext } from "../context/PerfumeContext";

// ---- Types ----
type Option = { label: string; tags: string[] };
type Question = { id: number; text: string; options: Option[] };
type NoteRow = { type: string; value: string };

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
  const { perfumes = [], fetchPerfumes } = usePerfumeContext();

  const [step, setStep] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // éviter Array.fill([]) qui partage la même référence
  const emptyAnswers = useMemo(
    () => Array.from({ length: QUESTIONS.length }, () => [] as string[]),
    [],
  );
  const [answers, setAnswers] = useState<string[][]>(emptyAnswers);

  const [loadingPerfumes, setLoadingPerfumes] = useState(false);
  const [buildingIndex, setBuildingIndex] = useState(false);
  const [scoring, setScoring] = useState(false);

  const [indexNotes, setIndexNotes] = useState<Record<number, string[]>>({});
  const [results, setResults] = useState<
    (Perfume & { score: number })[] | null
  >(null);

  const total = QUESTIONS.length;
  const current = QUESTIONS[step];

  // fetch parfums si nécessaire
  useEffect(() => {
    const run = async () => {
      if (perfumes.length === 0) {
        setLoadingPerfumes(true);
        try {
          await fetchPerfumes();
        } finally {
          setLoadingPerfumes(false);
        }
      }
    };
    run();
  }, [perfumes.length, fetchPerfumes]);

  // construit l’index des notes (/api/perfumes/:id/notes)
  const buildIndexIfNeeded = useCallback(async () => {
    if (Object.keys(indexNotes).length > 0) return;

    setBuildingIndex(true);
    try {
      const base = import.meta.env.VITE_API_URL ?? "";
      const entries: [number, string[]][] = [];

      for (const p of perfumes) {
        try {
          const res = await fetch(`${base}/api/perfumes/${p.id}/notes`);
          if (!res.ok) continue;
          const rows = (await res.json()) as NoteRow[];
          const tags = rows.map((r) => String(r.value).toLowerCase().trim());
          entries.push([p.id, Array.from(new Set(tags))]);
        } catch {
          // ignore erreur par parfum
        }
      }
      setIndexNotes(Object.fromEntries(entries));
    } finally {
      setBuildingIndex(false);
    }
  }, [indexNotes, perfumes]);

  // navigation + scoring
  const handleNext = useCallback(async () => {
    if (selectedIdx === null) return;

    const chosenTags = current.options[selectedIdx].tags.map((t) =>
      t.toLowerCase().trim(),
    );

    setAnswers((prev) => prev.map((a, i) => (i === step ? chosenTags : a)));
    setSelectedIdx(null);

    const isLast = step === total - 1;

    if (isLast) {
      await buildIndexIfNeeded();

      const userTags = [
        ...answers.slice(0, step),
        chosenTags,
        ...answers.slice(step + 1),
      ]
        .flat()
        .map((t) => t.toLowerCase().trim());

      const userTagSet = new Set(userTags);

      setScoring(true);
      try {
        const scored: (Perfume & { score: number })[] = perfumes.map((p) => {
          const tags = indexNotes[p.id] ?? [];
          let score = 0;
          for (const tag of tags) {
            if (userTagSet.has(tag)) score += 2;
            for (const ut of userTagSet) {
              if (tag.includes(ut) || ut.includes(tag)) score += 1;
            }
          }
          return { ...p, score };
        });

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
  }, [
    selectedIdx,
    current,
    step,
    total,
    buildIndexIfNeeded,
    perfumes,
    indexNotes,
    answers,
  ]);

  // Enter = Suivant / Résultat
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (!results) {
          void handleNext();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleNext, results]);

  const handleRestart = () => {
    setStep(0);
    setSelectedIdx(null);
    setAnswers(Array.from({ length: QUESTIONS.length }, () => [] as string[]));
    setResults(null);
  };

  const progress = useMemo(
    () => (results ? 100 : Math.round((step / total) * 100)),
    [results, step, total],
  );

  const disabled =
    loadingPerfumes || buildingIndex || scoring || selectedIdx === null;

  return (
    <div className="min-h-screen bg-[#f4efe9]">
      {/* header + progress */}
      <div className="mx-auto max-w-3xl px-6 pt-12 pb-8 text-center">
        <h1 className="font-display text-[28px] md:text-[36px] leading-tight text-[#0b0908]">
          Découvre le parfum qui vous ressemble
        </h1>
        <p className="mt-2 text-sm text-black/70">
          Répondez à quelques questions
        </p>

        {/* ligne + points */}
        <div className="mt-6 mx-auto flex w-64 items-center justify-between">
          {QUESTIONS.map((q, idx) => (
            <span
              key={q.id} // ✅ clé stable (pas l'index)
              className={`h-2 w-2 rounded-full ${idx <= step || results ? "bg-black" : "bg-black/25"}`}
            />
          ))}
        </div>

        {/* bar progress fine */}
        <div className="mx-auto mt-3 h-1 w-64 overflow-hidden rounded bg-black/10">
          <div
            className="h-full bg-black transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-black/60">
          {results ? "Résultat" : `Question ${step + 1} sur ${total}`}
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-16">
        <div className="rounded-2xl border border-black/15 bg-white shadow-sm p-6 md:p-8">
          {/* --- Mode Questions --- */}
          {!results && (
            <>
              <p className="mb-6 text-center text-[15px] md:text-base text-[#0b0908]">
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
                        "w-full rounded-full border px-5 py-2 text-sm transition",
                        active
                          ? "border-black bg-black text-white"
                          : "border-black/30 bg-white hover:bg-black/5",
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
                  className={`rounded-full px-5 py-2 text-sm transition ${
                    disabled
                      ? "cursor-not-allowed bg-gray-200 text-gray-500"
                      : "bg-[#c9b3a2] text-[#2b1f18] hover:brightness-95"
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

          {/* --- Mode Résultats --- */}
          {results && (
            <>
              <h2 className="mb-2 text-center text-xl font-semibold text-[#0b0908]">
                Ton parfum signature révélé
              </h2>
              {results.length === 0 ? (
                <p className="text-center text-sm text-gray-600">
                  Aucun parfum ne correspond suffisamment à tes réponses.
                </p>
              ) : (
                <>
                  <p className="mb-6 text-center text-sm text-gray-700">
                    Voici les parfums qui matchent le mieux tes préférences.
                  </p>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {results.map((p) => (
                      <Link
                        key={p.id}
                        to={`/parfum/${p.id}`}
                        className="group flex flex-col items-center rounded-lg border border-black/15 bg-[#fffcfc] p-3 shadow-sm transition hover:-translate-y-0.5"
                      >
                        <div className="flex h-[180px] w-full items-center justify-center rounded border border-black/10 bg-white">
                          <img
                            src={p.image_url ?? "/default-perfume.png"}
                            alt={p.name}
                            className="max-h-[160px] p-2 object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        </div>
                        <div className="mt-3 text-center">
                          <div className="text-sm font-medium text-[#0b0908]">
                            {p.name}
                          </div>
                          <div className="mt-1 text-xs text-gray-600">
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
                  className="rounded-full border border-black px-4 py-2 text-sm bg-white hover:bg-black hover:text-white"
                >
                  Rejouer
                </button>
                <Link
                  to="/parfums"
                  className="rounded-full border border-black px-4 py-2 text-sm bg-white hover:bg-black hover:text-white"
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
