"use client";

import { FormEvent, useState } from "react";

type FeedbackFormState = {
  fullName: string;
  email: string;
  company: string;
  topic: string;
  message: string;
};

type FeedbackFormErrors = Partial<Record<keyof FeedbackFormState, string>>;

const initialForm: FeedbackFormState = {
  fullName: "",
  email: "",
  company: "",
  topic: "General Inquiry",
  message: ""
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validate(values: FeedbackFormState): FeedbackFormErrors {
  const errors: FeedbackFormErrors = {};

  if (!values.fullName.trim()) errors.fullName = "Full name is required.";
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.message.trim()) errors.message = "Message is required.";

  return errors;
}

export function ContactFeedbackForm() {
  const [form, setForm] = useState<FeedbackFormState>(initialForm);
  const [errors, setErrors] = useState<FeedbackFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function updateField<K extends keyof FeedbackFormState>(key: K, value: FeedbackFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setSuccessMessage(null);
    setErrorMessage(null);
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const response = await fetch("/api/contact/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        topic: form.topic,
        message: form.message.trim()
      })
    });

    const payload = (await response.json().catch(() => null)) as { message?: string; error?: string } | null;
    if (!response.ok) {
      setErrorMessage(payload?.error ?? "Unable to submit your message right now.");
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage(payload?.message ?? "Your message has been sent successfully.");
    setForm(initialForm);
    setErrors({});
    setIsSubmitting(false);
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label htmlFor="contact-fullName" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Full Name <span className="text-red-600">*</span>
          </label>
          <input
            id="contact-fullName"
            className="input"
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            autoComplete="name"
            required
          />
          {errors.fullName && <p className="mt-1 text-xs font-medium text-red-600">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            className="input"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            autoComplete="email"
            required
          />
          {errors.email && <p className="mt-1 text-xs font-medium text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <label htmlFor="contact-company" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Company
          </label>
          <input
            id="contact-company"
            className="input"
            value={form.company}
            onChange={(event) => updateField("company", event.target.value)}
            autoComplete="organization"
          />
        </div>
        <div>
          <label htmlFor="contact-topic" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Topic
          </label>
          <select id="contact-topic" className="input" value={form.topic} onChange={(event) => updateField("topic", event.target.value)}>
            <option>General Inquiry</option>
            <option>Project Discussion</option>
            <option>Service Request</option>
            <option>Feedback</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold text-slate-700">
          Message <span className="text-red-600">*</span>
        </label>
        <textarea
          id="contact-message"
          className="input min-h-36 resize-y py-2.5"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Tell us about your request, project, or feedback."
          required
        />
        {errors.message && <p className="mt-1 text-xs font-medium text-red-600">{errors.message}</p>}
      </div>

      {successMessage && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</p>}
      {errorMessage && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary inline-flex min-w-44 items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

