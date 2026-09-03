"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Clock,
  Award,
  Wrench,
  HeadphonesIcon,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Licensed & Certified Engineers",
    description:
      "Our team consists of fully licensed electrical engineers with certifications from recognized national and international bodies.",
    color: "text-blue-400",
    bg: "bg-blue-600/10",
    border: "border-blue-500/20",
  },
  {
    icon: Clock,
    title: "24/7 Emergency Support",
    description:
      "Electrical emergencies don't wait, and neither do we. Our rapid-response team is available around the clock for urgent situations.",
    color: "text-amber-400",
    bg: "bg-amber-600/10",
    border: "border-amber-500/20",
  },
  {
    icon: Award,
    title: "Precision Planning",
    description:
      "Every project begins with thorough electrical planning — load calculations, circuit mapping, and compliance checks before any wire is pulled.",
    color: "text-green-400",
    bg: "bg-green-600/10",
    border: "border-green-500/20",
  },
  {
    icon: Wrench,
    title: "Quality Materials & Workmanship",
    description:
      "We use only premium-grade cables, breakers, panels, and components from trusted manufacturers to ensure lasting performance.",
    color: "text-cyan-400",
    bg: "bg-cyan-600/10",
    border: "border-cyan-500/20",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated After-Service",
    description:
      "Our relationship doesn't end at installation. We provide ongoing maintenance, inspections, and support for all completed projects.",
    color: "text-purple-400",
    bg: "bg-purple-600/10",
    border: "border-purple-500/20",
  },
  {
    icon: Zap,
    title: "Safety-First Approach",
    description:
      "Zero compromise on safety. Every system we install is rigorously tested and inspected to meet or exceed all applicable codes and standards.",
    color: "text-rose-400",
    bg: "bg-rose-600/10",
    border: "border-rose-500/20",
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-wider text-blue-400 uppercase">
            Why Choose Us
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            The Tawha{" "}
            <span className="gradient-text">Difference</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            We don&apos;t just wire buildings — we build lasting relationships
            through unmatched quality, safety, and reliability.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl bg-slate-900/60 border border-slate-800 p-8 hover:border-slate-700 transition-all duration-300"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-blue-600/5 to-transparent" />

              <div className="relative z-10">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl ${feature.bg} border ${feature.border} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>

                <h3 className="text-lg font-bold text-white mb-3">
                  {feature.title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
