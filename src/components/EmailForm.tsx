"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

type EmailFormProps = {
  variant?: "hero" | "footer";
  placeholder?: string;
  buttonLabel?: string;
};

export function EmailForm({
  variant = "hero",
  placeholder = "your@email.com",
  buttonLabel = "Notify me at launch",
}: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;

    setState("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data: { error?: string } = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong");
      }

      setState("success");
      setMessage("You're on the list. We'll only email when there's something real to share.");
      setEmail("");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const isFooter = variant === "footer";

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center ${
        isFooter ? "" : ""
      }`}
      noValidate
    >
      <label htmlFor={`email-${variant}`} className="sr-only">
        Email address
      </label>
      <input
        id={`email-${variant}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-full border border-espresso/15 bg-bone px-5 py-3 text-[15px] text-espresso placeholder:text-graphite/60 outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
      />
      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-espresso px-5 py-3 text-[14px] font-medium text-bone transition hover:bg-espresso/90 disabled:opacity-60"
      >
        {state === "submitting" ? "Sending..." : buttonLabel}
      </button>
      {message ? (
        <p
          className={`mt-1 w-full text-[13px] sm:mt-2 ${
            state === "success" ? "text-forest" : "text-amber-dark"
          }`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
