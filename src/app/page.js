
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const skills = [
  "WordPress",
  "Elementor",
  "HTML",
  "CSS",
  "JavaScript",
  "PHP",
  "MySQL",
  "WooCommerce",
];

export default function Home() {
  const [bookingStatus, setBookingStatus] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Projects loaded from Supabase
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      setProjectsLoading(true);
      setProjectsError("");

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading projects:", error);
        setProjectsError(error.message);
        setProjects([]);
      } else {
        setProjects(data || []);
      }

      setProjectsLoading(false);
    }

    loadProjects();
  }, []);

  // Use the visitor's local date for the date input's minimum.
  const today = new Date();
  const minBookingDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  async function handleBookingSubmit(event) {
    event.preventDefault();
    setBookingStatus("");
    setBookingLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const bookingDetails = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      date: formData.get("date"),
      time: formData.get("time"),
      reason: formData.get("reason"),
    };

    try {
      const response = await fetch("/api/book-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingDetails),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send your request.");
      }

      setBookingStatus("success");
      form.reset();
    } catch (error) {
      setBookingStatus(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#09090b] text-white">

      {/* HEADER */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="#" className="text-xl font-bold tracking-tight">
          Safvan<span className="text-lime-400">.</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          <a href="#about" className="transition hover:text-lime-400">About</a>
          <a href="#skills" className="transition hover:text-lime-400">Skills</a>
          <a href="#projects" className="transition hover:text-lime-400">Projects</a>
          <a href="#book-meeting" className="transition hover:text-lime-400">Book a Meeting</a>
          <a href="#contact" className="transition hover:text-lime-400">Contact</a>
        </nav>

        <a
          href="#contact"
          className="rounded-full border border-zinc-700 px-5 py-2.5 text-sm transition duration-300 hover:border-lime-400 hover:bg-lime-400 hover:text-black"
        >
          Let's talk
        </a>
      </header>

      {/* HERO SECTION */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-20 md:grid-cols-[1.3fr_0.7fr] md:pb-32 md:pt-28">
        <div>
          <p className="mb-6 flex items-center gap-3 text-sm text-zinc-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400" />
            WORDPRESS DEVELOPER
          </p>

          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl md:text-7xl">
            I build websites
            <br />
            that work<span className="text-lime-400">.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-zinc-400 md:text-lg">
            Hi, I'm Muhammed Safvan, a web developer focused on
            creating clean, responsive websites and useful digital
            experiences.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-full bg-lime-400 px-6 py-3 font-medium text-black transition duration-300 hover:-translate-y-1 hover:bg-lime-300 hover:shadow-[0_0_25px_rgba(163,230,53,0.25)]"
            >
              Explore my work
            </a>

            <a
              href="#about"
              className="rounded-full border border-zinc-700 px-6 py-3 text-sm transition duration-300 hover:border-lime-400 hover:text-lime-400"
            >
              More about me
            </a>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-zinc-800 pt-7">
            <div>
              <p className="text-2xl font-semibold">08+</p>
              <p className="mt-1 text-sm text-zinc-500">Core skills</p>
            </div>

            <div>
              <p className="text-2xl font-semibold">
                {String(projects.length).padStart(2, "0")}
              </p>
              <p className="mt-1 text-sm text-zinc-500">Featured projects</p>
            </div>

            <div>
              <p className="text-2xl font-semibold">BCA</p>
              <p className="mt-1 text-sm text-zinc-500">Graduate, 2025</p>
            </div>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-800 via-zinc-900 to-lime-950/40">
          <img
            src="/safvan.jpg"
            alt="Muhammed Safvan"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/20" />
          <div className="pointer-events-none absolute inset-5 z-10 rounded-[1.5rem] border border-white/10" />

          <span className="absolute right-5 top-5 z-20 rounded-full border border-lime-400/40 bg-black/60 px-3 py-2 text-xs text-lime-300 backdrop-blur-md">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime-400" />
            Available to connect
          </span>

          <div className="absolute bottom-10 left-7 z-20">
            <p className="text-2xl font-semibold tracking-tight text-white">
              Muhammed Safvan
            </p>

            <p className="mt-2 text-sm text-zinc-300">
              WordPress Developer
            </p>

            <div className="mt-4 h-1 w-12 rounded-full bg-lime-400" />

            <p className="mt-4 text-xs tracking-[0.2em] text-zinc-300">
              DEVELOPER / CREATIVE
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="border-y border-zinc-800 bg-zinc-950/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-20 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-lime-400">
              01 / About
            </p>

            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
              A little about me.
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-zinc-400">
              I'm a BCA graduate from Srinivas University with
              experience in WordPress development. I enjoy building
              responsive websites, working with Elementor, and bringing
              business ideas to life online.
            </p>

            <p className="mt-5 leading-7 text-zinc-500">
              My background also includes IT support experience with a
              Kerala Government IT project. I'm continuing to expand
              my web development skills and explore modern technologies.
            </p>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.2em] text-lime-400">
          02 / Skills
        </p>

        <div className="mt-5 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="text-3xl font-semibold md:text-4xl">
            Tools I work with.
          </h2>

          <p className="max-w-md text-sm leading-6 text-zinc-500">
            Technologies and tools I use to build and maintain websites.
          </p>
        </div>

        <div className="mt-9 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm text-zinc-300 transition duration-300 hover:-translate-y-1 hover:border-lime-400/60 hover:bg-lime-400/10 hover:text-lime-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* PROJECTS SECTION - SUPABASE */}
      <section id="projects" className="relative border-y border-zinc-800 bg-[#0c0c0e]">
        <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-lime-400/[0.04] blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-28">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-lime-400">
                <span className="h-px w-8 bg-lime-400" />
                03 / Selected work
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
                Projects I've worked on<span className="text-lime-400">.</span>
              </h2>

              <p className="mt-5 max-w-xl text-base leading-8 text-zinc-400">
                A selection of websites I've worked on across
                e-commerce and digital marketing.
              </p>
            </div>

            <div className="hidden text-right md:block">
              <p className="text-4xl font-semibold text-zinc-700">
                {String(projects.length).padStart(2, "0")}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                Featured projects
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {projectsLoading ? (
              <p className="col-span-full py-10 text-center text-zinc-400">
                Loading projects...
              </p>
            ) : projectsError ? (
              <p className="col-span-full py-10 text-center text-red-400">
                {projectsError}
              </p>
            ) : projects.length === 0 ? (
              <p className="col-span-full py-10 text-center text-zinc-400">
                No projects available yet.
              </p>
            ) : (
              projects.map((project, index) => {
                const isXXLSIZE = project.title
                  ?.toLowerCase()
                  .includes("xxlsize");

                const projectType = isXXLSIZE
                  ? "ONLINE STORE"
                  : "BUSINESS WEBSITE";

                const projectCategory = isXXLSIZE
                  ? "E-commerce"
                  : "Digital Marketing Agency";

                return (
                  <article
                    key={project.id}
                    className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-[#111113] transition-all duration-500 hover:-translate-y-2 hover:border-lime-400/40 hover:shadow-[0_20px_60px_rgba(163,230,53,0.08)]"
                  >
                    <a
                      href={project.project_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${project.title} website`}
                      className="relative block overflow-hidden bg-zinc-900"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={project.image_url}
                          alt={`${project.title} website preview`}
                          loading="lazy"
                          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-70 transition-opacity duration-500 group-hover:opacity-40" />

                        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs font-medium tracking-wider text-white shadow-lg backdrop-blur-md">
                          <span className="text-lime-400">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="text-white/50">/</span>
                          {projectType}
                        </div>

                        <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/50 px-4 py-2 text-xs text-white backdrop-blur-md">
                          {projectCategory}
                        </div>
                      </div>
                    </a>

                    <div className="p-7 md:p-8">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
                            Project {String(index + 1).padStart(2, "0")}
                          </p>

                          <h3 className="text-2xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-lime-400 md:text-3xl">
                            {project.title}
                          </h3>
                        </div>

                        <span className="text-3xl font-light text-zinc-700 transition-colors duration-300 group-hover:text-lime-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <p className="mt-4 min-h-[56px] max-w-md text-sm leading-7 text-zinc-400 md:text-base">
                        {project.description}
                      </p>

                      <div className="my-6 h-px bg-zinc-800 transition-colors duration-300 group-hover:bg-lime-400/30" />

                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs uppercase tracking-wider text-zinc-500">
                          Live website
                        </span>

                        {project.project_url && (
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 rounded-full border border-zinc-700 px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-lime-400 hover:bg-lime-400 hover:text-black"
                          >
                            Visit website
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-zinc-800 pt-7 sm:flex-row sm:items-center">
            <p className="text-sm text-zinc-500">
              {projects.length} projects. Different industries. One focus: great websites.
            </p>

            <a
              href="#contact"
              className="text-sm font-medium text-lime-400 transition hover:text-lime-300"
            >
              Have a project in mind? Let's talk
            </a>
          </div>
        </div>
      </section>

      {/* BOOK A MEETING SECTION */}
      <section id="book-meeting" className="border-y border-zinc-800 bg-[#0c0c0e]">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-lime-400">
              04 / Let's connect
            </p>

            <h2 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">
              Let's schedule a meeting<span className="text-lime-400">.</span>
            </h2>

            <p className="mt-6 max-w-md leading-7 text-zinc-400">
              Have an idea, a project, or just want to connect? Send me a
              meeting request with your preferred date and time. I'll review
              it and get back to you.
            </p>

            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
              <p className="text-sm font-medium text-white">What happens next?</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Your request will be sent to me. I'll contact you to confirm
                the meeting and share the meeting link.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-[#111113] p-6 md:p-9">
            <h3 className="mb-2 text-2xl font-semibold">Request a meeting</h3>
            <p className="mb-8 text-sm text-zinc-500">
              Choose a suitable date and time and tell me what you'd like to discuss.
            </p>

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div>
                <label htmlFor="booking-name" className="mb-2 block text-sm text-zinc-300">
                  Full Name
                </label>
                <input
                  id="booking-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  required
                  maxLength={100}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-400"
                />
              </div>

              <div>
                <label htmlFor="booking-email" className="mb-2 block text-sm text-zinc-300">
                  Email Address
                </label>
                <input
                  id="booking-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  required
                  maxLength={254}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-400"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="booking-date" className="mb-2 block text-sm text-zinc-300">
                    Preferred Date
                  </label>
                  <input
                    id="booking-date"
                    name="date"
                    type="date"
                    min={minBookingDate}
                    required
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-lime-400"
                  />
                </div>

                <div>
                  <label htmlFor="booking-time" className="mb-2 block text-sm text-zinc-300">
                    Preferred Time
                  </label>
                  <input
                    id="booking-time"
                    name="time"
                    type="time"
                    required
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-lime-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="booking-reason" className="mb-2 block text-sm text-zinc-300">
                  Meeting Agenda
                </label>
                <textarea
                  id="booking-reason"
                  name="reason"
                  rows="4"
                  placeholder="What would you like to discuss?"
                  required
                  maxLength={2000}
                  className="w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-400"
                />
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-lime-400 px-6 py-4 font-semibold text-black transition duration-300 hover:-translate-y-1 hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {bookingLoading ? "Sending request..." : "Request Meeting"}
              </button>

              {bookingStatus === "success" && (
                <p role="status" className="rounded-xl border border-lime-400/30 bg-lime-400/10 p-4 text-sm text-lime-300">
                  Your meeting request has been sent! I'll get back to you soon.
                </p>
              )}

              {bookingStatus && bookingStatus !== "success" && (
                <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                  {bookingStatus}
                </p>
              )}

              <p className="text-center text-xs text-zinc-500">
                Your selected date and time are a request, not a confirmed booking.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="border-b border-zinc-800 bg-zinc-950/60">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 md:grid-cols-2">

          {/* CONTACT INFORMATION */}
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-lime-400">
              05 / Contact
            </p>

            <h2 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">
              Let's talk about your next project
              <span className="text-lime-400">.</span>
            </h2>

            <p className="mt-6 max-w-md leading-7 text-zinc-400">
              Have a project, an idea, or an opportunity?
              I'd love to hear from you. Send me a message.
            </p>

            <div className="mt-10 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Email
                </p>
                <a
                  href="mailto:safvansince2003@gmail.com"
                  className="mt-2 inline-block text-base text-white transition hover:text-lime-400"
                >
                  safvansince2003@gmail.com
                </a>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Phone
                </p>
                <a
                  href="tel:+918921815799"
                  className="mt-2 inline-block text-base text-white transition hover:text-lime-400"
                >
                  +91 8921815799
                </a>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Location
                </p>
                <p className="mt-2 text-base text-white">
                  Palakkad, Kerala, India
                </p>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="rounded-3xl border border-zinc-800 bg-[#111113] p-6 md:p-9">
            <h3 className="mb-2 text-2xl font-semibold">
              Send me a message
            </h3>

            <p className="mb-8 text-sm text-zinc-500">
              Fill out the form and I'll get back to you.
            </p>

            <form
              action="https://formsubmit.app/f/w69b55xknt"
              method="POST"
              className="space-y-6"
            >
              <input
                type="hidden"
                name="_subject"
                value="New Portfolio Contact Message"
              />

              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm text-zinc-300"
                >
                  Full Name
                </label>

                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-400"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm text-zinc-300"
                >
                  Email Address
                </label>

                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-400"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm text-zinc-300"
                >
                  Your Message
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  rows="5"
                  placeholder="Tell me about your project..."
                  required
                  className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-400"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-full bg-lime-400 px-6 py-4 font-semibold text-black transition duration-300 hover:-translate-y-1 hover:bg-lime-300 hover:shadow-[0_0_25px_rgba(163,230,53,0.2)]"
              >
                Send Message
              </button>

              <p className="text-center text-xs text-zinc-500">
                I'll get back to you as soon as possible.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Muhammed Safvan</p>
          <p>Designed and built with Next.js.</p>
        </div>
      </footer>

    </main>
  );
}
