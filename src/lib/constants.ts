export const SITE_CONFIG = {
  name: "Shankhadeep Mondal",
  title: "Full Stack Software Developer | MERN Stack, Cloud & AI",
  description:
    "Full Stack Software Developer with expertise in MERN stack, RESTful APIs, Cloud Platforms (Google Cloud, IBM Cloud), DevOps (Docker, Kubernetes, CI/CD), and Generative AI.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "https://res.cloudinary.com/dgdf7uxtn/image/upload/v1776102117/logo_1_et1tyx.svg",
  logo: "https://res.cloudinary.com/dgdf7uxtn/image/upload/v1776102117/logo_1_et1tyx.svg",
  social: {
    github: "https://github.com/younglord3302",
    linkedin: "https://linkedin.com/in/younglord000",
    twitter: "https://x.com/Shankhadeep000",
    email: "shankhadeepmondal7@gmail.com",
  },
} as const;

export const NAVIGATION = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const SKILLS = [
  { name: "React.js", level: "expert" as const, category: "frontend" as const },
  { name: "Redux", level: "advanced" as const, category: "frontend" as const },
  {
    name: "HTML5/CSS3",
    level: "expert" as const,
    category: "frontend" as const,
  },
  {
    name: "JavaScript (ES6+)",
    level: "expert" as const,
    category: "frontend" as const,
  },
  {
    name: "Bootstrap/Material-UI",
    level: "advanced" as const,
    category: "frontend" as const,
  },
  { name: "Node.js", level: "advanced" as const, category: "backend" as const },
  {
    name: "Express.js",
    level: "advanced" as const,
    category: "backend" as const,
  },
  {
    name: "RESTful APIs",
    level: "expert" as const,
    category: "backend" as const,
  },
  {
    name: "GraphQL",
    level: "intermediate" as const,
    category: "backend" as const,
  },
  {
    name: "WebSockets",
    level: "intermediate" as const,
    category: "backend" as const,
  },
  { name: "SQL", level: "advanced" as const, category: "backend" as const },
  {
    name: "NoSQL (MongoDB)",
    level: "advanced" as const,
    category: "backend" as const,
  },
  {
    name: "Google Cloud",
    level: "intermediate" as const,
    category: "devops" as const,
  },
  { name: "Firebase", level: "advanced" as const, category: "devops" as const },
  {
    name: "Docker",
    level: "intermediate" as const,
    category: "devops" as const,
  },
  {
    name: "Kubernetes (AKS)",
    level: "intermediate" as const,
    category: "devops" as const,
  },
  {
    name: "CI/CD",
    level: "intermediate" as const,
    category: "devops" as const,
  },
  { name: "Git", level: "expert" as const, category: "tools" as const },
  { name: "Linux", level: "intermediate" as const, category: "tools" as const },
  {
    name: "Generative AI",
    level: "intermediate" as const,
    category: "tools" as const,
  },
  {
    name: "LangChain/OpenAI API",
    level: "intermediate" as const,
    category: "tools" as const,
  },
] as const;

export const TECH_STACK_FILTERS = [
  "React",
  "Next.js",
  "Node.js",
  "JavaScript",
  "MongoDB",
  "Docker",
  "Tailwind CSS",
  "GraphQL",
  "REST API",
  "Firebase",
  "Material-UI",
  "Bootstrap",
  "Redux",
] as const;

export const SAMPLE_PROJECTS = [
  {
    id: "1",
    _id: "1",
    title: "QKart E-Commerce",
    description:
      "A full-featured e-commerce application built with React.js and Material UI. Implements authentication, shopping cart, and checkout workflows.",
    problem:
      "Needed a modern, responsive e-commerce frontend with smooth UX for product browsing and cart management.",
    solution:
      "Built a React-based SPA with Material UI components, implemented JWT auth, shopping cart, and checkout workflows with REST API integration.",
    techStack: ["React.js", "Material UI", "REST APIs", "JavaScript"],
    githubUrl: "https://github.com/shankhadeepmondal7",
    liveUrl: "https://example.com",
    featured: true,
    createdAt: "2026-01-15",
    updatedAt: "2026-01-15",
    images: [],
  },
  {
    id: "2",
    _id: "2",
    title: "QTrip Dynamic",
    description:
      "Enhanced travel website with dynamic JavaScript features including multi-select filters, image carousels, and REST API integration for real-time adventure data.",
    problem:
      "Needed a dynamic, interactive travel booking site with real-time data and personalized user preferences.",
    solution:
      "Enhanced static site with dynamic JS features, integrated REST APIs for live data, implemented localStorage for user preferences, deployed on Heroku & Netlify.",
    techStack: ["JavaScript", "HTML5", "CSS3", "REST APIs", "Heroku"],
    githubUrl: "https://github.com/shankhadeepmondal7",
    liveUrl: "https://example.com",
    featured: true,
    createdAt: "2026-02-01",
    updatedAt: "2026-02-01",
    images: [],
  },
  {
    id: "3",
    _id: "3",
    title: "QTrip Static",
    description:
      "A responsive travel website built with HTML, CSS, and Bootstrap based on wireframe layouts. Deployed to Netlify/Vercel for seamless accessibility.",
    problem:
      "Needed a clean, responsive travel website that works across all devices with fast load times.",
    solution:
      "Designed and deployed 3 interactive web pages using Flexbox and responsive images based on wireframe layouts.",
    techStack: ["HTML5", "CSS3", "Bootstrap", "Netlify"],
    githubUrl: "https://github.com/shankhadeepmondal7",
    liveUrl: "https://example.com",
    featured: false,
    createdAt: "2026-03-01",
    updatedAt: "2026-03-01",
    images: [],
  },
];
