"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FiGithub,
  FiExternalLink,
  FiArrowRight,
  FiSearch,
  FiFilter,
  FiX,
} from "react-icons/fi";
import { projectsApi } from "@/lib/insforge";
import { useDebounce } from "@/hooks/useDebounce";
import { trackPageView, trackClick } from "@/lib/analytics";
import { SAMPLE_PROJECTS, TECH_STACK_FILTERS } from "@/lib/constants";
import { Project } from "@/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [selectedTech, setSelectedTech] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    trackPageView("/projects");
    // Fetch from InSForge API
    setLoading(true);
    projectsApi
      .getAll()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((p: any) => ({
            id: p.id,
            _id: p.id,
            title: p.title,
            description: p.description,
            techStack: p.tech_stack || [],
            githubUrl: p.github_url || "",
            liveUrl: p.live_url || "",
            images: p.images || [],
            featured: p.featured || false,
            problem: p.problem || "",
            solution: p.solution || "",
            createdAt: p.created_at || new Date().toISOString(),
            updatedAt: p.updated_at || new Date().toISOString(),
          }));
          setProjects(mapped);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesTech = !selectedTech || (project.techStack && project.techStack.includes(selectedTech));
      
      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch = !debouncedSearch || 
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        (project.techStack && project.techStack.some((t: string) => t.toLowerCase().includes(searchLower)));
        
      return matchesTech && matchesSearch;
    });
  }, [projects, selectedTech, debouncedSearch]);

  return (
    <div className="section bg-transparent min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Projects</h1>
          <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
            A collection of production-grade applications showcasing my
            engineering approach.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-12 flex flex-col md:flex-row items-center justify-center gap-3">
          <div className="relative w-full max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="text-dark-400 group-focus-within:text-primary-500 transition-colors" size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-11 pr-11 py-2.5 rounded-full border border-dark-200/50 dark:border-dark-800/50 bg-white/70 dark:bg-dark-900/70 backdrop-blur-md focus:ring-2 focus:ring-primary-500/50 shadow-sm focus:shadow-md focus:shadow-primary-500/10 transition-all outline-none text-sm placeholder:text-dark-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-dark-400 hover:text-red-500 transition-colors"
                title="Clear search"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-full transition-all shadow-sm ${
              showFilters 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                : 'bg-white/70 dark:bg-dark-900/70 backdrop-blur-md border border-dark-200/50 dark:border-dark-800/50 text-dark-700 dark:text-dark-300 hover:bg-white dark:hover:bg-dark-800 hover:border-primary-500/50'
            }`}
          >
            <FiFilter size={16} /> {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex flex-wrap justify-center gap-2 mb-12 p-6 bg-white/40 dark:bg-dark-900/40 backdrop-blur-xl rounded-[2rem] border border-dark-200/50 dark:border-dark-800/50 mx-auto max-w-4xl shadow-xl shadow-black/5"
          >
                <button
                  onClick={() => setSelectedTech("")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
                    !selectedTech
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                      : "bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700"
                  }`}
                >
                  All
                </button>
                {TECH_STACK_FILTERS.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => setSelectedTech(tech)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
                      selectedTech === tech
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                        : "bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
          </motion.div>
        )}

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.article
                key={project.id || project.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card overflow-hidden hover:shadow-lg transition-all"
              >
                {project.images && project.images.length > 0 ? (
                  <div className="h-40 w-full border-b border-dark-200 dark:border-dark-700 overflow-hidden relative group">
                    <Image 
                      src={project.images[0]} 
                      alt={project.title} 
                      fill
                      sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                      priority={i < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-primary-500/10 to-accent-violet/10 flex items-center justify-center border-b border-dark-200 dark:border-dark-700 relative">
                    <span className="text-primary-500/30 text-4xl font-black italic">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    {project.featured && (
                      <span className="px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded whitespace-nowrap">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-dark-600 dark:text-dark-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs font-medium bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Problem & Solution Preview */}
                  <div className="mb-4 p-3 bg-dark-50 dark:bg-dark-800 rounded-lg">
                    <p className="text-xs font-medium text-dark-500 dark:text-dark-500 mb-1">
                      Problem
                    </p>
                    <p className="text-xs text-dark-600 dark:text-dark-400 line-clamp-2">
                      {project.problem}
                    </p>
                  </div>

                  {/* Links */}
                  <div className="flex items-center justify-between pt-4 border-t border-dark-200 dark:border-dark-700">
                    <div className="flex gap-3">
                      {project.githubUrl && !project.githubUrl.startsWith('javascript:') && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackClick(`/projects`, `github-${project.title}`)}
                          className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          title="View Code"
                        >
                          <FiGithub size={18} />
                        </a>
                      )}
                      {project.liveUrl && !project.liveUrl.startsWith('javascript:') && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackClick(`/projects`, `live-${project.title}`)}
                          className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          title="Live Demo"
                        >
                          <FiExternalLink size={18} />
                        </a>
                      )}
                    </div>
                    <Link
                      href={`/projects/${project._id || project.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center gap-1.5 text-sm font-bold text-primary-600 dark:text-primary-400 hover:translate-x-1 transition-transform"
                    >
                      View Details <FiArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filteredProjects.length === 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-dark-50/50 dark:bg-dark-900/30 rounded-3xl border-2 border-dashed border-dark-200 dark:border-dark-800"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">No projects found</h3>
            <p className="text-dark-600 dark:text-dark-400 mb-6">
              {searchQuery 
                ? `No results for "${searchQuery}"`
                : "No projects found with the selected filters."}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTech('');
              }}
              className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
            >
              Reset All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
