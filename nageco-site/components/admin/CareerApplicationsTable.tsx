"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CareerApplicationRecord } from "@/lib/career-applications";

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

export function CareerApplicationsTable({ applications }: { applications: CareerApplicationRecord[] }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [experience, setExperience] = useState("all");

  const departments = useMemo(() => {
    const values = new Set<string>();
    for (const item of applications) {
      if (item.department?.trim()) values.add(item.department.trim());
    }
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [applications]);

  const experiences = useMemo(() => {
    const values = new Set<string>();
    for (const item of applications) {
      if (item.yearsOfExperience?.trim()) values.add(item.yearsOfExperience.trim());
    }
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const search = normalize(query);

    return applications.filter((item) => {
      const matchesDepartment = department === "all" || normalize(item.department) === normalize(department);
      const matchesExperience = experience === "all" || normalize(item.yearsOfExperience) === normalize(experience);

      if (!matchesDepartment || !matchesExperience) {
        return false;
      }

      if (!search) {
        return true;
      }

      const searchableText = [
        item.firstName,
        item.lastName,
        item.email,
        item.phoneNumber,
        item.positionAppliedFor,
        item.department,
        item.yearsOfExperience,
        item.currentLocation,
        item.portfolioUrl,
        item.message
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(search);
    });
  }, [applications, department, experience, query]);

  return (
    <section className="card overflow-hidden p-0">
      <div className="border-b border-slate-200 bg-white/90 p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(260px,1fr)_220px_220px_auto] md:items-end">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Search</span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, email, phone, position..."
              className="input"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Department</span>
            <select value={department} onChange={(event) => setDepartment(event.target.value)} className="input">
              <option value="all">All departments</option>
              {departments.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Experience</span>
            <select value={experience} onChange={(event) => setExperience(event.target.value)} className="input">
              <option value="all">All levels</option>
              {experiences.map((value) => (
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
              setDepartment("all");
              setExperience("all");
            }}
          >
            Reset
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Showing {filteredApplications.length} of {applications.length} submissions
        </p>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="p-6 text-sm text-slate-600">No applications match the selected filters.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Experience</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Portfolio</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">CV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredApplications.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(item.submittedAt)}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {item.firstName} {item.lastName}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <a href={`mailto:${item.email}`} className="text-brand-700 hover:underline">
                        {item.email}
                      </a>
                      <div className="text-slate-600">{item.phoneNumber}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{item.positionAppliedFor || "-"}</td>
                  <td className="px-4 py-3 text-slate-700">{item.department || "-"}</td>
                  <td className="px-4 py-3 text-slate-700">{item.yearsOfExperience || "-"}</td>
                  <td className="px-4 py-3 text-slate-700">{item.currentLocation || "-"}</td>
                  <td className="px-4 py-3">
                    {item.portfolioUrl ? (
                      <a href={item.portfolioUrl} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">
                        Open
                      </a>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                  <td className="max-w-xs whitespace-pre-wrap px-4 py-3 text-slate-700">{item.message || "-"}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/api/admin/career-applications/cv?file=${encodeURIComponent(item.cvFileName)}`}
                      className="inline-flex rounded-lg border border-brand-700/20 bg-brand-700/10 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-700/15"
                    >
                      Download
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
