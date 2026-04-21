"use client";

import { useMemo, useState } from "react";
import type { ContactFeedbackRecord } from "@/lib/contact-feedback-types";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function normalize(value: string | undefined | null) {
  return (value || "").trim().toLowerCase();
}

export function ContactFeedbackTable({ records }: { records: ContactFeedbackRecord[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");

  const topics = useMemo(() => {
    const values = new Set<string>();
    for (const item of records) {
      if (item.topic?.trim()) values.add(item.topic.trim());
    }
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [records]);

  const filtered = useMemo(() => {
    const search = normalize(query);
    return records.filter((item) => {
      const matchesTopic = topic === "all" || normalize(item.topic) === normalize(topic);
      if (!matchesTopic) return false;
      if (!search) return true;

      const text = [item.fullName, item.email, item.company, item.topic, item.message].join(" ").toLowerCase();
      return text.includes(search);
    });
  }, [query, records, topic]);

  return (
    <section className="card overflow-hidden p-0">
      <div className="border-b border-slate-200 bg-white/90 p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(260px,1fr)_220px_auto] md:items-end">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Search</span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, email, company, message..."
              className="input"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Topic</span>
            <select value={topic} onChange={(event) => setTopic(event.target.value)} className="input">
              <option value="all">All topics</option>
              {topics.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="btn-secondary h-10"
            onClick={() => {
              setQuery("");
              setTopic("all");
            }}
          >
            Reset
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Showing {filtered.length} of {records.length} messages
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="p-6 text-sm text-slate-600">No feedback messages match the selected filters.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(item.submittedAt)}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{item.fullName}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${item.email}`} className="text-brand-700 hover:underline">
                      {item.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{item.company || "-"}</td>
                  <td className="px-4 py-3 text-slate-700">{item.topic || "-"}</td>
                  <td className="max-w-xl whitespace-pre-wrap px-4 py-3 text-slate-700">{item.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

