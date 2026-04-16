"use client";

import { motion } from "framer-motion";

interface TechRibbonProps {
  items?: string[];
  direction?: "rtl" | "ltr";
  angle?: number;
  speed?: number;
  className?: string;
}

const DEFAULT_TECH = [
  "React.js", "Next.js", "TypeScript", "Node.js", "MongoDB", 
  "Express.js", "Docker", "Kubernetes", "Google Cloud", 
  "Generative AI", "LangChain", "OpenAI", "GraphQL", 
  "Tailwind CSS", "Redux", "Material UI", "Firebase"
];

export default function TechRibbon({ 
  items = DEFAULT_TECH, 
  direction = "rtl", 
  angle = -2,
  speed = 25,
  className = ""
}: TechRibbonProps) {
  // Duplicate items to create a seamless infinite loop
  const duplicatedItems = [...items, ...items, ...items];
  
  const isRTL = direction === "rtl";

  return (
    <div className={`relative py-12 overflow-hidden bg-transparent ${className}`}>
      {/* Decorative Gradient Line (Top) */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
      
      {/* Rotating Marquee Container */}
      <div 
        className="flex scale-105 bg-primary-600/5 dark:bg-primary-950/20 backdrop-blur-sm py-4 border-y border-primary-500/10 dark:border-primary-500/5"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <motion.div
          className="flex whitespace-nowrap gap-12 items-center"
          animate={{
            x: isRTL ? [0, -1000] : [-1000, 0],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: speed,
              ease: "linear",
            },
          }}
        >
          {duplicatedItems.map((tech, idx) => (
            <div
              key={`${tech}-${idx}`}
              className="flex items-center gap-4 group"
            >
              <span className="text-2xl md:text-3xl font-black text-dark-900/40 dark:text-white/20 group-hover:text-primary-500 transition-colors tracking-tighter uppercase italic">
                {tech}
              </span>
              <div className="w-2 h-2 rounded-full bg-accent-rose group-hover:scale-150 transition-transform" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Gradient Line (Bottom) */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-violet/30 to-transparent" />
      
      {/* Side Blurs for smooth entry/exit */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-dark-950 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-dark-950 to-transparent z-10" />
    </div>
  );
}
