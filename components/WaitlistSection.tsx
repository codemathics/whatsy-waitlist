"use client";

import { useState, FormEvent, useRef } from "react";
import { motion, useInView } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const USE_CASE_OPTIONS = [
  { id: "business", label: "Business & work" },
  { id: "personal", label: "Personal & friends" },
  { id: "both", label: "Both" },
  { id: "others", label: "Others" },
] as const;

const inputStyles =
  "w-full rounded-full border border-black/10 bg-white px-5 sm:px-6 py-3 sm:py-3.5 text-[15px] sm:text-base text-black outline-none transition-all placeholder:text-black/30 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20";

export default function WaitlistSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [useCase, setUseCase] = useState<string>("");
  const [otherUseCase, setOtherUseCase] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: false, amount: 0.3 });

  const showOtherInput = useCase === "others";
  const selectedUseCaseLabel =
    USE_CASE_OPTIONS.find((option) => option.id === useCase)?.label ?? "";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    const normalizedUseCase = showOtherInput
      ? otherUseCase.trim()
      : selectedUseCaseLabel;

    if (!trimmedEmail || !trimmedName) return;
    if (!useCase) return;
    if (!normalizedUseCase) return;

    setErrorMessage("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          useCase: normalizedUseCase,
        }),
      });

      if (response.status === 409) {
        setErrorMessage("Looks like this email is already on the waitlist.");
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const msg =
          typeof data?.error === "string"
            ? data.error
            : "Something went wrong. Please try again.";
        setErrorMessage(msg);
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error("[waitlist] submit failed", error);
      setErrorMessage("Unable to submit right now. Please try again shortly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="waitlist"
      className="relative py-20 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden"
    >
      {/* soft glow keeps the form from feeling flat */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse, rgba(92,227,162,0.5) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div ref={formRef} className="relative z-10 max-w-[600px] mx-auto text-center">
        <ScrollReveal once={false}>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.96] tracking-[-0.05em] text-black">
            Join us on this journey
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15} once={false}>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed">
            Join the waitlist and we&apos;ll let you know as soon as Whatsy is
            ready.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3} once={false}>
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-4 text-left"
              aria-label="Waitlist signup"
            >
              <motion.div
                animate={isInView ? { scale: [0.98, 1] } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  autoComplete="name"
                  className={inputStyles}
                />
              </motion.div>

              <motion.div
                animate={isInView ? { scale: [0.98, 1] } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="clement@whatsy.ai"
                  required
                  autoComplete="email"
                  className={inputStyles}
                />
              </motion.div>

              <motion.div
                animate={isInView ? { scale: [0.98, 1] } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-3"
              >
                <p className="text-sm font-medium text-black">
                  What would you most likely use Whatsy for?
                </p>
                <div className="flex flex-wrap gap-2">
                  {USE_CASE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setUseCase(opt.id)}
                  className={`rounded-full px-3.5 sm:px-4 py-2 text-sm font-medium transition-all ${
                        useCase === opt.id
                          ? "bg-brand-green text-white ring-2 ring-brand-green ring-offset-2"
                          : "bg-white border border-black/10 text-text-secondary hover:border-brand-green/50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {showOtherInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label htmlFor="other-use-case" className="sr-only">
                      Tell us what you&apos;d use Whatsy for
                    </label>
                    <input
                      id="other-use-case"
                      type="text"
                      value={otherUseCase}
                      onChange={(e) => setOtherUseCase(e.target.value)}
                      placeholder="What would you use Whatsy for?"
                      className={`mt-2 ${inputStyles}`}
                    />
                  </motion.div>
                )}
              </motion.div>

              <motion.button
                type="submit"
                disabled={
                  submitting ||
                  !useCase ||
                  (useCase === "others" && !otherUseCase.trim())
                }
                className="btn-join w-full sm:w-auto shrink-0 self-center rounded-full px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 disabled:opacity-70"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Joining...
                  </span>
                ) : (
                  "Join Waitlist"
                )}
              </motion.button>

              {errorMessage ? (
                <p className="text-sm text-red-500 text-center">{errorMessage}</p>
              ) : null}
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 p-6 rounded-2xl bg-brand-green/10 border border-brand-green/20"
            >
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-lg font-semibold text-black">
                You&apos;re on the list!
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                We&apos;ll reach out as soon as Whatsy is ready.
              </p>
            </motion.div>
          )}
        </ScrollReveal>

        <ScrollReveal delay={0.45} once={false}>
          <p className="mt-6 text-xs text-text-muted">
            We&apos;ll only use your email to notify you. No spam, ever.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
