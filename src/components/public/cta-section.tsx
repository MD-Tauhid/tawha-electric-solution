"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone, Zap } from "lucide-react";

interface CtaSectionProps {
  phone: string;
}

export function CtaSection({ phone }: CtaSectionProps) {
  return (
    <section className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-blue-600/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-gradient-to-br from-blue-600/20 via-slate-900/80 to-cyan-600/20 border border-blue-500/20 p-8 sm:p-12 lg:p-16 text-center"
        >
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 mx-auto mb-8"
            >
              <Zap className="h-8 w-8 text-white" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Ready to Power Up{" "}
              <span className="gradient-text">Your Project?</span>
            </h2>

            <p className="mt-6 text-lg text-slate-300 max-w-xl mx-auto">
              Whether you need a full electrical installation, a safety
              inspection, or emergency repairs — our expert team is ready to
              deliver.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-500 transition-all hover:shadow-xl hover:shadow-blue-600/25 hover:-translate-y-0.5"
              >
                Request Free Estimate
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </a>
            </div>

            <p className="mt-8 text-sm text-slate-500">
              Free consultations for all new projects · No obligation · Fast
              response within 24 hours
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
