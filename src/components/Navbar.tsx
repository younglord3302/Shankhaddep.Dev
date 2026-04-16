"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import BrandingLogo from "@/components/BrandingLogo";
import { NAVIGATION, SITE_CONFIG } from "@/lib/constants";
import { UserButton, useAuth } from "@clerk/nextjs";
import { FiSun, FiMoon, FiMenu, FiX, FiArrowRight, FiShield } from "react-icons/fi";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <nav className="glass rounded-full px-5 py-2 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-2xl dark:shadow-primary-500/10 border-white/80 dark:border-white/10">
        {/* Logo */}
        <Link href="/" className="hover:opacity-80 transition-opacity duration-300">
          <BrandingLogo />
        </Link>
 
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {NAVIGATION.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                pathname === item.href
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                  : "text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/50 dark:hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {isSignedIn && (
            <Link
              href="/admin/dashboard"
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                pathname === "/admin/dashboard"
                  ? "bg-green-600 text-white shadow-lg shadow-green-500/20"
                  : "text-green-600 dark:text-green-400 border border-green-500/20 hover:bg-green-500/10"
              }`}
            >
              <FiShield size={14} /> Admin
            </Link>
          )}
        </div>
 
        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="scale-90 flex items-center">
            <UserButton afterSignOutUrl="/" />
          </div>
 
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full glass hover:bg-white dark:hover:bg-white/10 transition-all duration-300 group"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <FiSun className="text-amber-400 group-hover:rotate-45 transition-transform" size={16} />
            ) : (
              <FiMoon className="text-primary-600 group-hover:-rotate-12 transition-transform" size={16} />
            )}
          </button>
 
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full glass hover:bg-white dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>
 
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="md:hidden mt-4 glass rounded-[2rem] p-6 shadow-2xl max-h-[70vh] overflow-y-auto"
        >
          <div className="flex flex-col gap-3">
            {NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-6 py-4 rounded-2xl text-lg font-bold transition-all ${
                  pathname === item.href
                    ? "bg-primary-600 text-white"
                    : "text-dark-600 dark:text-dark-300 hover:bg-white/50 dark:hover:bg-white/5"
                }`}
              >
                {item.label}
                <FiArrowRight />
              </Link>
            ))}
            {isSignedIn && (
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-6 py-4 rounded-2xl text-lg font-bold transition-all ${
                  pathname === "/admin/dashboard"
                    ? "bg-green-600 text-white"
                    : "text-green-600 dark:text-green-400 border border-green-500/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiShield size={20} />
                  Admin
                </div>
                <FiArrowRight />
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
