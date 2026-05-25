"use client";

import { useMemo, useState } from "react";

type Article = {
  id: number;
  headline: string;
  content: string;
  importance_score: number;

  tags: {
    items: string[];
  };

  questions: {
    items: string[];
  };

  jargon_explained: {
    items: string[];
  };

  created_at: string;
};

export default function Dashboard({
  articles,
}: {
  articles: Article[];
}) {
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
const [minImportance, setMinImportance] = useState(0);
const [expandedId, setExpandedId] = useState<number | null>(null);
   const allTags = articles.flatMap(
  (article) => article.tags?.items || []
);

const tagFrequency = allTags.reduce(
  (acc: Record<string, number>, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  },
  {}
);

const topTopic =
  Object.entries(tagFrequency).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] || "None";
 const sortedTopics = Object.entries(
  tagFrequency
).sort((a, b) => b[1] - a[1]);

const highestImportance =
  Math.max(
    ...articles.map(
      (a) => a.importance_score || 0
    )
  ) || 0;
  const filteredArticles = useMemo(() => {
  return articles.filter((article: any) => {
    const searchLower = search.toLowerCase();

    const matchesSearch =
      article.headline.toLowerCase().includes(searchLower) ||
      article.content.toLowerCase().includes(searchLower);

    const matchesImportance =
      article.importance_score >= minImportance;

    const articleMonth = new Date(
      article.created_at
    ).toLocaleString("default", {
      month: "long",
    });

    const matchesMonth =
      selectedMonth === "All" ||
      articleMonth === selectedMonth;
     
     const articleDate = new Date(
  article.created_at
)
  .toISOString()
  .split("T")[0];

const matchesDate =
  selectedDate === "" ||
  articleDate === selectedDate; 

    return (
  matchesSearch &&
  matchesImportance &&
  matchesMonth &&
  matchesDate
);
  });
}, [articles, search, selectedMonth, minImportance]);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-8">
          RBI AI Dashboard
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
  {/* Search */}
  <input
    type="text"
    placeholder="Search RBI topics..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="p-4 rounded-xl bg-zinc-900 border border-zinc-700 outline-none"
  />

  {/* Month Filter */}
  <select
    value={selectedMonth}
    onChange={(e) =>
      setSelectedMonth(e.target.value)
    }
    className="p-4 rounded-xl bg-zinc-900 border border-zinc-700"
  >
    <option>All</option>
    <option>January</option>
    <option>February</option>
    <option>March</option>
    <option>April</option>
    <option>May</option>
    <option>June</option>
    <option>July</option>
    <option>August</option>
    <option>September</option>
    <option>October</option>
    <option>November</option>
    <option>December</option>
  </select>

  {/* Importance Filter */}
  <select
    value={minImportance}
    onChange={(e) =>
      setMinImportance(Number(e.target.value))
    }
    className="p-4 rounded-xl bg-zinc-900 border border-zinc-700"
  >
    <option value={0}>
      All Importance
    </option>
    <option value={5}>
      5+
    </option>
    <option value={7}>
      7+
    </option>
    <option value={8}>
      8+
    </option>
    <option value={9}>
      9+
    </option>
  </select>
</div>
{/* Date Filter */}
<input
  type="date"
  value={selectedDate}
  onChange={(e) =>
    setSelectedDate(e.target.value)
  }
  className="p-4 rounded-xl bg-zinc-900 border border-zinc-700"
/>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <div className="bg-zinc-900 p-4 rounded-xl">
            <p className="text-zinc-400 text-sm">
              Total Articles
            </p>
            <h2 className="text-3xl font-bold">
              {filteredArticles.length}
            </h2>
          </div>

          <div className="bg-zinc-900 p-4 rounded-xl">
            <p className="text-zinc-400 text-sm">
              High Importance
            </p>
            <h2 className="text-3xl font-bold">
              {
                filteredArticles.filter(
                  (a) => a.importance_score >= 8
                ).length
              }
            </h2>
          </div>

          <div className="bg-zinc-900 p-4 rounded-xl">
            <p className="text-zinc-400 text-sm">
              AI Curated
            </p>
            <h2 className="text-3xl font-bold">
              YES
            </h2>
          </div>
          <div className="bg-zinc-900 p-4 rounded-xl">
  <p className="text-zinc-400 text-sm">
    Trending Topic
  </p>

  <h2 className="text-2xl font-bold">
    {topTopic}
  </h2>
</div>

<div className="bg-zinc-900 p-4 rounded-xl">
  <p className="text-zinc-400 text-sm">
    Highest Importance
  </p>

  <h2 className="text-3xl font-bold">
    {highestImportance}/10
  </h2>
</div>
        </div>
      {/* AI Heatmap */}
<div className="mb-10">
  <h2 className="text-2xl font-bold mb-4">
    🔥 AI Topic Heatmap
  </h2>

  <div className="flex flex-wrap gap-3">
    {sortedTopics.map(([topic, count]) => (
      <div
        key={topic}
        className="bg-zinc-900 border border-zinc-700 px-4 py-3 rounded-xl"
      >
        <p className="font-semibold">
          {topic}
        </p>

        <p className="text-sm text-zinc-400">
          {count} articles
        </p>
      </div>
    ))}
  </div>
</div>     
        {/* Articles */}
        <div className="space-y-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="border border-zinc-800 bg-zinc-950 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold max-w-4xl">
                  {article.headline}
                </h2>

                <div className="text-sm bg-zinc-800 px-3 py-1 rounded-full">
                  Importance {article.importance_score}/10
                </div>
              </div>

              <p className="text-zinc-300 leading-7">
                {article.content}
              </p>
              <button
  onClick={() =>
    setExpandedId(
      expandedId === article.id
        ? null
        : article.id
    )
  }
  className="mt-4 text-sm bg-zinc-800 px-4 py-2 rounded-lg"
>
  {expandedId === article.id
    ? "Hide AI Insights"
    : "Show AI Insights"}
</button>

{expandedId === article.id && (
  <div className="mt-6 space-y-6 border-t border-zinc-800 pt-6">

    {/* AI Questions */}
    <div>
      <h3 className="text-xl font-semibold mb-3">
        🧠 Important RBI Questions
      </h3>

      <div className="space-y-2">
        {article.questions?.items?.map(
          (question, index) => (
            <div
              key={index}
              className="bg-zinc-900 p-3 rounded-lg"
            >
              {question}
            </div>
          )
        )}
      </div>
    </div>

    {/* Jargon */}
    <div>
      <h3 className="text-xl font-semibold mb-3">
        📘 Jargon Explained
      </h3>

      <div className="space-y-2">
        {article.jargon_explained?.items?.map(
          (jargon, index) => (
            <div
              key={index}
              className="bg-zinc-900 p-3 rounded-lg"
            >
              {jargon}
            </div>
          )
        )}
      </div>
    </div>
  </div>
)}

              {/* Tags */}
<div className="flex flex-wrap gap-2 mt-6">
  {article.tags?.items?.map((tag) => (
    <span
      key={tag}
      className="bg-zinc-800 text-sm px-3 py-1 rounded-full"
    >
      {tag}
    </span>
  ))}
</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}