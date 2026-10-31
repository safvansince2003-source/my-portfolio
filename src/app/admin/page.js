
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [projectUrl, setProjectUrl] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        setError(error.message);
      } else {
        setUser(data.session?.user ?? null);
      }

      setPageLoading(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      loadProjects();
    } else {
      setProjects([]);
    }
  }, [user]);

  async function loadProjects() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("projects")
      .select("*");

    if (error) {
      setError(error.message);
    } else {
      setProjects(data || []);
    }

    setLoading(false);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
    } else {
      setUser(null);
      setProjects([]);
      setMessage("");
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setProjectUrl("");
    setEditingId(null);
  }

  function startEditing(project) {
    setEditingId(project.id);
    setTitle(project.title || "");
    setDescription(project.description || "");
    setImageUrl(project.image_url || "");
    setProjectUrl(project.project_url || "");
    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSaveProject(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const projectData = {
      title: title.trim(),
      description: description.trim(),
      image_url: imageUrl.trim(),
      project_url: projectUrl.trim(),
    };

    if (
      !projectData.title ||
      !projectData.description ||
      !projectData.image_url ||
      !projectData.project_url
    ) {
      setError("Please fill in all project fields.");
      setLoading(false);
      return;
    }

    let result;

    if (editingId) {
      result = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", editingId)
        .select();
    } else {
      result = await supabase
        .from("projects")
        .insert([projectData])
        .select();
    }

    if (result.error) {
      setError(result.error.message);
    } else if (!result.data?.length) {
      setError("No project was saved. Check your database permissions.");
    } else {
      setMessage(
        editingId
          ? "Project updated successfully!"
          : "Project added successfully!"
      );

      resetForm();
      await loadProjects();
    }

    setLoading(false);
  }

  async function handleDeleteProject(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");
    setMessage("");

    const { data, error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      setError(error.message);
    } else if (!data?.length) {
      setError("Project was not deleted. Check your database permissions.");
    } else {
      setMessage("Project deleted successfully!");
      await loadProjects();
    }

    setLoading(false);
  }

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        Loading Admin Panel...
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-xl">
          <p className="text-lime-400 text-xs tracking-widest mb-3">
            SAFVAN PORTFOLIO
          </p>

          <h1 className="text-3xl font-bold mb-2">
            Admin Login
          </h1>

          <p className="text-zinc-400 text-sm mb-8">
            Sign in to manage your portfolio projects.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm mb-2">
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your admin email"
                className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 outline-none focus:border-lime-400"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 outline-none focus:border-lime-400"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-lime-400 py-3 font-semibold text-black hover:bg-lime-300 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500 mt-8">
            Authorized access only.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-lime-400 text-xs tracking-widest">
              SAFVAN PORTFOLIO
            </p>
            <h1 className="text-2xl font-bold mt-1">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-zinc-400 sm:block">
              {user.email}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-full border border-zinc-700 px-5 py-2 text-sm hover:bg-zinc-800"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-400">Total Projects</p>
            <p className="mt-2 text-4xl font-bold text-lime-400">
              {projects.length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-400">Account Status</p>
            <p className="mt-2 text-2xl font-semibold text-lime-400">
              Signed In
            </p>
          </div>
        </div>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-2">
            {editingId ? "Edit Project" : "Add New Project"}
          </h2>

          <p className="text-sm text-zinc-400 mb-7">
            Enter your project information below.
          </p>

          <form onSubmit={handleSaveProject} className="space-y-5">
            <div>
              <label className="block text-sm mb-2">
                Project Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                required
                maxLength={150}
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 outline-none focus:border-lime-400"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">
                Project Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project"
                rows={4}
                required
                maxLength={2000}
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 outline-none focus:border-lime-400"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">
                Project Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste your Supabase image URL"
                required
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 outline-none focus:border-lime-400"
              />

              {imageUrl && (
                <div className="mt-4">
                  <p className="text-xs text-zinc-500 mb-2">
                    Image Preview
                  </p>
                  <img
                    src={imageUrl}
                    alt="Project preview"
                    className="h-40 w-full max-w-sm rounded-xl border border-zinc-800 object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2">
                Live Project Website URL
              </label>
              <input
                type="url"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://example.com"
                required
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 outline-none focus:border-lime-400"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-lime-400 px-7 py-3 font-semibold text-black hover:bg-lime-300 disabled:opacity-50"
              >
                {loading
                  ? "Please wait..."
                  : editingId
                  ? "Update Project"
                  : "Add Project"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-zinc-700 px-7 py-3 hover:bg-zinc-800"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        {message && (
          <p role="status" className="mt-6 rounded-xl border border-lime-400/30 bg-lime-400/10 p-4 text-lime-300">
            {message}
          </p>
        )}

        {error && (
          <p role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </p>
        )}

        <section className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Your Projects</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Manage your saved portfolio projects.
              </p>
            </div>

            <button
              onClick={loadProjects}
              disabled={loading}
              className="rounded-full border border-zinc-700 px-5 py-2 text-sm hover:border-lime-400"
            >
              Refresh
            </button>
          </div>

          {loading && projects.length === 0 ? (
            <p className="text-zinc-400">Loading projects...</p>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center">
              <p className="text-zinc-300">No projects found.</p>
              <p className="mt-2 text-sm text-zinc-500">
                Add your first project using the form above.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950"
                >
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="h-52 w-full object-cover"
                  />

                  <div className="p-6">
                    <h3 className="text-xl font-semibold">
                      {project.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      {project.description}
                    </p>

                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-sm text-lime-400 hover:text-lime-300"
                    >
                      Visit Website
                    </a>

                    <div className="mt-6 flex gap-3 border-t border-zinc-800 pt-5">
                      <button
                        onClick={() => startEditing(project)}
                        className="flex-1 rounded-full border border-zinc-700 py-2 text-sm hover:border-lime-400"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        disabled={loading}
                        className="flex-1 rounded-full border border-red-500/40 py-2 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
