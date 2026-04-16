'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar, FiTag, FiArrowRight, FiSearch, FiX, FiFileText } from 'react-icons/fi';
import { trackPageView } from '@/lib/analytics';
import { blogsApi } from '@/lib/insforge';
import { useDebounce } from '@/hooks/useDebounce';

// Keep fallback sample data in case of fetch failure
const SAMPLE_BLOGS = [
  {
    id: '1',
    title: 'Why I Chose InSForge for My Portfolio Backend',
    slug: 'why-i-chose-insforge',
    excerpt: 'A deep dive into my decision to use Backend-as-a-Service and how it accelerated my development.',
    tags: ['Architecture', 'InSForge', 'BaaS'],
    coverImage: '',
    createdAt: '2026-04-01',
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'Building Scalable APIs: Lessons from Production',
    slug: 'building-scalable-apis',
    excerpt: 'Key insights from designing and maintaining APIs that handle millions of requests.',
    tags: ['API Design', 'Backend', 'Scaling'],
    coverImage: '',
    createdAt: '2026-03-15',
    readTime: '8 min read',
  },
  {
    id: '3',
    title: 'The Architecture Behind Modern Web Apps',
    slug: 'architecture-modern-web-apps',
    excerpt: 'Understanding the patterns and principles that drive successful web application architecture.',
    tags: ['Architecture', 'Web Development'],
    coverImage: '',
    createdAt: '2026-03-01',
    readTime: '6 min read',
  },
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState("");
  const [showTags, setShowTags] = useState(false);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    trackPageView('/blog');
    
    // Fetch from InSForge API
    blogsApi.getAll()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((b: any) => ({
             id: b.id,
             title: b.title,
             slug: b.slug,
             excerpt: b.excerpt,
             tags: b.tags || [],
             coverImage: b.cover_image || '',
             createdAt: new Date(b.created_at).toISOString().split('T')[0],
             readTime: `${Math.ceil((b.content?.split(' ').length || 200) / 200)} min read`
          }));
          setBlogs(mapped);
        } else {
          setBlogs(SAMPLE_BLOGS);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch blogs:", err);
        setBlogs(SAMPLE_BLOGS);
      })
      .finally(() => setLoading(false));
  }, []);

  const allTags = useMemo(() => Array.from(new Set(blogs.flatMap((b) => b.tags || []))), [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesTag = !selectedTag || (blog.tags && blog.tags.includes(selectedTag));
      
      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch = !debouncedSearch || 
        blog.title.toLowerCase().includes(searchLower) ||
        blog.excerpt.toLowerCase().includes(searchLower) ||
        (blog.tags && blog.tags.some((t: string) => t.toLowerCase().includes(searchLower)));
        
      return matchesTag && matchesSearch;
    });
  }, [blogs, selectedTag, debouncedSearch]);

  return (
    <div className="section bg-transparent min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog</h1>
          <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
            Thoughts on engineering, architecture, and building software that matters.
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
              placeholder="Search articles..."
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
            onClick={() => setShowTags(!showTags)}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-full transition-all shadow-sm ${
              showTags 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                : 'bg-white/70 dark:bg-dark-900/70 backdrop-blur-md border border-dark-200/50 dark:border-dark-800/50 text-dark-700 dark:text-dark-300 hover:bg-white dark:hover:bg-dark-800 hover:border-primary-500/50'
            }`}
          >
            <FiTag size={16} /> {showTags ? 'Hide Topics' : 'Topics'}
          </button>
        </div>

        {showTags && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex flex-wrap justify-center gap-2 mb-12 p-6 bg-white/40 dark:bg-dark-900/40 backdrop-blur-xl rounded-[2rem] border border-dark-200/50 dark:border-dark-800/50 mx-auto max-w-4xl shadow-xl shadow-black/5"
          >
            <button
              onClick={() => setSelectedTag('')}
              className={`px-4 py-2 text-[10px] font-black rounded-lg uppercase tracking-widest transition-all ${
                !selectedTag
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                  : "bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 text-[10px] font-black rounded-lg uppercase tracking-widest transition-all ${
                  selectedTag === tag
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                    : "bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredBlogs.map((blog, i) => (
              <motion.article
                key={blog.id || blog.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card group flex flex-col h-full overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Blog Image */}
                <Link href={`/blog/${blog.slug}`} className="block relative h-48 overflow-hidden">
                  {blog.coverImage ? (
                    <Image 
                      src={blog.coverImage} 
                      alt={blog.title} 
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-accent-violet/20 flex items-center justify-center">
                      <FiFileText className="text-primary-500/30 w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-dark-500 mb-3">
                    <span className="flex items-center gap-1">
                      <FiCalendar size={12} /> {blog.createdAt}
                    </span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>

                  <Link href={`/blog/${blog.slug}`}>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="text-dark-600 dark:text-dark-400 text-sm mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-dark-100 dark:border-dark-800">
                    <div className="flex flex-wrap gap-2">
                       {blog.tags.slice(0, 2).map((tag: string) => (
                         <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-dark-500 dark:text-dark-500 bg-dark-50 dark:bg-dark-900/50 px-2 py-0.5 rounded">
                           {tag}
                         </span>
                       ))}
                    </div>
                    <Link 
                      href={`/blog/${blog.slug}`} 
                      className="text-primary-600 dark:text-primary-400 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Read <FiArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filteredBlogs.length === 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-dark-50/50 dark:bg-dark-900/30 rounded-3xl border-2 border-dashed border-dark-200 dark:border-dark-800"
          >
            <div className="text-5xl mb-4">✍️</div>
            <h3 className="text-xl font-bold mb-2">No articles found</h3>
            <p className="text-dark-600 dark:text-dark-400 mb-6">
              {searchQuery 
                ? `No results for "${searchQuery}"`
                : "No articles found matching this tag."}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('');
              }}
              className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
            >
              View all articles
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
