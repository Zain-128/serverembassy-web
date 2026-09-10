"use client";

import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, useId } from "react";

const fieldBase =
  "mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink shadow-soft outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 placeholder:text-muted/60";

export function TextField({
  label,
  required,
  hint,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-navy">
        {label}
        {required ? <span className="text-sale"> *</span> : null}
      </label>
      <input id={id} className={fieldBase} {...props} />
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function SelectField({
  label,
  children,
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  const id = useId();
  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-navy">
          {label}
        </label>
      ) : null}
      <select id={id} className={fieldBase} {...props}>
        {children}
      </select>
    </div>
  );
}

export function TextareaField({
  label,
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-navy">
        {label}
      </label>
      <textarea id={id} className={`${fieldBase} min-h-24`} {...props} />
    </div>
  );
}