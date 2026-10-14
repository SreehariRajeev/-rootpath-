"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { contactEmail, contactEndpoint, contactHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

const requestTypes = ["Quote", "Proposal"] as const;

const services = [
  "Web development",
  "Mobile app",
  "Cloud and API engineering",
  "Technical consulting",
  "Not sure yet",
] as const;

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full rounded-lg border border-border-strong bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted-subtle hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/30";

const labelClass =
  "mb-2 block font-mono text-[11px] uppercase tracking-[0.12em] text-muted-subtle";

export function Contact() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [status, setStatus] = React.useState<Status>("idle");
  const [requestType, setRequestType] =
    React.useState<(typeof requestTypes)[number]>("Quote");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const data = new FormData(event.currentTarget);

    // Honeypot: real visitors never see or fill this field.
    if (data.get("_honey")) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(contactEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company") || "Not provided",
          request_type: requestType,
          service: data.get("service"),
          message: data.get("message"),
          _subject: `New ${requestType.toLowerCase()} request from ${data.get("name")} via root-path.tech`,
          _replyto: data.get("email"),
          _template: "table",
          _captcha: "false",
        }),
      });
      const result = (await response.json().catch(() => null)) as {
        success?: boolean | string;
      } | null;

      if (!response.ok || (result && String(result.success) === "false")) {
        throw new Error("Request failed");
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="mx-auto max-w-7xl border-t border-border px-6 py-20 sm:py-24 lg:px-10 lg:py-28"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(16rem,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
        <Reveal className="self-start lg:sticky lg:top-28">
          <p className="eyebrow">Request a quote</p>
          <h2
            id="contact-heading"
            className="mt-5 max-w-xl text-4xl font-medium leading-[1] tracking-[-0.03em] text-foreground sm:text-5xl"
          >
            Tell us what you are building.
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Ask for a quote or a full proposal. Share the problem, the timeline,
            and anything that is already in place. Your request goes straight to
            the team that would do the work.
          </p>

          <dl className="mt-8 grid gap-4 border-t border-border pt-6 font-mono text-[13px]">
            <div className="flex gap-4">
              <dt className="w-16 shrink-0 text-muted-subtle">email</dt>
              <dd>
                <a
                  href={contactHref}
                  className="text-accent underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-accent/70"
                >
                  {contactEmail}
                </a>
              </dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-16 shrink-0 text-muted-subtle">next</dt>
              <dd className="text-muted-foreground">
                We read every request and reply with questions or a scoped plan.
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.08} amount={0.1}>
          <div className="rounded-xl border border-border bg-surface-elevated p-6 sm:p-8 lg:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  role="status"
                  initial={
                    shouldReduceMotion
                      ? false
                      : { opacity: 0, transform: "translateY(10px)" }
                  }
                  animate={{ opacity: 1, transform: "translateY(0)" }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="py-10 sm:py-16"
                >
                  <p className="font-mono text-sm text-accent">
                    &gt;_rp$ request --send
                  </p>
                  <h3 className="mt-6 text-3xl font-medium tracking-[-0.02em] text-foreground">
                    Request received.
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
                    Thanks for the details. We will read them and reply to the
                    email address you provided.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-8"
                    onClick={() => setStatus("idle")}
                  >
                    Send another request
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  aria-describedby="contact-status"
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-6"
                >
                  <fieldset>
                    <legend className={labelClass}>I would like a</legend>
                    <div className="inline-grid grid-cols-2 gap-1 rounded-lg border border-border-strong p-1">
                      {requestTypes.map((type) => (
                        <label
                          key={type}
                          className={cn(
                            "cursor-pointer rounded-md px-5 py-2 text-center text-sm font-medium transition-colors duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/70",
                            requestType === type
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <input
                            type="radio"
                            name="request_type"
                            value={type}
                            checked={requestType === type}
                            onChange={() => setRequestType(type)}
                            className="sr-only"
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className={labelClass}>
                        Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Your name"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className={labelClass}>
                        Email
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@company.com"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-company" className={labelClass}>
                        Company{" "}
                        <span className="normal-case tracking-normal">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="contact-company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        placeholder="Company name"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-service" className={labelClass}>
                        What do you need
                      </label>
                      <div className="relative">
                        <select
                          id="contact-service"
                          name="service"
                          required
                          defaultValue=""
                          className={cn(
                            fieldClass,
                            "cursor-pointer appearance-none pr-10 invalid:text-muted-subtle",
                          )}
                        >
                          <option value="" disabled>
                            Select a service
                          </option>
                          {services.map((service) => (
                            <option key={service} value={service}>
                              {service}
                            </option>
                          ))}
                        </select>
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-accent"
                        >
                          ▾
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className={labelClass}>
                      Project details
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      minLength={10}
                      rows={6}
                      placeholder="What are you building, what is the timeline, and what is already in place?"
                      className={cn(fieldClass, "resize-y leading-6")}
                    />
                  </div>

                  {/* Honeypot, hidden from people and assistive tech. */}
                  <div
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
                  >
                    <label htmlFor="contact-honey">
                      Leave this field empty
                    </label>
                    <input
                      id="contact-honey"
                      name="_honey"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p
                      id="contact-status"
                      role="status"
                      aria-live="polite"
                      className={cn(
                        "text-sm",
                        status === "error"
                          ? "text-[#a3564f] dark:text-[#c98a86]"
                          : "text-muted-subtle",
                      )}
                    >
                      {status === "error" ? (
                        <>
                          That did not send. Try again, or email{" "}
                          <a
                            href={contactHref}
                            className="underline underline-offset-4"
                          >
                            {contactEmail}
                          </a>
                          .
                        </>
                      ) : (
                        "We use your details only to reply to this request."
                      )}
                    </p>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={status === "sending"}
                    >
                      {status === "sending"
                        ? "Sending..."
                        : `Request a ${requestType.toLowerCase()}`}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
