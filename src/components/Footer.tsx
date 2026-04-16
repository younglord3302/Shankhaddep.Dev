"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import BrandingLogo from "@/components/BrandingLogo";
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from "react-icons/fi";
import { profileApi } from "@/lib/insforge";

export default function Footer() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    profileApi.get().then(setProfile).catch(() => {});
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent border-t border-dark-200/50 dark:border-dark-800/50">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <BrandingLogo className="mb-3" />
            <p className="text-dark-600 dark:text-dark-400 text-sm">
              {profile?.description || "Full Stack Software Developer & Engineer."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-dark-900 dark:text-dark-100 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/projects"
                  className="text-sm text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/dashboard"
                  className="text-sm text-dark-500/50 dark:text-dark-500/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-dark-900 dark:text-dark-100 mb-3">
              Connect
            </h4>
            <div className="flex gap-3">
              <a
                href={profile?.github_url || SITE_CONFIG.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="GitHub"
              >
                <FiGithub size={20} />
              </a>
              <a
                href={profile?.linkedin_url || SITE_CONFIG.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={20} />
              </a>
              {(profile?.twitter_url || SITE_CONFIG.social.twitter) && (
                <a
                  href={profile?.twitter_url || SITE_CONFIG.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  aria-label="Twitter"
                >
                  <FiTwitter size={20} />
                </a>
              )}
              <a
                href={`mailto:${profile?.email_url || SITE_CONFIG.social.email}`}
                className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Email"
              >
                <FiMail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-dark-200/50 dark:border-dark-800/50 text-center">
          <p className="text-sm text-dark-600 dark:text-dark-400 mb-2">
            © {currentYear} {profile?.name || "Shankhadeep Mondal"}. Built with Next.js and InSForge.
          </p>
          <div className="text-xs font-bold text-dark-500 tracking-widest uppercase">
            designed by <span className="text-green-400 animate-pulse-slow drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] dark:drop-shadow-[0_0_12px_rgba(34,197,94,1)]">{"{"}</span>
            <span className="mx-1 text-dark-900 dark:text-dark-100">shankhadeep</span>
            <span className="text-green-400 animate-pulse-slow drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] dark:drop-shadow-[0_0_12px_rgba(34,197,94,1)]">{"}"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
