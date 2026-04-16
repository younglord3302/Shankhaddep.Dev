'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiGithub, FiExternalLink, FiCalendar } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import { trackPageView, trackClick } from '@/lib/analytics';
import { Project } from '@/types';
import { projectsApi } from "@/lib/insforge";

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView(`/projects/${params?.id}`);
    
    projectsApi.getBySlug(params?.id)
      .then((data) => {
        if (data) {
          // Map snake_case to camelCase for the template
          setProject({
            ...data,
            id: data.id,
            techStack: data.tech_stack || [],
            githubUrl: data.github_url,
            liveUrl: data.live_url,
            problem: data.problem || "",
            solution: data.solution || "",
            createdAt: data.created_at || new Date().toISOString(),
            updatedAt: data.updated_at || new Date().toISOString(),
            images: data.images || [],
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) return <div className="section min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-600"></div></div>;
  if (!project) return <div className="section min-h-screen flex flex-col items-center justify-center gap-4"><p>Project not found</p><Link href="/projects" className="btn-primary">Back to Projects</Link></div>;

  const projectImages = typeof project.images === 'string' ? JSON.parse(project.images) : project.images;
  const coverImage = projectImages && projectImages.length > 0 ? projectImages[0] : null;

  return (
    <div className="section bg-transparent min-h-screen">
      <div className="container-custom max-w-5xl">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
        >
          <FiArrowLeft size={14} /> Back to Projects
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{project.title}</h1>
                {project.featured && (
                  <span className="inline-block px-3 py-1 text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded">
                    Featured Project
                  </span>
                )}
              </div>
            </div>
            <p className="text-lg text-dark-600 dark:text-dark-400">{project.description}</p>
          </header>

          {/* Project Image */}
          <div className="h-64 md:h-[30rem] w-full rounded-2xl overflow-hidden mb-12 shadow-2xl relative group border border-dark-200 dark:border-dark-800">
            {coverImage ? (
              <Image 
                src={coverImage} 
                alt={project.title} 
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-accent-violet/20 flex items-center justify-center">
                <span className="text-white text-9xl font-black italic opacity-20 select-none">
                  {project.title.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
          </div>

          {/* Tech Stack */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech: string) => (
                <span
                  key={tech}
                  className="px-4 py-2 text-sm font-medium bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 rounded-lg"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-3">The Problem</h2>
              <p className="text-dark-600 dark:text-dark-400">{project.problem}</p>
            </div>
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-3">The Solution</h2>
              <p className="text-dark-600 dark:text-dark-400">{project.solution}</p>
            </div>
          </div>

          {/* Architecture Section */}
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Architecture & Design</h2>
            <div className="aspect-video bg-dark-100 dark:bg-dark-800 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <p className="text-4xl mb-2">🏗️</p>
                <p className="text-sm text-dark-500 dark:text-dark-500">Architecture Diagram</p>
              </div>
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown>
                {`This project was designed with **scalability** and **maintainability** in mind. 

Key architectural decisions:
- **Separation of concerns** between frontend and backend
- **API-first design** for flexibility
- **Component-based architecture** for reusability
- **Type-safe development** with TypeScript throughout`}
              </ReactMarkdown>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-4 pt-6 border-t border-dark-200 dark:border-dark-700">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick(`/projects/${params?.id}`, 'github')}
                className="btn-secondary flex items-center gap-2"
              >
                <FiGithub size={18} /> View Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick(`/projects/${params?.id}`, 'live-demo')}
                className="btn-primary flex items-center gap-2"
              >
                <FiExternalLink size={18} /> Live Demo
              </a>
            )}
          </div>
        </motion.article>
      </div>
    </div>
  );
}
