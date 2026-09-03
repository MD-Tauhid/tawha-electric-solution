"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Cable,
  Lightbulb,
  Plug,
  Wrench,
  Cpu,
  ShieldCheck,
  CircuitBoard,
  Power,
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  rate: unknown;
  unit: string;
  isFeatured?: boolean;
}

interface ServicesSectionProps {
  services: Service[];
  featuredServices: Service[];
}

const SERVICE_ICONS: Record<string, typeof Zap> = {
  wiring: Cable,
  lighting: Lightbulb,
  installation: Plug,
  maintenance: Wrench,
  planning: CircuitBoard,
  circuit: Cpu,
  safety: ShieldCheck,
  power: Power,
};

function getServiceIcon(name: string): typeof Zap {
  const lower = name.toLowerCase();
  for (const [key, Icon] of Object.entries(SERVICE_ICONS)) {
    if (lower.includes(key)) return Icon;
  }
  // Fallback based on position
  const icons = [Zap, Cable, Lightbulb, Plug, Wrench, Cpu, ShieldCheck, CircuitBoard, Power];
  const index = name.charCodeAt(0) % icons.length;
  return icons[index];
}

function formatRate(rate: unknown): string {
  const num = Number(rate);
  return `$${num.toLocaleString()}`;
}

export function ServicesSection({
  services,
  featuredServices,
}: ServicesSectionProps) {
  return (
    <>
      {/* Featured Services Spotlight */}
      {featuredServices.length > 0 && (
        <section className="relative py-24 sm:py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-sm font-semibold tracking-wider text-amber-400 uppercase">
                Featured Services
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Our <span className="gradient-text">Specialties</span>
              </h2>
              <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                Explore our most sought-after electrical services, trusted by
                hundreds of clients across the region.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((service, i) => {
                const Icon = getServiceIcon(service.name);
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group relative rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/10"
                  >
                    {/* Glow on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20 group-hover:bg-blue-600/20 transition-colors mb-6">
                        <Icon className="h-7 w-7 text-blue-400 group-hover:text-blue-300 transition-colors" />
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                        {service.name}
                      </h3>

                      {service.description && (
                        <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
                          {service.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                        <span className="text-sm text-slate-500">
                          Starting from
                        </span>
                        <span className="text-lg font-bold text-amber-400">
                          {formatRate(service.rate)}
                          <span className="text-xs text-slate-500 font-normal ml-1">
                            / {service.unit}
                          </span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* All Services Grid */}
      <section id="services" className="relative py-24 sm:py-32 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold tracking-wider text-blue-400 uppercase">
              Our Services
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Complete Electrical{" "}
              <span className="gradient-text">Solutions</span>
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              From concept to completion, we handle every aspect of electrical
              work with precision and care.
            </p>
          </motion.div>

          {services.length === 0 ? (
            <div className="text-center py-16">
              <Zap className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">
                Services information coming soon. Contact us for details.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((service, i) => {
                const Icon = getServiceIcon(service.name);
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="flex items-start gap-4 rounded-xl bg-slate-900/50 border border-slate-800 p-5 hover:border-slate-700 hover:bg-slate-800/50 transition-all duration-200"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/10">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-sm">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
