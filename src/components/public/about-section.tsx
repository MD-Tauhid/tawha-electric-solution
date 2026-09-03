"use client";

import { motion } from "framer-motion";
import { Shield, Award, Clock, Users } from "lucide-react";

const STATS = [
  { icon: Shield, value: "100%", label: "Safety Compliance" },
  { icon: Award, value: "15+", label: "Years Experience" },
  { icon: Clock, value: "24/7", label: "Emergency Support" },
  { icon: Users, value: "500+", label: "Projects Completed" },
];

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 bg-slate-950"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold tracking-wider text-blue-400 uppercase">
              About Us
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Electrical Excellence,{" "}
              <span className="gradient-text">Built on Trust</span>
            </h2>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed">
              Tawha Electrical Solution has been at the forefront of electrical
              engineering and services, delivering safe, reliable, and
              innovative solutions across Bangladesh. Our team of licensed
              engineers brings deep expertise to every project — from initial
              planning and circuit design to full-scale wiring, installation,
              and ongoing maintenance.
            </p>
            <p className="mt-4 text-base text-slate-400 leading-relaxed">
              We adhere strictly to national and international electrical safety
              standards, ensuring every connection, circuit, and system we
              implement meets the highest benchmarks of quality and reliability.
              Whether it&apos;s a residential rewiring, a commercial lighting
              system, or an industrial power distribution network, we approach
              every job with the same commitment to precision and safety.
            </p>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 gap-6">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20">
                    <stat.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual element */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 p-8 sm:p-12">
              {/* Decorative grid */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Our Mission
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    To provide world-class electrical solutions that prioritize
                    safety, efficiency, and long-term reliability — empowering
                    homes, businesses, and industries with dependable power
                    systems.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Our Standards
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Every project follows strict compliance with Bangladesh
                    Electrical Building Code, IEEE standards, and international
                    safety regulations. We use premium-grade materials and
                    undergo rigorous quality inspections.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Our Promise
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Transparent pricing, on-time delivery, and zero compromise
                    on safety. We stand behind our work with comprehensive
                    warranties and dedicated after-service support.
                  </p>
                </div>
              </div>
            </div>

            {/* Glow accent */}
            <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-cyan-600/20 blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
