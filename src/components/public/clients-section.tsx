"use client";

import { motion } from "framer-motion";
import { Home, Building2, Factory, UtensilsCrossed, Building } from "lucide-react";

const SECTORS = [
  {
    icon: Home,
    type: "RESIDENTIAL",
    title: "Residential",
    description:
      "Complete home electrical solutions — from new construction wiring and rewiring to lighting design, safety inspections, and smart home integration.",
    features: ["Home Wiring & Rewiring", "Lighting Design", "Safety Inspections", "Smart Home Systems"],
  },
  {
    icon: Building2,
    type: "COMMERCIAL",
    title: "Commercial",
    description:
      "Reliable electrical infrastructure for offices, retail spaces, malls, and commercial buildings — designed for efficiency and compliance.",
    features: ["Office Electrical Fit-Out", "Energy-Efficient Lighting", "Backup Power Systems", "Data Cabling"],
  },
  {
    icon: Factory,
    type: "INDUSTRIAL",
    title: "Industrial",
    description:
      "Heavy-duty electrical solutions for factories, warehouses, and industrial facilities — power distribution, motor controls, and automation.",
    features: ["Power Distribution", "Motor Control Panels", "Industrial Automation", "High-Voltage Systems"],
  },
  {
    icon: UtensilsCrossed,
    type: "RESTAURANT",
    title: "Restaurant & Hospitality",
    description:
      "Specialized electrical services for restaurants, hotels, and hospitality venues — commercial kitchen wiring, ambient lighting, and fire alarm systems.",
    features: ["Commercial Kitchen Wiring", "Ambient Lighting", "Fire Alarm Systems", "POS Infrastructure"],
  },
  {
    icon: Building,
    type: "OTHER",
    title: "Special Projects",
    description:
      "Custom electrical solutions for unique spaces — healthcare facilities, educational institutions, government buildings, and specialized environments.",
    features: ["Healthcare Facilities", "Educational Institutions", "Government Buildings", "Custom Solutions"],
  },
];

export function ClientsSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-wider text-blue-400 uppercase">
            Our Sectors
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Trusted Across{" "}
            <span className="gradient-text">Every Sector</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            From homes to factories, we deliver tailored electrical solutions
            that meet the unique demands of every environment.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((sector, i) => (
            <motion.div
              key={sector.type}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 hover:border-blue-500/30 transition-all duration-300 ${
                i === SECTORS.length - 1 && SECTORS.length % 3 === 1
                  ? "sm:col-span-2 lg:col-span-1 lg:col-start-2"
                  : ""
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20 group-hover:bg-blue-600/20 transition-colors mb-6">
                <sector.icon className="h-7 w-7 text-blue-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                {sector.title}
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {sector.description}
              </p>

              <ul className="space-y-2">
                {sector.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
