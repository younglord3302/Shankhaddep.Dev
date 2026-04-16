export interface Project {
  id: string;
  _id?: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  images: string[];
  architectureDiagram?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: string;
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags: string[];
  coverImage?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id?: string;
  email: string;
  password: string;
  role: 'admin';
  createdAt: string;
}

export interface Contact {
  _id?: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface Analytics {
  _id?: string;
  eventType: 'view' | 'click';
  page: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface About {
  headline: string;
  bio: string;
  currentFocus: string;
  skills: Skill[];
  socialLinks: SocialLinks;
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'frontend' | 'backend' | 'devops' | 'tools';
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}
