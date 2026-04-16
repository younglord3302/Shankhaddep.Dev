"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SKILLS, SITE_CONFIG } from "@/lib/constants";
import {
  FiCode,
  FiDatabase,
  FiCloud,
  FiTool,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiMail,
  FiDownload,
  FiMapPin,
  FiPhone,
  FiAward,
  FiBriefcase,
  FiBookOpen,
  FiHeart,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { trackPageView } from "@/lib/analytics";
import { profileApi } from "@/lib/insforge";

const skillIcons: Record<string, React.ReactNode> = {
  frontend: <FiCode size={16} />,
  backend: <FiDatabase size={16} />,
  devops: <FiCloud size={16} />,
  tools: <FiTool size={16} />,
};

const levelColors: Record<string, string> = {
  beginner: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  intermediate:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  advanced: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  expert:
    "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
};

export default function AboutPage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    trackPageView("/about");
    profileApi.get().then(setProfile).catch(console.error);
  }, []);

  const skillsByCategory = SKILLS.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Array<(typeof SKILLS)[number]>>,
  );

  return (
    <div className="section bg-transparent min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About Me</h1>
          <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
            {profile?.title || "Full Stack Software Developer specializing in MERN stack, Cloud, and AI"}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <h2 className="text-2xl font-bold mb-4">Hello! 👋</h2>
              <div className="space-y-4 text-dark-600 dark:text-dark-400 whitespace-pre-wrap">
                {profile?.description || "I'm a Full Stack Software Developer with expertise in MERN stack, RESTful APIs, Cloud Platforms (Google Cloud, IBM Cloud), DevOps (Docker, Kubernetes, CI/CD), and Generative AI.\n\nI've worked on full stack development projects utilizing modern web technologies, building production-ready applications from concept to deployment. My experience spans e-commerce platforms, travel booking systems, and data analytics solutions.\n\nI'm a 3-star LeetCode coder with 300+ problems solved and a 1500+ rating."}
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiBriefcase className="text-primary-600" /> Experience
              </h2>
              <div className="border-l-2 border-primary-200 dark:border-dark-700 pl-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    Full Stack Developer (Trainee)
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400">
                    Crio.Do
                  </p>
                  <p className="text-dark-600 dark:text-dark-400 text-sm mt-2">
                    Worked on full stack development projects utilizing MERN
                    stack. Built production-grade applications including
                    e-commerce platforms, travel booking systems, and dynamic
                    web applications.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiBookOpen className="text-primary-600" /> Education
              </h2>
              <div className="space-y-4">
                <div className="border-l-2 border-primary-200 dark:border-dark-700 pl-6">
                  <h3 className="text-lg font-semibold">
                    B.Tech (Hons.), Computer Science & Engineering
                  </h3>
                  <p className="text-dark-600 dark:text-dark-400">
                    Neotia Institute of Technology Management and Science
                    (MAKAUT)
                  </p>
                </div>
                <div className="border-l-2 border-primary-200 dark:border-dark-700 pl-6">
                  <h3 className="text-lg font-semibold">
                    Higher Secondary (Science – PCM)
                  </h3>
                  <p className="text-dark-600 dark:text-dark-400">
                    Pathfinder Higher Secondary Public School (WBCHSE)
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiAward className="text-primary-600" /> Certifications
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Full Stack Development",
                    org: "Crio.Do (Trainee)",
                    desc: "HTML, CSS, JavaScript, ES6+, DevOps, Git, MongoDB, REST APIs, Node.js, React.js, SQL",
                  },
                  {
                    title: "Data Analytics and Visualization",
                    org: "Accenture",
                    desc: "Data Cleaning & Modeling, Data Visualization, Project Understanding",
                  },
                  {
                    title: "Back-End Engineering",
                    org: "Lyft",
                    desc: "Software Architecture, Refactoring, Unit Testing, Test-Driven Development",
                  },
                ].map((cert) => (
                  <div
                    key={cert.title}
                    className="border-l-2 border-primary-200 dark:border-dark-700 pl-6"
                  >
                    <h3 className="font-semibold">{cert.title}</h3>
                    <p className="text-primary-600 dark:text-primary-400 text-sm">
                      {cert.org}
                    </p>
                    <p className="text-dark-600 dark:text-dark-400 text-sm mt-1">
                      {cert.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6">Technical Skills</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category} className="card p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-primary-600 dark:text-primary-400">
                        {skillIcons[category]}
                      </span>
                      <h3 className="font-semibold capitalize">{category}</h3>
                    </div>
                    <div className="space-y-3">
                      {skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-dark-700 dark:text-dark-300">
                            {skill.name}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${levelColors[skill.level]}`}
                          >
                            {skill.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card p-6 text-center"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/10 dark:border-dark-800/50 shadow-xl relative">
                <Image 
                  src={profile?.avatar_url || "https://res.cloudinary.com/dgdf7uxtn/image/upload/v1775885205/WhatsApp_Image_2026-04-11_at_10.55.20_AM_gklh9b.jpg"}
                  alt={profile?.name || "Shankhadeep"}
                  fill
                  sizes="96px"
                  className="object-cover"
                  priority
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{profile?.name || SITE_CONFIG.name}</h3>
              <p className="text-sm text-dark-600 dark:text-dark-400 mb-4 line-clamp-2">
                {profile?.title || "Software Developer"}
              </p>
              <div className="flex justify-center gap-3">
                <a
                  href={profile?.github_url || SITE_CONFIG.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <FiGithub size={18} />
                </a>
                <a
                  href={profile?.linkedin_url || SITE_CONFIG.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <FiLinkedin size={18} />
                </a>
                {(profile?.twitter_url || SITE_CONFIG.social.twitter) && (
                  <a
                    href={profile?.twitter_url || SITE_CONFIG.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <FiTwitter size={18} />
                  </a>
                )}
                <a
                  href={`mailto:${profile?.email_url || SITE_CONFIG.social.email}`}
                  className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <FiMail size={18} />
                </a>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="card p-6"
            >
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <FiMail
                    size={16}
                    className="text-primary-600 dark:text-primary-400"
                  />
                  <a
                    href={`mailto:${SITE_CONFIG.social.email}`}
                    className="text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {SITE_CONFIG.social.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone
                    size={16}
                    className="text-primary-600 dark:text-primary-400"
                  />
                  <span className="text-dark-600 dark:text-dark-400">
                    +91 8420011603
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FiMapPin
                    size={16}
                    className="text-primary-600 dark:text-primary-400"
                  />
                  <span className="text-dark-600 dark:text-dark-400">
                    Bengaluru, Karnataka
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Awards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="card p-6"
            >
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <FiAward
                  size={16}
                  className="text-primary-600 dark:text-primary-400"
                />{" "}
                Awards
              </h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-dark-50 dark:bg-dark-800 rounded-lg">
                  <p className="font-medium text-dark-900 dark:text-dark-100">
                    3-Star on LeetCode
                  </p>
                  <p className="text-dark-600 dark:text-dark-400 text-xs mt-1">
                    300+ problems solved, 1500+ rating
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Languages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="card p-6"
            >
              <h4 className="font-semibold mb-4">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {["English", "Hindi", "Bengali"].map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1.5 text-sm bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 rounded-full"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Interests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="card p-6"
            >
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <FiHeart
                  size={16}
                  className="text-primary-600 dark:text-primary-400"
                />{" "}
                Interests
              </h4>
              <div className="flex flex-wrap gap-2">
                {["Table Tennis", "Drawing", "Basketball"].map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1.5 text-sm bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Resume Download */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <a 
                href="/api/download-resume"
                download="Shankhadeep_Resume.pdf"
                className="btn-primary w-full flex items-center justify-center gap-2"
                onClick={(e) => {
                  if (!profile?.resume_url) {
                    e.preventDefault();
                    alert("Resume not uploaded yet!");
                  }
                }}
              >
                <FiDownload size={18} /> Download Resume
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
