"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  positionAppliedFor: string;
  department: string;
  yearsOfExperience: string;
  currentLocation: string;
  portfolioUrl: string;
  message: string;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof FormState | "cv", string>>;

const DEPARTMENTS = [
  "Field Operations",
  "Technical Services",
  "Project Delivery",
  "Business Support",
  "HSE",
  "Other"
] as const;

const EXPERIENCE_LEVELS = ["0-1", "2-4", "5-8", "9-12", "12+"] as const;

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const ACCEPTED_FILE_EXTENSIONS = [".pdf", ".doc", ".docx"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  positionAppliedFor: "",
  department: "",
  yearsOfExperience: "",
  currentLocation: "",
  portfolioUrl: "",
  message: "",
  consent: false
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidOptionalUrl(url: string) {
  if (!url.trim()) return true;

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function validateCvFile(file: File | null): string | null {
  if (!file) {
    return "CV file is required.";
  }

  const fileExtension = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : "";
  const hasAllowedType = ACCEPTED_FILE_TYPES.includes(file.type);
  const hasAllowedExtension = ACCEPTED_FILE_EXTENSIONS.includes(fileExtension);

  if (!hasAllowedType && !hasAllowedExtension) {
    return "Upload a valid CV file (.pdf, .doc, .docx).";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "CV file must be 5MB or smaller.";
  }

  return null;
}

function validateForm(values: FormState, cvFile: File | null): FormErrors {
  const errors: FormErrors = {};

  if (!values.firstName.trim()) errors.firstName = "First name is required.";
  if (!values.lastName.trim()) errors.lastName = "Last name is required.";

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.phoneNumber.trim()) errors.phoneNumber = "Phone number is required.";
  if (!values.positionAppliedFor.trim()) errors.positionAppliedFor = "Position is required.";

  if (values.portfolioUrl.trim() && !isValidOptionalUrl(values.portfolioUrl)) {
    errors.portfolioUrl = "Use a valid URL (https://example.com).";
  }

  if (!values.consent) errors.consent = "You must provide consent before submitting.";

  const cvError = validateCvFile(cvFile);
  if (cvError) errors.cv = cvError;

  return errors;
}

export function CareerApplicationForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    function openFromVacancy(event: Event) {
      const customEvent = event as CustomEvent<{ subject?: string }>;
      const subject = customEvent.detail?.subject?.trim();

      setIsOpen(true);
      if (subject) {
        setForm((current) => ({ ...current, positionAppliedFor: subject }));
      }

      setTimeout(() => {
        document.getElementById("career-application-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 40);
    }

    window.addEventListener("nageco:open-career-form", openFromVacancy as EventListener);
    return () => window.removeEventListener("nageco:open-career-form", openFromVacancy as EventListener);
  }, []);

  const isFormValid = useMemo(() => Object.keys(validateForm(form, cvFile)).length === 0, [form, cvFile]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setSubmitSuccess(null);
    setSubmitError(null);

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function onFileChange(file: File | null) {
    setCvFile(file);
    setSubmitSuccess(null);
    setSubmitError(null);

    const cvError = validateCvFile(file);
    setErrors((current) => ({ ...current, cv: cvError ?? undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(form, cvFile);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !cvFile) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);

    try {
      const payload = new FormData();
      payload.append("firstName", form.firstName.trim());
      payload.append("lastName", form.lastName.trim());
      payload.append("email", form.email.trim());
      payload.append("phoneNumber", form.phoneNumber.trim());
      payload.append("positionAppliedFor", form.positionAppliedFor.trim());
      payload.append("department", form.department);
      payload.append("yearsOfExperience", form.yearsOfExperience);
      payload.append("currentLocation", form.currentLocation.trim());
      payload.append("portfolioUrl", form.portfolioUrl.trim());
      payload.append("message", form.message.trim());
      payload.append("consent", String(form.consent));
      payload.append("cv", cvFile);

      const response = await fetch("/api/careers/apply", {
        method: "POST",
        body: payload
      });

      const result = (await response.json().catch(() => null)) as { message?: string; error?: string } | null;

      if (!response.ok) {
        throw new Error(result?.error || "Could not submit your application. Please try again.");
      }

      setSubmitSuccess(result?.message || "Application submitted successfully.");
      setForm(initialFormState);
      setCvFile(null);
      setErrors({});
    } catch (error) {
      const message = error instanceof Error ? error.message : "Submission failed. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <section
        id="career-application-form"
        className={`relative mt-8 overflow-hidden rounded-[1.6rem] border border-brand-700/16 bg-white/90 p-5 shadow-[0_26px_70px_-42px_rgba(15,39,71,0.42)] backdrop-blur-sm transition-all duration-700 md:mt-10 md:p-7 ${
          isMounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-brand-500/12 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-brand-700/10 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="nageco-overline">Application Form</span>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">Ready to Apply?</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              Click Add Your CV to open the full application form.
            </p>
          </div>
          <button type="button" className="btn-primary rounded-xl px-5 py-3" onClick={() => setIsOpen(true)}>
            Add Your CV
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="career-application-form"
      className={`relative mt-8 overflow-hidden rounded-[1.6rem] border border-brand-700/16 bg-white/90 p-5 shadow-[0_26px_70px_-42px_rgba(15,39,71,0.42)] backdrop-blur-sm transition-all duration-700 md:mt-10 md:p-7 ${
        isMounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
      aria-labelledby="career-application-form-title"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-brand-500/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-brand-700/10 blur-3xl" />

      <div className="relative mb-6 md:mb-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="nageco-overline">Application Form</span>
            <h2 id="career-application-form-title" className="mt-3 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
              Apply for a Position
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              Complete the form below and upload your CV. Our hiring team will review your application and contact you if there is a suitable match.
            </p>
          </div>
          <button type="button" className="btn-secondary rounded-xl px-4 py-2" onClick={() => setIsOpen(false)}>
            Hide Form
          </button>
        </div>
      </div>

      <form className="relative space-y-5" onSubmit={onSubmit} noValidate>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="mb-1.5 block text-sm font-semibold text-slate-700">
              First Name <span className="text-red-600">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
              className="input"
              autoComplete="given-name"
              required
            />
            {errors.firstName && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.firstName}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Last Name <span className="text-red-600">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
              className="input"
              autoComplete="family-name"
              required
            />
            {errors.lastName && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.lastName}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="input"
              autoComplete="email"
              required
            />
            {errors.email && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={form.phoneNumber}
              onChange={(event) => updateField("phoneNumber", event.target.value)}
              className="input"
              autoComplete="tel"
              required
            />
            {errors.phoneNumber && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.phoneNumber}</p>}
          </div>

          <div>
            <label htmlFor="positionAppliedFor" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Position Applied For <span className="text-red-600">*</span>
            </label>
            <input
              id="positionAppliedFor"
              type="text"
              value={form.positionAppliedFor}
              onChange={(event) => updateField("positionAppliedFor", event.target.value)}
              className="input"
              required
            />
            {errors.positionAppliedFor && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.positionAppliedFor}</p>}
          </div>

          <div>
            <label htmlFor="department" className="mb-1.5 block text-sm font-semibold text-slate-700">Department</label>
            <select
              id="department"
              value={form.department}
              onChange={(event) => updateField("department", event.target.value)}
              className="input"
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="yearsOfExperience" className="mb-1.5 block text-sm font-semibold text-slate-700">Years of Experience</label>
            <select
              id="yearsOfExperience"
              value={form.yearsOfExperience}
              onChange={(event) => updateField("yearsOfExperience", event.target.value)}
              className="input"
            >
              <option value="">Select experience level</option>
              {EXPERIENCE_LEVELS.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="currentLocation" className="mb-1.5 block text-sm font-semibold text-slate-700">Current Location</label>
            <input
              id="currentLocation"
              type="text"
              value={form.currentLocation}
              onChange={(event) => updateField("currentLocation", event.target.value)}
              className="input"
              autoComplete="address-level2"
            />
          </div>

          <div>
            <label htmlFor="portfolioUrl" className="mb-1.5 block text-sm font-semibold text-slate-700">LinkedIn or Portfolio URL</label>
            <input
              id="portfolioUrl"
              type="url"
              value={form.portfolioUrl}
              onChange={(event) => updateField("portfolioUrl", event.target.value)}
              className="input"
              placeholder="https://"
            />
            {errors.portfolioUrl && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.portfolioUrl}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-slate-700">Cover Letter / Message</label>
          <textarea
            id="message"
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            className="input min-h-32 resize-y py-2.5"
            placeholder="Write a short message about your profile and motivation."
          />
        </div>

        <div className="rounded-2xl border border-brand-700/14 bg-white/85 p-4 md:p-5">
          <label htmlFor="cv" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Upload CV <span className="text-red-600">*</span>
          </label>
          <input
            id="cv"
            type="file"
            accept=".pdf,.doc,.docx"
            className="block w-full cursor-pointer rounded-xl border border-brand-700/18 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-700 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
            required
          />
          <p className="mt-2 text-xs text-slate-500">Accepted formats: .pdf, .doc, .docx. Max size: 5MB.</p>
          {cvFile && (
            <p className="mt-2 rounded-lg bg-brand-700/5 px-3 py-2 text-xs font-medium text-brand-700">
              Selected file: <span className="font-bold">{cvFile.name}</span>
            </p>
          )}
          {errors.cv && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.cv}</p>}
        </div>

        <div>
          <label className="inline-flex cursor-pointer items-start gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-brand-700/30 text-brand-700 focus:ring-brand-500"
              checked={form.consent}
              onChange={(event) => updateField("consent", event.target.checked)}
              required
            />
            <span>
              I consent to NAGECO processing my personal data for recruitment purposes.
              <span className="text-red-600"> *</span>
            </span>
          </label>
          {errors.consent && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.consent}</p>}
        </div>

        {submitSuccess && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{submitSuccess}</p>}
        {submitError && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{submitError}</p>}

        <button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className="btn-primary inline-flex min-w-44 items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </section>
  );
}
