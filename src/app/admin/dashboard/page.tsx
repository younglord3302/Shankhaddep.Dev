"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAuth, UserButton } from "@clerk/nextjs";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiFolder,
  FiFileText,
  FiMail,
  FiBarChart2,
  FiUser,
  FiSearch,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";
import {
  projectsApi,
  blogsApi,
  contactApi,
  analyticsApi,
  profileApi,
} from "@/lib/insforge";
import { useDebounce } from "@/hooks/useDebounce";
import { SAMPLE_PROJECTS } from "@/lib/constants";
import Modal from "@/components/admin/Modal";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "projects" | "blogs" | "contacts" | "analytics" | "profile"
  >("projects");
  const [projects, setProjects] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingBlog, setEditingBlog] = useState<any>(null);

  const [contactSearch, setContactSearch] = useState("");
  const [refreshingContacts, setRefreshingContacts] = useState(false);
  const debouncedContactSearch = useDebounce(contactSearch, 300);

  const filteredContacts = useMemo(() => {
    if (!debouncedContactSearch) return contacts;
    const lowerSearch = debouncedContactSearch.toLowerCase();
    return contacts.filter(c => 
      c.name.toLowerCase().includes(lowerSearch) || 
      c.email.toLowerCase().includes(lowerSearch) || 
      c.message.toLowerCase().includes(lowerSearch)
    );
  }, [contacts, debouncedContactSearch]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }
    if (isSignedIn) {
      loadData();
    }
  }, [isLoaded, isSignedIn, router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projectsData, blogsData, contactsData, analyticsData, profileData] =
        await Promise.all([
          projectsApi.getAll().catch(() => []),
          blogsApi.getAll().catch(() => []),
          contactApi.getAll().catch(() => []),
          analyticsApi.getStats().catch(() => null),
          profileApi.get().catch(() => null),
        ]);
      setProjects(projectsData.length > 0 ? projectsData : SAMPLE_PROJECTS);
      setBlogs(blogsData);
      setContacts(contactsData);
      setAnalytics(analyticsData);
      setProfile(profileData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setProjects(SAMPLE_PROJECTS);
    } finally {
      setLoading(false);
    }
  };

  // Project CRUD
  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      let token;
      try {
        token = (await getToken({ template: "insforge" })) || undefined;
      } catch (e) {}
      await projectsApi.delete(id, token);
      setProjects(projects.filter((p) => (p.id || p._id || p.title) !== id));
    } catch {
      // InSForge unavailable, fall back to local state
      setProjects(projects.filter((p) => (p.id || p._id || p.title) !== id));
    }
  };

  const handleSaveProject = async (data: any) => {
    try {
      let token;
      try {
        token = (await getToken({ template: "insforge" })) || undefined;
      } catch (e) {
        console.warn("Clerk JWT template 'insforge' not found, falling back to Admin API Key.");
      }
      if (editingProject) {
        await projectsApi.update(editingProject.id || editingProject._id, data, token);
        setProjects(
          projects.map((p) =>
            (p.id || p._id) === (editingProject.id || editingProject._id) ? { ...p, ...data } : p,
          ),
        );
      } else {
        const newProject = await projectsApi.create(data, token);
        setProjects([newProject[0] || newProject, ...projects]);
      }
    } catch (err) {
      console.error("Dashboard error handler caught:", err);
      // InSForge unavailable, fall back to local state
      if (editingProject) {
        setProjects(
          projects.map((p) =>
            (p.id || p._id) === (editingProject.id || editingProject._id) ? { ...p, ...data } : p,
          ),
        );
      } else {
        const newProject = {
          ...data,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        setProjects([newProject, ...projects]);
      }
    } finally {
      setShowProjectModal(false);
      setEditingProject(null);
    }
  };

  // Blog CRUD
  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      let token;
      try {
        token = (await getToken({ template: "insforge" })) || undefined;
      } catch (e) {}
      await blogsApi.delete(id, token);
      setBlogs(blogs.filter((b) => (b.id || b._id) !== id));
    } catch {
      setBlogs(blogs.filter((b) => (b.id || b._id) !== id));
    }
  };

  const handleSaveBlog = async (data: any) => {
    try {
      let token;
      try {
        token = (await getToken({ template: "insforge" })) || undefined;
      } catch (e) {
        console.warn("Clerk JWT template 'insforge' not found, falling back to Admin API Key.");
      }
      if (editingBlog) {
        await blogsApi.update(editingBlog.id || editingBlog._id, data, token);
        setBlogs(
          blogs.map((b) => ((b.id || b._id) === (editingBlog.id || editingBlog._id) ? { ...b, ...data } : b)),
        );
      } else {
        const newBlog = await blogsApi.create(data, token);
        setBlogs([newBlog[0] || newBlog, ...blogs]);
      }
    } catch {
      if (editingBlog) {
        setBlogs(
          blogs.map((b) => ((b.id || b._id) === (editingBlog.id || editingBlog._id) ? { ...b, ...data } : b)),
        );
      } else {
        const slug =
          data.slug ||
          data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        const newBlog = {
          ...data,
          slug,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        setBlogs([newBlog, ...blogs]);
      }
    } finally {
      setShowBlogModal(false);
      setEditingBlog(null);
    }
  };

  const handleSaveProfile = async (data: any) => {
    try {
      let token;
      try {
        token = (await getToken({ template: "insforge" })) || undefined;
      } catch (e) {
        console.warn("Clerk JWT template 'insforge' not found, proceeding without token.");
      }
      const profileId = profile?.id || profile?._id;
      console.log("Saving profile. ID:", profileId, "Token present:", !!token, "Data:", data);
      if (!profileId) {
        console.error("No profile ID found — cannot update.");
        alert("Profile ID missing. Cannot save.");
        return;
      }
      await profileApi.update(profileId, data, token);
      setProfile({ ...profile, ...data });
      alert("Profile updated successfully!");
    } catch (err: any) {
      console.error("Error saving profile:", err?.message || err);
      alert(`Error saving profile: ${err?.message || "Unknown error"}`);
    }
  };

  const handleRefreshContacts = async () => {
    setRefreshingContacts(true);
    try {
      const fresh = await contactApi.getAll();
      setContacts(fresh);
    } catch (err) {
      console.error("Refresh contacts failed:", err);
    } finally {
      setRefreshingContacts(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await contactApi.delete(id);
      setContacts(contacts.filter((c: any) => (c.id || c._id) !== id));
    } catch (err) {
      console.error("Delete contact failed:", err);
      alert("Failed to delete inquiry");
    }
  };

  const tabs = [
    {
      id: "projects" as const,
      label: "Projects",
      icon: <FiFolder size={18} />,
      count: projects.length,
    },
    {
      id: "blogs" as const,
      label: "Blogs",
      icon: <FiFileText size={18} />,
      count: blogs.length,
    },
    {
      id: "contacts" as const,
      label: "Contacts",
      icon: <FiMail size={18} />,
      count: contacts.length,
    },
    {
      id: "analytics" as const,
      label: "Analytics",
      icon: <FiBarChart2 size={18} />,
    },
    {
      id: "profile" as const,
      label: "Profile Options",
      icon: <FiUser size={18} />,
    },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="glass border-b border-dark-200/50 dark:border-dark-800/50 px-6 py-3 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold neon-text-green">Admin Dashboard</h1>
            <p className="text-sm text-dark-600 dark:text-dark-400">
              Manage your portfolio content
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              View Site →
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-60 min-h-[calc(100vh-65px)] glass border-r border-dark-200/50 dark:border-dark-800/50 p-4 sticky top-[65px]">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                    : "text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800"
                }`}
              >
                <span className="flex items-center gap-3">
                  {tab.icon}
                  {tab.label}
                </span>
                {tab.count !== undefined && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-dark-100 dark:bg-dark-800">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-dark-500 dark:text-dark-400">Loading...</p>
            </div>
          ) : (
            <>
              {/* Projects Tab */}
              {activeTab === "projects" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">
                      Projects ({projects.length})
                    </h2>
                    <button
                      onClick={() => {
                        setEditingProject(null);
                        setShowProjectModal(true);
                      }}
                      className="btn-primary flex items-center gap-2"
                    >
                      <FiPlus size={18} /> Add Project
                    </button>
                  </div>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <motion.div
                        key={project._id || project.title}
                        layout
                        className="card p-4 flex items-start justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{project.title}</h3>
                            {project.featured && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-dark-600 dark:text-dark-400 line-clamp-1">
                            {project.description}
                          </p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {(project.techStack || [])
                              .slice(0, 5)
                              .map((tech: string) => (
                                <span
                                  key={tech}
                                  className="px-2 py-0.5 text-xs bg-dark-100 dark:bg-dark-800 rounded"
                                >
                                  {tech}
                                </span>
                              ))}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              setEditingProject(project);
                              setShowProjectModal(true);
                            }}
                            className="p-2 rounded-lg text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteProject(project.id || project._id || project.title)
                            }
                            className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blogs Tab */}
              {activeTab === "blogs" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">
                      Blog Posts ({blogs.length})
                    </h2>
                    <button
                      onClick={() => {
                        setEditingBlog(null);
                        setShowBlogModal(true);
                      }}
                      className="btn-primary flex items-center gap-2"
                    >
                      <FiPlus size={18} /> New Post
                    </button>
                  </div>
                  {blogs.length === 0 ? (
                    <div className="card p-8 text-center">
                      <p className="text-dark-600 dark:text-dark-400 mb-2">
                        No blog posts yet.
                      </p>
                      <button
                        onClick={() => setShowBlogModal(true)}
                        className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline"
                      >
                        Create your first post →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {blogs.map((blog) => (
                        <motion.div
                          key={blog._id}
                          layout
                          className="card p-4 flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{blog.title}</h3>
                              {blog.published ? (
                                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded">
                                  Published
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded">
                                  Draft
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-dark-600 dark:text-dark-400 line-clamp-1">
                              {blog.excerpt || blog.content?.substring(0, 100)}
                            </p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {(blog.tags || [])
                                .slice(0, 5)
                                .map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 text-xs bg-dark-100 dark:bg-dark-800 rounded"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => {
                                setEditingBlog(blog);
                                setShowBlogModal(true);
                              }}
                              className="p-2 rounded-lg text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog.id || blog._id)}
                              className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Contacts Tab */}
              {activeTab === "contacts" && (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold">Inquiries ({filteredContacts.length})</h2>
                      <button
                        onClick={handleRefreshContacts}
                        disabled={refreshingContacts}
                        title="Refresh contacts"
                        className="p-1.5 rounded-lg text-dark-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all disabled:opacity-50"
                      >
                        <FiRefreshCw size={15} className={refreshingContacts ? "animate-spin" : ""} />
                      </button>
                    </div>
                    
                    <div className="relative w-full md:w-72 group">
                      <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-500 transition-colors" size={14} />
                      <input
                        type="text"
                        value={contactSearch}
                        onChange={(e) => setContactSearch(e.target.value)}
                        placeholder="Search inquiries..."
                        className="w-full pl-10 pr-10 py-2 rounded-full border border-dark-200/50 dark:border-dark-800/50 bg-white dark:bg-dark-900 focus:ring-2 focus:ring-primary-500/50 shadow-sm transition-all outline-none text-sm placeholder:text-dark-400"
                      />
                      {contactSearch && (
                        <button 
                          onClick={() => setContactSearch('')}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-red-500 transition-colors"
                        >
                          <FiX size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {filteredContacts.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-dark-200 dark:border-dark-800 rounded-2xl">
                      <div className="text-4xl mb-4 opacity-20">📭</div>
                      <p className="text-dark-500 font-medium mb-4">
                        {contactSearch ? `No inquiries match "${contactSearch}"` : "No inquiries yet."}
                      </p>
                      {contactSearch && (
                        <button
                          onClick={() => setContactSearch("")}
                          className="px-4 py-2 text-xs font-bold bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-700 transition-all border border-dark-200 dark:border-dark-700"
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredContacts.map((contact: any) => (
                        <motion.div
                          key={contact._id || contact.created_at}
                          layout
                          className="card p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{contact.name}</h3>
                              <a
                                href={contact.email && !contact.email.startsWith('javascript:') ? `mailto:${contact.email}` : '#'}
                                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                              >
                                {contact.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-dark-500">
                                {new Date(contact.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                              <button
                                onClick={() => handleDeleteContact(contact.id || contact._id)}
                                className="p-1.5 rounded-lg text-dark-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                title="Delete Inquiry"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <p className="text-dark-700 dark:text-dark-300 mt-2 whitespace-pre-wrap">
                            {contact.message}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">
                    Analytics Overview
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="card p-4">
                      <p className="text-xs text-dark-500 uppercase tracking-widest font-bold mb-1">
                        Total Page Views
                      </p>
                      <p className="text-2xl font-black text-green-500">
                        {analytics?.totalViews?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <div className="card p-4">
                      <p className="text-xs text-dark-500 uppercase tracking-widest font-bold mb-1">
                        Total Interactions
                      </p>
                      <p className="text-2xl font-black text-blue-500">
                        {analytics?.totalClicks?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <div className="card p-4">
                      <p className="text-xs text-dark-500 uppercase tracking-widest font-bold mb-1">
                        Inquiry Rate
                      </p>
                      <p className="text-2xl font-black text-amber-500">
                        {analytics?.totalViews > 0 
                          ? ((contacts.length / analytics.totalViews) * 100).toFixed(1)
                          : "0.0"}%
                      </p>
                    </div>
                    <div className="card p-4">
                      <p className="text-xs text-dark-500 uppercase tracking-widest font-bold mb-1">
                        Total Inquiries
                      </p>
                      <p className="text-2xl font-black text-primary-500 uppercase">
                        {contacts.length}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Page Popularity */}
                    <div className="glass rounded-2xl p-6 border border-dark-200/50 dark:border-dark-800/50">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-dark-500 mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Top Performing Pages
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(analytics?.pageBreakdown || {})
                          .sort(([, a]: any, [, b]: any) => b - a)
                          .slice(0, 5)
                          .map(([page, count]: any, i) => (
                            <div key={page} className="relative">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-dark-700 dark:text-dark-300">
                                  {page === '/' ? 'Home (Root)' : page}
                                </span>
                                <span className="text-dark-400 font-bold">{count}</span>
                              </div>
                              <div className="h-1 w-full bg-dark-100 dark:bg-dark-800 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(count / analytics.totalViews) * 100}%` }}
                                  className="h-full bg-green-500/50"
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Interaction Hotspots */}
                    <div className="glass rounded-2xl p-6 border border-dark-200/50 dark:border-dark-800/50">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-dark-500 mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Interaction Hotspots
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(analytics?.clickBreakdown || {})
                          .sort(([, a]: any, [, b]: any) => b - a)
                          .slice(0, 5)
                          .map(([element, count]: any) => (
                            <div key={element} className="relative">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-dark-700 dark:text-dark-300 capitalize">
                                  {element.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span className="text-dark-400 font-bold">{count}</span>
                              </div>
                              <div className="h-1 w-full bg-dark-100 dark:bg-dark-800 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(count / analytics.totalClicks) * 100}%` }}
                                  className="h-full bg-blue-500/50"
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Basic Profile Information</h2>
                    <div className="card p-6 max-w-2xl">
                      <ProfileAdminView profile={profile} onSave={handleSaveProfile} />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Advanced Details (JSON)</h2>
                    <div className="card p-6 max-w-4xl">
                      <AdvancedProfileAdminView profile={profile} onSave={handleSaveProfile} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Project Modal */}
      <Modal
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          setEditingProject(null);
        }}
        title={editingProject ? "Edit Project" : "Add Project"}
      >
        <ProjectForm
          initialData={editingProject}
          onSave={handleSaveProject}
          onCancel={() => {
            setShowProjectModal(false);
            setEditingProject(null);
          }}
        />
      </Modal>

      {/* Blog Modal */}
      <Modal
        isOpen={showBlogModal}
        onClose={() => {
          setShowBlogModal(false);
          setEditingBlog(null);
        }}
        title={editingBlog ? "Edit Post" : "New Blog Post"}
      >
        <BlogForm
          initialData={editingBlog}
          onSave={handleSaveBlog}
          onCancel={() => {
            setShowBlogModal(false);
            setEditingBlog(null);
          }}
        />
      </Modal>
    </div>
  );
}

