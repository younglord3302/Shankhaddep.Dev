"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FiArrowRight,
  FiGithub,
  FiExternalLink,
  FiCode,
  FiDatabase,
  FiCloud,
} from "react-icons/fi";
import { projectsApi, profileApi } from "@/lib/insforge";
import { SAMPLE_PROJECTS } from "@/lib/constants";
import { trackPageView, trackClick } from "@/lib/analytics";
import { useEffect, useState, Suspense, lazy } from "react";
import dynamic from "next/dynamic";

const TechRibbon = dynamic(() => import("@/components/TechRibbon"), { ssr: false });

export default function HomePage() {

  const [projects, setProjects] = useState(SAMPLE_PROJECTS);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    trackPageView("/");
    profileApi.get().then(setProfile).catch(() => {});
    projectsApi.getAll().then((data) => {
      if (data && data.length > 0) {
        const mapped = data.map((p: any) => ({
          id: p.id,
          _id: p.id,
          title: p.title,
          description: p.description,
          problem: p.problem || "",
          solution: p.solution || "",
          techStack: p.tech_stack || [],
          githubUrl: p.github_url || "",
          liveUrl: p.live_url || "",
          images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []),
          featured: p.featured || false,
          createdAt: p.created_at || new Date().toISOString(),
          updatedAt: p.updated_at || new Date().toISOString(),
        }));
        setProjects(mapped);
      }
    }).catch((err) => console.error("Failed fetching projects:", err));
  }, []);

  return (
    <div className="flex flex-col">
      {/* ... Hero Section ... */}
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-24 pb-12 overflow-hidden">
        {/* Dynamic Background Blobs */}
        <div className="absolute inset-0 -z-10 bg-transparent overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-primary-500/5 dark:bg-primary-500/10 blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[20%] right-[10%] w-[35%] h-[35%] rounded-full bg-accent-violet/5 dark:bg-accent-violet/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-glow opacity-30 dark:opacity-50" />
        </div>

        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-primary-500/30 dark:border-primary-500/20 mb-10"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold text-dark-800 dark:text-dark-200 uppercase tracking-widest">
                Available for new opportunities
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tighter text-dark-900 dark:text-white"
            >
              Crafting Digital <br className="hidden sm:block" />
              <span className="gradient-text">Experiences</span> with Code
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-dark-600 dark:text-dark-400 mb-10 leading-relaxed font-medium"
            >
              I'm <span className="text-dark-900 dark:text-white font-bold">Shankhadeep</span>. Full Stack Software Developer focused on building high-performance web applications that solve complex problems.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                href="/projects"
                className="btn-primary flex items-center justify-center gap-3 text-base group"
              >
                View Selected Works 
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="btn-secondary text-base">
                Let's Discuss Project
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack Icons */}
      <section className="py-12 bg-transparent border-y border-dark-200/50 dark:border-dark-800/50 relative z-10">
        <div className="container-custom">
          <p className="text-center text-sm font-bold text-dark-500 dark:text-dark-500 mb-8 uppercase tracking-widest">
            Technologies I work with daily
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-12">
            <TechBadge delay={0.4}>React.js</TechBadge>
            <TechBadge delay={0.45}>Node.js</TechBadge>
            <TechBadge delay={0.5}>JS</TechBadge>
            <TechBadge delay={0.55}>MongoDB</TechBadge>
            <TechBadge delay={0.6}>Docker</TechBadge>
            <TechBadge delay={0.65}>GCP</TechBadge>
            <TechBadge delay={0.7}>Gen-AI</TechBadge>
          </div>
        </div>
      </section>

      {/* Interactive Visual (Replaced 3D with 2D for Performance) */}
      <section className="section bg-transparent pt-0 relative z-10">
        <div className="container-custom">
          <div className="flex flex-col items-center justify-center mb-16 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full max-w-5xl p-8 rounded-[2.5rem] glass border border-primary-500/10 shadow-2xl overflow-hidden relative group"
            >
              {/* Abstract Background for the replacement */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-500/5 to-accent-violet/5 opacity-50" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[80px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider">
                    Full Stack Excellence
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                    Building the <span className="gradient-text">Future</span> of Web Apps
                  </h2>
                  <p className="text-dark-600 dark:text-dark-400 leading-relaxed font-medium">
                    I architect high-performance systems using the <strong>MERN</strong> stack, 
                    optimized for speed, security, and scalability. From fluid 3D interfaces 
                    to robust backend pipelines, every line of code is written with precision.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-10 bg-primary-500 rounded-full" />
                      <div>
                        <p className="text-xl font-bold">99%</p>
                        <p className="text-[10px] uppercase font-bold text-dark-500">Performance</p>
                      </div>
                    </div>
                    <div className="w-px h-10 bg-dark-200 dark:bg-dark-800 mx-2" />
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-10 bg-green-500 rounded-full" />
                      <div>
                        <p className="text-xl font-bold">Zero</p>
                        <p className="text-[10px] uppercase font-bold text-dark-500">Downtime</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 w-full flex justify-center">
                  <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-2 border-dashed border-primary-500/20 rounded-full"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-8 border border-primary-500/40 rounded-full"
                    />
                    <div className="relative z-10 p-6 bg-white dark:bg-dark-900 rounded-[2rem] shadow-xl border border-primary-500/20">
                      <FiCode className="w-16 h-16 md:w-20 md:h-20 text-primary-500 animate-pulse-slow" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Featured Projects
            </h2>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              Real-world applications that solve real problems with
              production-grade architecture.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project, i) => (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group card flex flex-col h-full overflow-hidden hover:shadow-xl transition-all duration-300"
                onClick={() => trackClick("/", `project-${project.title}`)}
              >
                {/* Shorter Image Section */}
                {project.images && project.images.length > 0 ? (
                  <div className="h-40 w-full overflow-hidden relative border-b border-dark-200 dark:border-dark-700">
                    <Image 
                      src={project.images[0]} 
                      alt={project.title} 
                      fill
                      sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                      priority={i < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <div className="h-40 w-full bg-gradient-to-br from-primary-500/20 to-accent-violet/20 flex items-center justify-center border-b border-dark-200 dark:border-dark-700">
                    <span className="text-3xl font-black text-primary-500/30">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}
                
                <div className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <div className="bg-primary-500/10 text-primary-600 dark:text-primary-400 p-1.5 rounded-full">
                        <FiExternalLink size={14} />
                      </div>
                    )}
                  </div>
                  <p className="text-dark-600 dark:text-dark-400 text-sm mb-4 flex-grow leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.slice(0, 4).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-semibold bg-white/50 dark:bg-white/5 border border-dark-200/50 dark:border-white/5 rounded-full text-dark-700 dark:text-dark-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-dark-200/50 dark:border-white/5">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-semibold text-dark-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <FiGithub size={18} /> Source
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-semibold text-dark-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <FiExternalLink size={18} /> Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link
              href="/projects"
              className="btn-primary inline-flex items-center gap-2"
            >
              View All Projects <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>



      {/* Tech Ribbon Marquee */}
      <div className="py-4 opacity-50 hover:opacity-100 transition-opacity">
        <TechRibbon />
      </div>

      {/* How I Build */}
      <section className="pt-16 pb-12 bg-transparent border-t border-dark-200/50 dark:border-dark-800/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">How I Build</h2>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              My approach to designing and engineering production-ready systems.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<FiCode size={24} />}
              title="MERN Stack Expertise"
              description="Full stack development with MongoDB, Express.js, React, and Node.js for modern web applications."
              delay={0}
            />
            <ServiceCard 
              icon={<FiDatabase size={24} />}
              title="RESTful APIs & GraphQL"
              description="Designing scalable API architectures with proper authentication, validation, and performance optimization."
              delay={0.1}
            />
            <ServiceCard 
              icon={<FiCloud size={24} />}
              title="Cloud & DevOps"
              description="Deploying with Docker, Kubernetes, CI/CD pipelines on Google Cloud and IBM Cloud platforms."
              delay={0.2}
            />
          </div>
        </div>
      </section>
      {/* Tech Ribbon Marquee (Secondary - LTR) */}
      <TechRibbon 
        direction="ltr" 
        angle={2} 
        speed={35}
        items={[
          "PostgreSQL", "InSForge", "Clerk Auth", "Resend", 
          "Cloudinary", "Vercel", "Prisma", "Zod", 
          "Framer Motion", "Lucide Icons", "REST API", "JWT"
        ]}
        className="-mt-8 mb-0"
      />

      {/* Why InSForge */}
      <section className="pb-12 pt-4 bg-transparent">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Why I Use InSForge
            </h2>
            <p className="text-dark-600 dark:text-dark-400 mb-8">
              I chose InSForge as the backend for this portfolio to demonstrate
              my ability to design systems using modern Backend-as-a-Service
              platforms. This approach allowed me to:
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="p-4 bg-white/80 dark:bg-dark-800/80 rounded-lg">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  60%
                </p>
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  Faster development time
                </p>
              </div>
              <div className="p-4 bg-white/80 dark:bg-dark-800/80 rounded-lg">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  Zero
                </p>
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  Backend infrastructure to manage
                </p>
              </div>
              <div className="p-4 bg-white/80 dark:bg-dark-800/80 rounded-lg">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  100%
                </p>
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  Focus on product features
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-12 pb-24 bg-transparent">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center flex flex-col items-center"
          >
            {/* Vertical Rectangle Avatar (Responsive) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-48 h-64 md:w-64 md:h-[22rem] mb-10 rounded-3xl overflow-hidden border-4 border-white/30 dark:border-dark-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(34,197,94,0.1)] relative group"
            >
              <Image 
                src={profile?.avatar_url || "https://res.cloudinary.com/dgdf7uxtn/image/upload/v1775885205/WhatsApp_Image_2026-04-11_at_10.55.20_AM_gklh9b.jpg"}
                alt={profile?.name || "Shankhadeep"}
                fill
                priority
                sizes="(max-width: 768px) 192px, 256px"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>

            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Let's Work Together
            </h2>
            <p className="text-dark-600 dark:text-dark-400 mb-8">
              Whether you need a full-stack developer for your team or want to
              build something amazing together, I'd love to hear from you.
            </p>
            <Link
              href="/contact"
              className="btn-primary inline-flex items-center gap-2"
            >
              Get In Touch <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function TechBadge({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="px-4 py-2 text-xs font-bold text-dark-800 dark:text-dark-200 glass rounded-xl border border-white/60 dark:border-white/10"
    >
      {children}
    </motion.div>
  );
}

function ServiceCard({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="text-center p-6"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-dark-600 dark:text-dark-400 text-sm">
        {description}
      </p>
    </motion.div>
  );
}
