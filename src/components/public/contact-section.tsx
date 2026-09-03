"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Facebook,
  Instagram,
  Send,
  CheckCircle,
} from "lucide-react";
import type { PublicCompanySettings } from "@/lib/public-data";

interface ContactSectionProps {
  settings: PublicCompanySettings;
}

export function ContactSection({ settings }: ContactSectionProps) {
  const [formStatus, setFormStatus] = React.useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormStatus("submitting");
    // Simulate submission
    setTimeout(() => {
      setFormStatus("success");
      setTimeout(() => setFormStatus("idle"), 5000);
    }, 1500);
  }

  return (
    <section
      id="contact"
      className="relative py-24 sm:py-32 bg-gradient-to-b from-slate-950 to-slate-900"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-wider text-blue-400 uppercase">
            Get in Touch
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Let&apos;s{" "}
            <span className="gradient-text">Talk Power</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Reach out to us for a free consultation, emergency service, or to
            discuss your next electrical project.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Send Us a Message
              </h3>

              {formStatus === "success" ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <CheckCircle className="h-16 w-16 text-green-400 mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Message Sent!
                  </h4>
                  <p className="text-slate-400">
                    We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-300 mb-1.5"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-300 mb-1.5"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone-input"
                      className="block text-sm font-medium text-slate-300 mb-1.5"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone-input"
                      className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+880 1XXX-XXXXXX"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="service"
                      className="block text-sm font-medium text-slate-300 mb-1.5"
                    >
                      Service Needed
                    </label>
                    <select
                      id="service"
                      className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select a service...</option>
                      <option value="wiring">Wiring & Installation</option>
                      <option value="lighting">Lighting Design</option>
                      <option value="planning">Electrical Planning</option>
                      <option value="maintenance">Maintenance & Repair</option>
                      <option value="inspection">Safety Inspection</option>
                      <option value="emergency">Emergency Service</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-300 mb-1.5"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === "submitting"}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-blue-600/25"
                  >
                    {formStatus === "submitting" ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Contact cards */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Contact Information
              </h3>

              <div className="space-y-5">
                {settings.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center gap-4 group"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20 group-hover:bg-blue-600/20 transition-colors">
                      <Phone className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="text-white font-medium group-hover:text-blue-300 transition-colors">
                        {settings.phone}
                      </p>
                    </div>
                  </a>
                )}

                {settings.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-4 group"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20 group-hover:bg-blue-600/20 transition-colors">
                      <Mail className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="text-white font-medium group-hover:text-blue-300 transition-colors">
                        {settings.email}
                      </p>
                    </div>
                  </a>
                )}

                {settings.address && (
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20">
                      <MapPin className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Address</p>
                      <p className="text-white font-medium">
                        {settings.address}
                      </p>
                    </div>
                  </div>
                )}

                {settings.businessHours && (
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20">
                      <Clock className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Business Hours</p>
                      <p className="text-white font-medium">
                        {settings.businessHours}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social links */}
            {(settings.whatsapp ||
              settings.facebook ||
              settings.instagram) && (
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8">
                <h3 className="text-lg font-bold text-white mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {settings.whatsapp && (
                    <a
                      href={settings.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600/10 border border-green-500/20 text-green-400 hover:bg-green-600/20 transition-colors"
                      aria-label="WhatsApp"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </a>
                  )}
                  {settings.facebook && (
                    <a
                      href={settings.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600/20 transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  )}
                  {settings.instagram && (
                    <a
                      href={settings.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-600/10 border border-pink-500/20 text-pink-400 hover:bg-pink-600/20 transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Google Maps */}
            {settings.googleMapsUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-800">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=${encodeURIComponent(settings.googleMapsUrl)}`}
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
              </div>
            )}

            {/* Emergency banner */}
            {settings.phone && (
              <div className="rounded-2xl bg-gradient-to-r from-red-600/20 to-amber-600/20 border border-red-500/20 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600/20">
                    <Phone className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">
                      Electrical Emergency?
                    </h4>
                    <p className="text-sm text-slate-400">
                      Our emergency team is available 24/7. Call us immediately.
                    </p>
                  </div>
                  <a
                    href={`tel:${settings.phone}`}
                    className="shrink-0 ml-auto rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
