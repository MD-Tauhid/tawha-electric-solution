"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Tag } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  status: string;
  totalValue: unknown;
  startDate: Date | null;
  actualEndDate: Date | null;
  customer: {
    name: string;
    type: string;
  };
  items: {
    service: {
      name: string;
    };
  }[];
}

interface PortfolioSectionProps {
  projects: Project[];
}

const SECTOR_FILTERS = [
  { label: "All", value: "all" },
  { label: "Residential", value: "RESIDENTIAL" },
  { label: "Commercial", value: "COMMERCIAL" },
  { label: "Industrial", value: "INDUSTRIAL" },
  { label: "Restaurant", value: "RESTAURANT" },
  { label: "Other", value: "OTHER" },
];

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Completed",
  ONGOING: "Ongoing",
};

function formatValue(value: unknown): string {
  const num = Number(value);
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
  return `$${num.toLocaleString()}`;
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function PortfolioSection({ projects }: PortfolioSectionProps) {
  const [activeFilter, setActiveFilter] = React.useState("all");

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.customer.type === activeFilter);

  return (
    <section
      id="portfolio"
      className="relative py-24 sm:py-32 bg-gradient-to-b from-slate-900 to-slate-950"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold tracking-wider text-blue-400 uppercase">
            Our Portfolio
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Projects That{" "}
            <span className="gradient-text">Speak for Themselves</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Browse our portfolio of completed and ongoing electrical projects
            across diverse sectors.
          </p>
        </motion.div>

        {/* Filter tabs */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {SECTOR_FILTERS.map((filter) => {
              const count =
                filter.value === "all"
                  ? projects.length
                  : projects.filter((p) => p.customer.type === filter.value)
                      .length;
              if (filter.value !== "all" && count === 0) return null;
              return (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter.value
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                      : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50"
                  }`}
                >
                  {filter.label}
                  <span className="ml-1.5 text-xs opacity-60">({count})</span>
                </button>
              );
            })}
          </motion.div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <Tag className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">
              Portfolio coming soon. Check back for our latest projects.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-slate-700 transition-all duration-300"
                >
                  {/* Header gradient */}
                  <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500" />

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                        {project.name}
                      </h3>
                      <span
                        className={`shrink-0 ml-3 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          project.status === "COMPLETED"
                            ? "bg-green-600/20 text-green-400 border border-green-500/20"
                            : "bg-amber-600/20 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {STATUS_LABELS[project.status] || project.status}
                      </span>
                    </div>

                    {project.description && (
                      <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                        {project.description}
                      </p>
                    )}

                    {/* Meta info */}
                    <div className="space-y-2 mb-4">
                      {project.location && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <MapPin className="h-3.5 w-3.5" />
                          {project.location}
                        </div>
                      )}
                      {project.startDate && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(project.startDate)}
                          {project.actualEndDate &&
                            ` – ${formatDate(project.actualEndDate)}`}
                        </div>
                      )}
                    </div>

                    {/* Services tags */}
                    {project.items.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.items.slice(0, 3).map((item) => (
                          <span
                            key={item.service.name}
                            className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-400"
                          >
                            {item.service.name}
                          </span>
                        ))}
                        {project.items.length > 3 && (
                          <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-500">
                            +{project.items.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Value */}
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Project Value
                      </span>
                      <span className="text-lg font-bold text-amber-400">
                        {formatValue(project.totalValue)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
