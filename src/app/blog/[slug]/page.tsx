'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar, FiTag, FiClock, FiArrowLeft } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';
import { blogsApi } from '@/lib/insforge';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView(`/blog/${params?.slug}`);
    
    blogsApi.getBySlug(params?.slug)
      .then((data) => {
        if (data) {
          setPost({
            ...data,
            coverImage: data.cover_image,
            createdAt: new Date(data.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            readTime: `${Math.ceil((data.content?.split(' ').length || 200) / 200)} min read`
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params?.slug]);

  if (loading) return <div className="section min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-600"></div></div>;
  if (!post) return <div className="section min-h-screen flex flex-col items-center justify-center gap-4"><p>Article not found</p><Link href="/blog" className="btn-primary">Back to Blog</Link></div>;

  return (
    <div className="section bg-transparent min-h-screen">
      <div className="container-custom max-w-4xl">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
        >
          <FiArrowLeft size={14} /> Back to Blog
        </Link>

        {/* Post Header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm font-medium bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 rounded-full flex items-center gap-1"
                >
                  <FiTag size={12} /> {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex items-center gap-6 text-sm text-dark-500 dark:text-dark-500">
              <span className="flex items-center gap-1">
                <FiCalendar size={14} /> {post.createdAt}
              </span>
              <span className="flex items-center gap-1">
                <FiClock size={14} /> {post.readTime}
              </span>
            </div>
          </header>

          {/* Cover Image */}
          <div className="h-64 md:h-96 w-full rounded-2xl overflow-hidden mb-12 shadow-2xl relative group border border-dark-200 dark:border-dark-800">
            {post.coverImage ? (
              <Image 
                src={post.coverImage} 
                alt={post.title} 
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-accent-violet/20 flex items-center justify-center">
                <span className="text-white text-8xl opacity-30 select-none">📝</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-2xl md:text-3xl font-bold mt-8 mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg md:text-xl font-semibold mt-4 mb-2">{children}</h3>,
                p: ({ children }) => <p className="text-dark-600 dark:text-dark-400 mb-4 leading-relaxed">{children}</p>,
                code: ({ className, children }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="px-1.5 py-0.5 bg-dark-100 dark:bg-dark-800 rounded text-sm font-mono">{children}</code>
                  ) : (
                    <pre className="p-4 bg-dark-100 dark:bg-dark-800 rounded-lg overflow-x-auto text-sm font-mono">
                      <code>{children}</code>
                    </pre>
                  );
                },
                ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-dark-600 dark:text-dark-400">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-dark-600 dark:text-dark-400">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary-500 pl-4 py-2 my-4 italic text-dark-600 dark:text-dark-400">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
