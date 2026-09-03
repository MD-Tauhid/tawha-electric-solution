"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone, Zap } from "lucide-react";
import { HeroCanvas } from "./hero-canvas";

interface HeroSectionProps {
  phone: string;
}

export function HeroSection({ phone }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      {/* Canvas background */}
      <div className="hero-canvas-container">
        <HeroCanvas />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/80 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 to-transparent z-[1]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 border border-blue-500/30 px-4 py-1.5 text-sm font-medium text-blue-300">
              <Zap className="h-3.5 w-3.5" />
              Trusted Electrical Experts
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
          >
            Powering Your World with{" "}
            <span className="gradient-text">Precision & Safety</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed"
          >
            From complete electrical planning and wiring to smart circuit design
            and maintenance — we deliver reliable, code-compliant solutions for
            residential, commercial, and industrial spaces.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-500 transition-all hover:shadow-xl hover:shadow-blue-600/25 hover:-translate-y-0.5"
            >
              Request an Estimate
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
            >
              <Phone className="h-5 w-5" />
              Emergency Service
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-16 flex flex-wrap gap-8 text-sm text-slate-400"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              Licensed & Certified
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              24/7 Emergency Support
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              Code-Compliant Work
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-[2]" />
    </section>
  );
}
