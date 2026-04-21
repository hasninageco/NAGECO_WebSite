"use client";

type OpenCareerFormButtonProps = {
  subject?: string;
  className?: string;
  label?: string;
};

export function OpenCareerFormButton({ subject, className, label }: OpenCareerFormButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("nageco:open-career-form", { detail: { subject: subject || "" } }));
      }}
    >
      {label ?? "Add Your CV"}
    </button>
  );
}