function ImageUploader({ onUpload, label, acceptFileTypes = "image/*" }: { onUpload: (url: string) => void, label?: string, acceptFileTypes?: string }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onUpload(data.url);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const id = `upload-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="mt-2 text-sm">
      <input type="file" accept={acceptFileTypes} onChange={handleFileChange} disabled={uploading} className="hidden" id={id} />
      <label htmlFor={id} className="cursor-pointer inline-flex items-center px-4 py-2 border border-dark-200 dark:border-dark-700 rounded-md shadow-sm text-sm font-medium text-dark-700 dark:text-dark-200 bg-white dark:bg-dark-800 hover:bg-dark-50 dark:hover:bg-dark-700 focus:outline-none">
        {uploading ? "Uploading..." : label || "Upload Image"}
      </label>
    </div>
  );
}

// Project Form Component
function ProjectForm({
  initialData,
  onSave,
  onCancel,
}: {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    problem: initialData?.problem || "",
    solution: initialData?.solution || "",
    techStack: initialData?.techStack?.join(", ") || "",
    githubUrl: initialData?.githubUrl || "",
    liveUrl: initialData?.liveUrl || "",
    featured: initialData?.featured || false,
    images: initialData?.images || [],
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      ...form,
      techStack: form.techStack
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean),
    };
    await onSave(data);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description *</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800"
          rows={2}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Problem Statement</label>
          <textarea
            value={form.problem}
            onChange={(e) => setForm({ ...form, problem: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Solution Provided</label>
          <textarea
            value={form.solution}
            onChange={(e) => setForm({ ...form, solution: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800"
            rows={2}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Tech Stack (comma separated)
        </label>
        <input
          type="text"
          value={form.techStack}
          onChange={(e) => setForm({ ...form, techStack: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800"
          placeholder="React, TypeScript, Next.js"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">GitHub URL</label>
          <input
            type="url"
            value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Live URL</label>
          <input
            type="url"
            value={form.liveUrl}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Project Images</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.images.map((url: string, idx: number) => (
            <div key={idx} className="relative w-24 h-24 group">
              {url && !url.startsWith('javascript:') && (
                <Image 
                  src={url} 
                  alt="Uploaded" 
                  fill
                  className="w-full h-full object-cover rounded-md border border-dark-200 dark:border-dark-700" 
                />
              )}
              <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_: string, i: number) => i !== idx) })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                &times;
              </button>
            </div>
          ))}
        </div>
        <ImageUploader onUpload={(url) => setForm({ ...form, images: [...form.images, url] })} label="Add Project Image" />
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          className="rounded border-dark-300"
        />
        <span className="text-sm">Featured Project</span>
      </label>
      <div className="flex gap-3 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-dark-200 dark:border-dark-700 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary disabled:opacity-50"
        >
          {saving ? "Saving..." : initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}

// Blog Form Component
function BlogForm({
  initialData,
  onSave,
  onCancel,
}: {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    tags: initialData?.tags?.join(", ") || "",
    coverImage: initialData?.coverImage || "",
    slug: initialData?.slug || "",
    published: initialData?.published || false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug =
      form.slug ||
      form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const data = {
      ...form,
      slug,
      tags: form.tags
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean),
    };
    await onSave(data);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
              slug:
                form.slug ||
                e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, ""),
            })
          }
          className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800"
          placeholder="auto-generated-from-title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Excerpt</label>
        <input
          type="text"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800"
          placeholder="Brief summary..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Content *</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 font-mono text-sm"
          rows={8}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Tags (comma separated)
        </label>
        <input
          type="text"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800"
          placeholder="React, Next.js, Tutorial"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Cover Image URL
        </label>
        {form.coverImage && (
          <div className="mb-2 relative w-32 h-20">
            {form.coverImage && !form.coverImage.startsWith('javascript:') && (
              <Image 
                src={form.coverImage} 
                fill
                className="w-full h-full object-cover rounded-md border border-dark-200 dark:border-dark-700" 
                alt="Cover" 
              />
            )}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <input
            type="url"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800"
            placeholder="https://..."
          />
          <ImageUploader onUpload={(url) => setForm({ ...form, coverImage: url })} label="Upload Cover Image" />
        </div>
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => setForm({ ...form, published: e.target.checked })}
          className="rounded border-dark-300"
        />
        <span className="text-sm">Published</span>
      </label>
      <div className="flex gap-3 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-dark-200 dark:border-dark-700 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary disabled:opacity-50"
        >
          {saving ? "Saving..." : initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}

// Profile Form Component
function ProfileAdminView({ profile, onSave }: { profile: any; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    name: profile?.name || "",
    title: profile?.title || "",
    description: profile?.description || "",
    avatar_url: profile?.avatar_url || "",
    resume_url: profile?.resume_url || "",
    github_url: profile?.github_url || "",
    linkedin_url: profile?.linkedin_url || "",
    twitter_url: profile?.twitter_url || "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        title: profile.title || "",
        description: profile.description || "",
        avatar_url: profile.avatar_url || "",
        resume_url: profile.resume_url || "",
        github_url: profile.github_url || "",
        linkedin_url: profile.linkedin_url || "",
        twitter_url: profile.twitter_url || "",
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-4">
        {form.avatar_url && (
          <div className="relative w-16 h-16">
            <Image 
              src={form.avatar_url} 
              alt="Avatar" 
              fill
              className="rounded-full object-cover shadow border border-dark-200 dark:border-dark-700" 
            />
          </div>
        )}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Avatar Image URL</label>
          <div className="flex flex-col gap-2">
            <input type="text" value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm" />
            <ImageUploader onUpload={(url) => setForm({...form, avatar_url: url})} label="Upload Avatar" />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Professional Title</label>
        <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">About Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800" rows={5} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Resume File/PDF URL</label>
        <div className="flex flex-col gap-2">
          <input type="text" value={form.resume_url} onChange={(e) => setForm({ ...form, resume_url: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm" placeholder="URL to your resume..." />
          <ImageUploader onUpload={(url) => setForm({...form, resume_url: url})} label="Upload Resume PDF (Cloudinary accepts raw files)" acceptFileTypes="image/*,application/pdf" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">GitHub URL</label>
          <input type="url" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
          <input type="url" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Twitter URL</label>
        <input type="url" value={form.twitter_url} onChange={(e) => setForm({ ...form, twitter_url: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm" />
      </div>
      <div className="pt-4 text-right">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </div>
    </form>
  );
}

// Advanced Profile Form Component
function AdvancedProfileAdminView({ profile, onSave }: { profile: any; onSave: (data: any) => void }) {
  const [languages, setLanguages] = useState<string>("");
  const [interests, setInterests] = useState<string>("");

  const [skills, setSkills] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile && !saving) {
      setLanguages(Array.isArray(profile.languages) ? profile.languages.join(", ") : "");
      setInterests(Array.isArray(profile.interests) ? profile.interests.join(", ") : "");
      
      setSkills(Array.isArray(profile.skills) ? profile.skills : []);
      setExperience(Array.isArray(profile.experience) ? profile.experience : []);
      setEducation(Array.isArray(profile.education) ? profile.education : []);
      setCertifications(Array.isArray(profile.certifications) ? profile.certifications : []);
    }
  }, [profile, saving]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const parsedData = {
        languages: languages.split(",").map(s => s.trim()).filter(Boolean),
        interests: interests.split(",").map(s => s.trim()).filter(Boolean),
        skills,
        experience,
        education,
        certifications,
      };
      await onSave(parsedData);
    } catch (err: any) {
      console.error(err);
      alert("Error saving details");
    } finally {
      setSaving(false);
    }
  };

  const handleArrayChange = (setter: any, array: any[], index: number, field: string, value: string) => {
    const newArray = [...array];
    newArray[index] = { ...newArray[index], [field]: value };
    setter(newArray);
  };
  const addArrayItem = (setter: any, array: any[]) => setter([...array, {}]);
  const removeArrayItem = (setter: any, array: any[], index: number) => setter(array.filter((_: any, i: number) => i !== index));

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Comma separated fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Languages</label>
          <textarea value={languages} onChange={(e) => setLanguages(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm" rows={3} placeholder="English, Spanish..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Interests</label>
          <textarea value={interests} onChange={(e) => setInterests(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm" rows={3} placeholder="Open Source, AI..." />
        </div>
      </div>

      {/* Skills */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-bold text-primary-600 dark:text-primary-400">Skills</label>
          <button type="button" onClick={() => addArrayItem(setSkills, skills)} className="text-xs bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 px-3 py-1.5 rounded-md hover:bg-dark-200 dark:hover:bg-dark-700 transition">
            + Add Skill
          </button>
        </div>
        <div className="space-y-3">
          {skills.map((skill, i) => (
            <div key={i} className="p-4 border border-dark-200 dark:border-dark-700 bg-white/50 dark:bg-dark-900/50 rounded-lg relative">
              <button type="button" onClick={() => removeArrayItem(setSkills, skills, i)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 bg-red-50 dark:bg-red-900/20 rounded">
                <FiTrash2 size={14} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-8">
                <input type="text" placeholder="Skill Name (e.g. React.js)" value={skill.name || ""} onChange={(e) => handleArrayChange(setSkills, skills, i, "name", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm" />
                <select value={skill.level || ""} onChange={(e) => handleArrayChange(setSkills, skills, i, "level", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm">
                  <option value="" disabled>Select Level</option>
                  <option value="expert">Expert</option>
                  <option value="advanced">Advanced</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="beginner">Beginner</option>
                </select>
                <select value={skill.category || ""} onChange={(e) => handleArrayChange(setSkills, skills, i, "category", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm">
                  <option value="" disabled>Select Category</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="devops">DevOps</option>
                  <option value="tools">Tools</option>
                </select>
              </div>
            </div>
          ))}
          {skills.length === 0 && <p className="text-sm text-dark-500">No skills blocks added.</p>}
        </div>
      </div>

      {/* Experience */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-bold text-primary-600 dark:text-primary-400">Experience</label>
          <button type="button" onClick={() => addArrayItem(setExperience, experience)} className="text-xs bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 px-3 py-1.5 rounded-md hover:bg-dark-200 dark:hover:bg-dark-700 transition">
            + Add Experience
          </button>
        </div>
        <div className="space-y-3">
          {experience.map((exp, i) => (
            <div key={i} className="p-4 border border-dark-200 dark:border-dark-700 bg-white/50 dark:bg-dark-900/50 rounded-lg relative">
              <button type="button" onClick={() => removeArrayItem(setExperience, experience, i)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 bg-red-50 dark:bg-red-900/20 rounded">
                <FiTrash2 size={14} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2 pr-8">
                <input type="text" placeholder="Title/Role (e.g. Senior Dev)" value={exp.title || ""} onChange={(e) => handleArrayChange(setExperience, experience, i, "title", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm" />
                <input type="text" placeholder="Company" value={exp.company || ""} onChange={(e) => handleArrayChange(setExperience, experience, i, "company", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm" />
                <input type="text" placeholder="Duration (e.g. 2020 - Present)" value={exp.duration || ""} onChange={(e) => handleArrayChange(setExperience, experience, i, "duration", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm" />
                <input type="text" placeholder="Description/Responsibilities" value={exp.description || ""} onChange={(e) => handleArrayChange(setExperience, experience, i, "description", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm" />
              </div>
            </div>
          ))}
          {experience.length === 0 && <p className="text-sm text-dark-500">No experience blocks added.</p>}
        </div>
      </div>

      {/* Education */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-bold text-primary-600 dark:text-primary-400">Education</label>
          <button type="button" onClick={() => addArrayItem(setEducation, education)} className="text-xs bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 px-3 py-1.5 rounded-md hover:bg-dark-200 dark:hover:bg-dark-700 transition">
            + Add Education
          </button>
        </div>
        <div className="space-y-3">
          {education.map((edu, i) => (
            <div key={i} className="p-4 border border-dark-200 dark:border-dark-700 bg-white/50 dark:bg-dark-900/50 rounded-lg relative">
              <button type="button" onClick={() => removeArrayItem(setEducation, education, i)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 bg-red-50 dark:bg-red-900/20 rounded">
                <FiTrash2 size={14} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                <input type="text" placeholder="Degree / Course" value={edu.degree || ""} onChange={(e) => handleArrayChange(setEducation, education, i, "degree", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm" />
                <input type="text" placeholder="Institution" value={edu.institution || ""} onChange={(e) => handleArrayChange(setEducation, education, i, "institution", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm" />
                <input type="text" placeholder="Year" value={edu.year || ""} onChange={(e) => handleArrayChange(setEducation, education, i, "year", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm" />
              </div>
            </div>
          ))}
          {education.length === 0 && <p className="text-sm text-dark-500">No education blocks added.</p>}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-bold text-primary-600 dark:text-primary-400">Certifications</label>
          <button type="button" onClick={() => addArrayItem(setCertifications, certifications)} className="text-xs bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 px-3 py-1.5 rounded-md hover:bg-dark-200 dark:hover:bg-dark-700 transition">
            + Add Certification
          </button>
        </div>
        <div className="space-y-3">
          {certifications.map((cert, i) => (
            <div key={i} className="p-4 border border-dark-200 dark:border-dark-700 bg-white/50 dark:bg-dark-900/50 rounded-lg relative">
              <button type="button" onClick={() => removeArrayItem(setCertifications, certifications, i)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 bg-red-50 dark:bg-red-900/20 rounded">
                <FiTrash2 size={14} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                <input type="text" placeholder="Certification Name" value={cert.name || ""} onChange={(e) => handleArrayChange(setCertifications, certifications, i, "name", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm" />
                <input type="text" placeholder="Issuer (e.g. AWS, Meta)" value={cert.issuer || ""} onChange={(e) => handleArrayChange(setCertifications, certifications, i, "issuer", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm" />
                <input type="text" placeholder="URL / Verification Link" value={cert.url || ""} onChange={(e) => handleArrayChange(setCertifications, certifications, i, "url", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm" />
              </div>
            </div>
          ))}
          {certifications.length === 0 && <p className="text-sm text-dark-500">No certifications added.</p>}
        </div>
      </div>

      <div className="pt-4 text-right">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving Details..." : "Update Advanced Details"}
        </button>
      </div>
    </form>
  );
}
