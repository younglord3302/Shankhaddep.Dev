import { createClient } from "@insforge/sdk";

// InSForge API Configuration
const INSFORGE_BASE_URL =
  process.env.NEXT_PUBLIC_INSFORGE_URL ||
  "https://v96ifskx.ap-southeast.insforge.app";
const INSFORGE_ANON_KEY =
  process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || process.env.INSFORGE_ANON_KEY || "";
const INSFORGE_API_KEY =
  process.env.NEXT_PUBLIC_INSFORGE_API_KEY || process.env.INSFORGE_API_KEY || "";

function getInsForgeClient(token?: string) {
  // Use passed token (Clerk JWT) or fallback to Admin API Key
  const authToken = token || INSFORGE_API_KEY;

  return createClient({
    baseUrl: INSFORGE_BASE_URL,
    anonKey: authToken || INSFORGE_ANON_KEY,
  });
}

// Projects API
export const projectsApi = {
  getAll: async (filters?: { featured?: boolean; techStack?: string }) => {
    let query = getInsForgeClient().database.from("projects").select("*").order("created_at", { ascending: false });
    if (filters?.featured) {
      query = query.eq("featured", true);
    }
    if (filters?.techStack) {
      query = query.contains("tech_stack", [filters.techStack]);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  getById: async (id: string, token?: string) => {
    const { data, error } = await getInsForgeClient(token).database.from("projects").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  },
  getBySlug: async (slug: string) => {
    // Falls back to searching by title-slug if no slug field exists
    const titleFromSlug = slug.replace(/-/g, " ");
    const { data, error } = await getInsForgeClient().database.from("projects")
      .select("*")
      .filter("title", "ilike", titleFromSlug)
      .limit(1)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data;
  },
  create: async (data: any, _token?: string) => {
    const payload = {
      title: data.title,
      description: data.description,
      tech_stack: data.techStack,
      github_url: data.githubUrl,
      live_url: data.liveUrl,
      featured: data.featured,
      problem: data.problem,
      solution: data.solution,
      images: data.images,
    };
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Create failed");
    return json;
  },
  update: async (id: string, data: any, _token?: string) => {
    const payload = {
      title: data.title,
      description: data.description,
      tech_stack: data.techStack,
      github_url: data.githubUrl,
      live_url: data.liveUrl,
      featured: data.featured,
      problem: data.problem,
      solution: data.solution,
      images: data.images,
    };
    const safePayload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v !== undefined));
    const res = await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...safePayload }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Update failed");
    return json;
  },
  delete: async (id: string, _token?: string) => {
    const res = await fetch(`/api/projects?id=${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Delete failed");
    return { success: true };
  },
};

// Blogs API
export const blogsApi = {
  getAll: async () => {
    const { data, error } = await getInsForgeClient().database.from("blogs").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  getBySlug: async (slug: string, token?: string) => {
    const { data, error } = await getInsForgeClient(token).database.from("blogs").select("*").eq("slug", slug).single();
    if (error) throw error;
    return data;
  },
  create: async (data: any, _token?: string) => {
    const payload = {
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      tags: data.tags,
      cover_image: data.coverImage,
      published: data.published,
    };
    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Create failed");
    return json;
  },
  update: async (id: string, data: any, _token?: string) => {
    const payload = {
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      tags: data.tags,
      cover_image: data.coverImage,
      published: data.published,
    };
    const safePayload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v !== undefined));
    const res = await fetch("/api/blogs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...safePayload }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Update failed");
    return json;
  },
  delete: async (id: string, _token?: string) => {
    const res = await fetch(`/api/blogs?id=${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Delete failed");
    return { success: true };
  },
};

// Contact API
export const contactApi = {
  submit: async (data: { name: string; email: string; message: string }) => {
    const client = createClient({
      baseUrl: INSFORGE_BASE_URL,
      anonKey: INSFORGE_ANON_KEY,
    });
    const { data: result, error } = await client.database.from("contacts").insert([data]);
    if (error) throw error;
    return result;
  },
  getAll: async () => {
    const { data, error } = await getInsForgeClient().database.from("contacts").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  delete: async (id: string) => {
    const res = await fetch(`/api/contact?id=${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Delete failed");
    return json;
  },
};

// Analytics API
export const analyticsApi = {
  track: async (data: { eventType: string; page: string; metadata?: any }) => {
    const payload = {
      event_type: data.eventType,
      page: data.page,
      metadata: data.metadata || {},
    };
    
    const client = createClient({
      baseUrl: INSFORGE_BASE_URL,
      anonKey: INSFORGE_ANON_KEY,
    });
    const { data: result, error } = await client.database.from("analytics").insert([payload]);
    if (error) throw error;
    return result;
  },
  getAll: async (token?: string) => {
    const { data, error } = await getInsForgeClient(token).database.from("analytics").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  getStats: async () => {
    const client = getInsForgeClient();
    
    // Fetch all events for detailed client-side grouping
    const { data: allEvents, error } = await client.database
      .from("analytics")
      .select("event_type, page, metadata, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const stats = {
      totalViews: allEvents.filter(e => e.event_type === 'view').length,
      totalClicks: allEvents.filter(e => e.event_type === 'click').length,
      pageBreakdown: {} as Record<string, number>,
      clickBreakdown: {} as Record<string, number>,
    };

    allEvents.forEach(event => {
      // Group by page
      if (event.event_type === 'view') {
        stats.pageBreakdown[event.page] = (stats.pageBreakdown[event.page] || 0) + 1;
      }
      // Group by element clicked
      if (event.event_type === 'click' && event.metadata?.element) {
        const el = event.metadata.element;
        stats.clickBreakdown[el] = (stats.clickBreakdown[el] || 0) + 1;
      }
    });

    return stats;
  },
};

// Auth API - InSForge uses Supabase-style auth
export const authApi = {
  login: async (email: string, password: string) => {
    const { data, error } = await getInsForgeClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error("Invalid credentials");
    }

    return { token: data?.accessToken, user: data?.user };
  },
  verify: async (token: string) => {
    const client = getInsForgeClient(token);
    const { data, error } = await client.auth.getCurrentUser();

    if (error) {
      throw new Error("Invalid token");
    }

    return data;
  },
};

// Profile API — get uses SDK (public read), update uses server route (admin key bypasses RLS)
export const profileApi = {
  get: async () => {
    const { data, error } = await getInsForgeClient()
      .database.from("profile")
      .select("*")
      .limit(1)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data;
  },
  update: async (id: string, payload: any, _token?: string) => {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Update failed");
    return json.profile;
  },
};
