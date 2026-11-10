import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, AtSign,
  BookOpen, Check, Code2, ExternalLink, Github, Layers3, Linkedin,
  Menu, Moon, Search, Send, Sparkles, Sun, X,
} from "lucide-react";
import { getArticle, getArticles, getProfile, getProjects, getSkills, submitContact } from "./api.js";
import { categories, skillGroups } from "./content.js";
import useApiResource from "./useApiResource.js";

const EMPTY_LIST = [];

function usePortfolioData() {
  return {
    profile: useApiResource(getProfile, null),
    projects: useApiResource(getProjects, EMPTY_LIST),
    articles: useApiResource(getArticles, EMPTY_LIST),
    skills: useApiResource(getSkills, EMPTY_LIST),
  };
}

function ResourceFeedback({ name, loading, error }) {
  if (loading) {
    return <p className="resource-feedback" role="status">Loading {name}…</p>;
  }
  if (error) {
    return <p className="resource-feedback resource-error" role="alert">{name} couldn’t be loaded: {error}</p>;
  }
  return null;
}

function IconLink({ href, label, children }) {
  return (
    <a className="icon-link" href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
      {children}
    </a>
  );
}

function Header({ theme, setTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const homeAnchor = (anchor) => pathname === "/" ? anchor : `/${anchor}`;
  const links = [["About", "#about"], ["Skills", "#skills"], ["Projects", "#projects"], ["Writing", "#writing"]];
  return (
    <header className="site-header">
      <a className="wordmark" href={homeAnchor("#home")} aria-label="Ziaullah Saafir home">
        <span className="wordmark-mark">Z</span><span>ziaullah<span className="wordmark-muted"></span></span>
      </a>
      <nav className={menuOpen ? "nav-links nav-open" : "nav-links"} aria-label="Main navigation">
        {links.map(([label, href]) => <a key={href} href={homeAnchor(href)} onClick={() => setMenuOpen(false)}>{label}</a>)}
      </nav>
      <div className="header-actions">
        <a className="header-contact" href={homeAnchor("#contact")}>Let's talk <ArrowUpRight size={14} /></a>
        <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}

function Eyebrow({ children }) {
  return <p className="eyebrow"><span className="eyebrow-dot" />{children}</p>;
}

function SectionHeading({ index, title, note }) {
  return (
    <div className="section-heading">
      <div><p className="section-index">{index} / 05</p><h2>{title}</h2></div>
      {note && <p className="section-note">{note}</p>}
    </div>
  );
}

function Hero({ resource }) {
  const profile = resource.data || {};
  const roles = ["Full-stack developer", "Backend developer", "React & Django builder", "AI / ML enthusiast"];
  const headlineWords = (profile.headline || "Portfolio").split(" ");
  const headlineSplit = Math.ceil(headlineWords.length / 2);
  const headlineLead = headlineWords.slice(0, headlineSplit).join(" ");
  const headlineAccent = headlineWords.slice(headlineSplit).join(" ");
  const [roleIndex, setRoleIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setRoleIndex((value) => (value + 1) % roles.length), 2600);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <section className="hero section-wrap" id="home">
      <div className="hero-copy">
        <Eyebrow>{profile.name || "Developer portfolio"}</Eyebrow>
        <ResourceFeedback name="profile" loading={resource.loading} error={resource.error} />
        {profile.availability_enabled && profile.availability_label && <p className="availability-label"><span />{profile.availability_label}</p>}
        <h1>{headlineLead}{headlineAccent && <><br /><span className="serif-accent">{headlineAccent}</span></>}</h1>
        {profile.introduction && <p className="hero-intro">{profile.introduction}</p>}
        <p className="typing-line"><span className="typing-prefix">Currently exploring</span> <span key={roleIndex} className="typing-word">{roles[roleIndex]}</span><span className="typing-cursor">_</span></p>
        <div className="hero-actions">
          <a className="button button-primary" href="#projects">Explore projects <ArrowDownRight size={16} /></a>
          <a className="button button-quiet" href="#contact">Get in touch <ArrowUpRight size={15} /></a>
        </div>
        <div className="hero-socials">
          {profile.github_url && <IconLink href={profile.github_url} label="GitHub"><Github size={17} /></IconLink>}
          {profile.linkedin_url && <IconLink href={profile.linkedin_url} label="LinkedIn"><Linkedin size={17} /></IconLink>}
          {profile.cv ? <a className="cv-link" href={profile.cv} target="_blank" rel="noreferrer">Download CV <ArrowDown size={14} /></a> : <button className="cv-link cv-disabled" type="button" disabled title="Upload a CV in Django Admin to enable this download">Download CV <ArrowDown size={14} /></button>}
        </div>
      </div>
      <div className="hero-art" aria-label="Profile placeholder">
        <div className="art-grid" />
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="profile-monogram">
          {profile.avatar ? <img className="profile-image" src={profile.avatar} alt={`${profile.name || "Profile"} photo`} /> : <><span>{profile.name?.split(/\s+/).map((part) => part[0]).join("").slice(0, 2) || "ZS"}</span><span className="monogram-caption">Profile photo<br />add in admin</span></>}
        </div>
        <div className="float-card float-code"><Code2 size={15} /><span>curiosity += 1</span></div>
        <div className="float-card float-idea"><Sparkles size={15} /><span>build · learn · repeat</span></div>
        <div className="art-caption"><span>01 — 2026</span><span>Developer portfolio</span></div>
      </div>
      <div className="hero-bottom"><span>Scroll to explore</span><span className="scroll-line" /></div>
    </section>
  );
}

function About({ profile }) {
  const interests = Array.isArray(profile.interests) ? profile.interests : [];
  return (
    <section className="section-wrap content-section" id="about">
      <SectionHeading index="01" title={<>A little about<br /><span className="serif-accent">the builder.</span></>} note="Grounded in fundamentals. Curious about what comes next." />
      <div className="about-grid">
        <div className="about-copy">
          <Eyebrow>Who I am</Eyebrow>
          {profile.about && <p className="about-lead">{profile.about}</p>}
          <div className="interest-list">{interests.map((interest) => <span className="interest-chip" key={interest}>{interest}</span>)}</div>
        </div>
        {profile.education && <div className="journey-card">
          <div className="journey-icon"><BookOpen size={19} /></div>
          <p className="card-kicker">Education</p>
          <h3>{profile.education}</h3>
          <div className="journey-rule" />
          <p className="body-copy">Building a strong foundation in computer science while turning new ideas into projects and practical experience.</p>
          <span className="journey-foot">Learning is part of the work <ArrowUpRight size={14} /></span>
        </div>}
      </div>
    </section>
  );
}

function Skills({ resource }) {
  const skills = resource.data;
  return (
    <section className="section-wrap content-section" id="skills">
      <SectionHeading index="02" title={<>Tools of<br /><span className="serif-accent">the trade.</span></>} note="A growing toolkit, organized by where I put it to work." />
      <ResourceFeedback name="skills" loading={resource.loading} error={resource.error} />
      {!resource.loading && !resource.error && (skills.length
        ? <div className="skills-grid">
          {skillGroups.map(([group, label], index) => {
            const items = skills.filter((skill) => skill.group === group);
            return (
              <motion.article className="skill-card" key={group} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.06 }}>
                <div className="skill-card-top"><span className="skill-number">0{index + 1}</span><Layers3 size={16} /></div>
                <h3>{label}</h3>
                <div className="skill-tags">{items.map((skill) => <span key={skill.id || skill.name}>{skill.name}</span>)}</div>
                {!items.length && <span className="muted-caption">No skills in this group yet.</span>}
              </motion.article>
            );
          })}
        </div>
        : <div className="empty-state"><Layers3 size={24} /><p>No skills have been added yet.</p></div>)}
    </section>
  );
}

function ProjectCard({ project, index }) {
  return (
    <motion.article className={`project-card ${project.featured ? "project-featured" : ""}`} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.045 }}>
      <div className="project-preview">
        {project.image ? <img src={project.image} alt={`${project.name} preview`} loading="lazy" /> : <div className={`preview-art preview-art-${index % 4}`}><span className="preview-index">0{String(index + 1).padStart(2, "0")}</span><div className="preview-window"><span /><span /><span /><div className="preview-lines"><i /><i /><i /></div></div><span className="preview-word">{project.name.split(" ")[0]}</span></div>}
        {project.featured && <span className="featured-label"><Sparkles size={12} /> Featured</span>}
      </div>
      <div className="project-body">
        <div className="project-title-row"><h3>{project.name}</h3><span className="project-category">{categories.find(([key]) => key === project.category)?.[1] || project.category || "Other"}</span></div>
        <p className="project-description">{project.description || "Project details haven't been added yet. Update this entry in the admin dashboard."}</p>
        <div className="project-footer">
          <div className="project-tech">{(project.technologies || []).slice(0, 3).map((tech) => <span key={tech}>{tech}</span>)}</div>
          <div className="project-links">
            {project.github_url && <a href={project.github_url} aria-label={`${project.name} source code`} target="_blank" rel="noreferrer"><Github size={16} /></a>}
            {project.demo_url && <a href={project.demo_url} aria-label={`${project.name} live demo`} target="_blank" rel="noreferrer"><ExternalLink size={16} /></a>}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function Projects({ resource, githubUrl }) {
  const projects = resource.data;
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => projects.filter((project) => {
    const matchesCategory = category === "all" || project.category === category;
    const haystack = `${project.name} ${project.description || ""} ${(project.technologies || []).join(" ")}`.toLowerCase();
    return matchesCategory && haystack.includes(search.toLowerCase().trim());
  }), [category, projects, search]);
  return (
    <section className="section-wrap content-section" id="projects">
      <SectionHeading index="03" title={<>Selected<br /><span className="serif-accent">projects.</span></>} note="A selection of things I've been building, exploring, and learning from." />
      <div className="project-controls">
        <div className="filter-list" role="group" aria-label="Filter projects">
          {categories.map(([key, label]) => <button key={key} className={category === key ? "filter-button active" : "filter-button"} onClick={() => setCategory(key)}>{label}</button>)}
        </div>
        <label className="project-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a project" aria-label="Search projects" /></label>
      </div>
      <ResourceFeedback name="projects" loading={resource.loading} error={resource.error} />
      {!resource.loading && !resource.error && (filtered.length
        ? <div className="projects-grid">{filtered.map((project, index) => <ProjectCard key={project.id || project.slug || project.name} project={project} index={index} />)}</div>
        : <div className="empty-state"><Code2 size={24} /><p>{projects.length ? "No projects match that search." : "No projects have been added yet."}</p>{projects.length > 0 && <button onClick={() => { setSearch(""); setCategory("all"); }}>Clear filters</button>}</div>)}
      {githubUrl && <div className="projects-cta"><span>More experiments and code live on GitHub.</span><a href={githubUrl} target="_blank" rel="noreferrer">Browse GitHub <ArrowUpRight size={15} /></a></div>}
    </section>
  );
}

function ArticleCard({ article }) {
  const date = article.published_at ? new Date(article.published_at).toLocaleDateString("en", { month: "short", year: "numeric" }) : "";
  const isExternal = article.kind === "external";
  const card = (
    <>
      <div className="article-image">
        {article.cover_image ? <img src={article.cover_image} alt="" loading="lazy" /> : <div className={`article-cover ${isExternal ? "cover-external" : "cover-local"}`}><BookOpen size={26} /><span>{isExternal ? (article.platform || "Publication") : "Field notes"}</span></div>}
        <span className="article-kind">{isExternal ? article.platform || "External" : "My article"}</span>
      </div>
      <div className="article-content">
        <div className="article-meta">{article.category && <span>{article.category}</span>}{date && <span>{date}</span>}</div>
        <h3>{article.title}</h3>
        {article.description && <p>{article.description}</p>}
        <span className="article-read">{isExternal ? `Read on ${article.platform || "publication"}` : "Read article"} <ArrowUpRight size={14} /></span>
      </div>
    </>
  );
  if (isExternal) {
    return article.original_url
      ? <a className="article-card" href={article.original_url} target="_blank" rel="noreferrer" aria-label={`Read ${article.title} on ${article.platform || "the original site"}`}>{card}</a>
      : <article className="article-card article-unavailable">{card}</article>;
  }
  return <Link className="article-card" to={`/articles/${article.slug}`}>{card}</Link>;
}

function Writing({ resource, profile }) {
  const articles = resource.data;
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const shown = articles.filter((article) =>
    (filter === "all" || article.kind === filter)
    && (categoryFilter === "all" || article.category === categoryFilter)
    && (platformFilter === "all" || article.platform === platformFilter));
  const platforms = [...new Set(articles.filter((item) => item.kind === "external" && item.platform).map((item) => item.platform))];
  const articleCategories = [...new Set(articles.map((item) => item.category).filter(Boolean))];
  return (
    <section className="section-wrap content-section" id="writing">
      <SectionHeading index="04" title={<>Notes, ideas<br /><span className="serif-accent">& writing.</span></>} note="A home for what I'm learning — here and around the web." />
      <div className="writing-bar">
        <div className="filter-list" role="group" aria-label="Filter articles">
          {[["all", "Everything"], ["original", "My articles"], ["external", "Publications"]].map(([key, label]) => <button key={key} className={filter === key ? "filter-button active" : "filter-button"} onClick={() => setFilter(key)}>{label}</button>)}
        </div>
          <div className="article-selects">
            {articleCategories.length > 0 && <label>Category<select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="all">All categories</option>{articleCategories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>}
            {platforms.length > 0 && <label>Platform<select value={platformFilter} onChange={(event) => setPlatformFilter(event.target.value)}><option value="all">All platforms</option>{platforms.map((platform) => <option key={platform} value={platform}>{platform}</option>)}</select></label>}
          </div>
      </div>
      <ResourceFeedback name="articles" loading={resource.loading} error={resource.error} />
      {!resource.loading && !resource.error && (shown.length
        ? <div className="articles-grid">{shown.map((article) => <ArticleCard key={article.id || article.slug} article={article} />)}</div>
        : <div className="writing-empty"><div className="empty-icon"><BookOpen size={20} /></div><div><h3>{articles.length ? "No articles match these filters." : "No articles have been published yet."}</h3><p>{articles.length ? "Try a different category or platform." : "Published articles will appear here when added in Django Admin."}</p></div>{!articles.length && profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer">Connect on LinkedIn <ArrowUpRight size={14} /></a>}</div>)}
      {(profile.linkedin_url || profile.github_url) && <div className="writing-platforms"><span>Find me elsewhere</span>{profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn <ArrowUpRight size={13} /></a>}{profile.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer"><Github size={15} /> GitHub <ArrowUpRight size={13} /></a>}</div>}
    </section>
  );
}

function Contact({ profile }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [state, setState] = useState({ status: "idle", message: "" });
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  async function submit(event) {
    event.preventDefault();
    setState({ status: "sending", message: "" });
    try {
      const result = await submitContact(form);
      setState({ status: "sent", message: result.email_configured ? result.message : "Message saved. Email delivery isn't configured yet; for a direct reply, use the email link." });
      setForm({ name: "", email: "", subject: "", message: "", website: "" });
    } catch (error) {
      setState({ status: "error", message: error.message || "The service is temporarily unavailable. Please use the email link." });
    }
  }
  const email = profile.email;
  const contactHref = email ? `mailto:${email}` : profile.linkedin_url;
  return (
    <section className="contact-section" id="contact">
      <div className="section-wrap contact-wrap">
        <SectionHeading index="05" title={<>Have an idea?<br /><span className="serif-accent">Let's connect.</span></>} note="A project, a question, or just a good conversation — my inbox is open." />
        <div className="contact-grid">
          <div className="contact-aside">
            <Eyebrow>Start a conversation</Eyebrow>
            <p>I'm always glad to connect with people who care about building thoughtful things.</p>
            {contactHref && <a className="email-card" href={contactHref} target={email ? undefined : "_blank"} rel={email ? undefined : "noreferrer"}>
              <span className="email-icon">{email ? <AtSign size={17} /> : <Linkedin size={17} />}</span><span><small>{email ? "Email me" : "Connect directly"}</small><strong>{email || "Message me on LinkedIn"}</strong></span><ArrowUpRight size={17} />
            </a>}
            <div className="contact-socials">
              {profile.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={13} /></a>}
              {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={13} /></a>}
            </div>
          </div>
          <form className="contact-form" onSubmit={submit}>
            <div className="form-row">
              <label>Your name<input name="name" value={form.name} onChange={update} required maxLength={120} autoComplete="name" placeholder="Jane Smith" /></label>
              <label>Email address<input name="email" type="email" value={form.email} onChange={update} required maxLength={254} autoComplete="email" placeholder="jane@example.com" /></label>
            </div>
            <label>Subject<input name="subject" value={form.subject} onChange={update} required maxLength={180} placeholder="What would you like to discuss?" /></label>
            <label>Message<textarea name="message" value={form.message} onChange={update} required maxLength={5000} rows={4} placeholder="A little context goes a long way..." /></label>
            <label className="honeypot" aria-hidden="true">Leave this field empty<input name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" /></label>
            <div className="form-submit-row">
              <button className="button button-primary" type="submit" disabled={state.status === "sending"}>{state.status === "sending" ? "Sending..." : "Send message"}{state.status === "sent" ? <Check size={16} /> : <Send size={15} />}</button>
              {state.message && <p className={`form-message ${state.status}`} role="status">{state.message}</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer({ resources }) {
  const { pathname } = useLocation();
  const homeAnchor = pathname === "/" ? "#home" : "/#home";
  const isLoading = resources?.some((resource) => resource.loading);
  const hasError = resources?.some((resource) => resource.error);
  return (
    <footer className="site-footer section-wrap">
      <a className="footer-brand" href={homeAnchor}>ZS<span>.</span></a>
      <span className="footer-credit">Designed & built with curiosity <span>✳</span> 2026</span>
      <div className="footer-right">
        {resources && <span className={`api-status ${hasError ? "api-offline" : ""}`}><i />{isLoading ? "Loading content" : hasError ? "Some content unavailable" : "Content synced"}</span>}
        <a href="/admin/" target="_blank" rel="noreferrer">Manage site <ArrowUpRight size={12} /></a>
        <a href={homeAnchor}>Back to top <ArrowRight size={13} /></a>
      </div>
    </footer>
  );
}

function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const loadArticle = useCallback(({ signal }) => getArticle(slug, { signal }), [slug]);
  const resource = useApiResource(loadArticle, null);
  const article = resource.data?.slug === slug ? resource.data : null;
  const articleLoading = resource.loading || (!article && !resource.error);
  useEffect(() => {
    if (!article) return;
    document.title = `${article.title} — Ziaullah Saafir`;
    const description = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (description) description.content = article.description || article.title;
    if (ogTitle) ogTitle.content = document.title;
    if (ogDescription) ogDescription.content = article.description || article.title;
    return () => {
      document.title = "Ziaullah Saafir — Developer";
      if (description) description.content = "Ziaullah Saafir is a computer science student and developer building practical software with React, Django, and Python.";
      if (ogTitle) ogTitle.content = "Ziaullah Saafir — Developer";
      if (ogDescription) ogDescription.content = "Building practical solutions through code.";
    };
  }, [article]);
  return (
    <main className="article-page section-wrap">
      <button className="back-link" onClick={() => navigate("/#writing")}><ArrowLeft size={15} /> Back to writing</button>
      {article ? <article className="article-reader">
        <Eyebrow>{article.category || "Notes"}{article.published_at ? ` · ${article.published_at}` : ""}</Eyebrow>
        <h1>{article.title}</h1><p className="reader-description">{article.description}</p>
        {article.cover_image && <img className="reader-cover" src={article.cover_image} alt="" />}
        <div className="markdown-body"><ReactMarkdown>{article.content || ""}</ReactMarkdown></div>
      </article> : articleLoading
        ? <div className="reader-loading" role="status">Loading article...</div>
        : <div className="reader-error" role="alert"><BookOpen size={24} /><h1>Article unavailable</h1><p>{resource.error}</p></div>}
    </main>
  );
}

function Home({ theme, setTheme }) {
  const resources = usePortfolioData();
  const profile = resources.profile.data || {};
  return (
    <>
      <Header theme={theme} setTheme={setTheme} />
      <main>
        <Hero resource={resources.profile} />
        <About profile={profile} />
        <Skills resource={resources.skills} />
        <Projects resource={resources.projects} githubUrl={profile.github_url} />
        <Writing resource={resources.articles} profile={profile} />
        <Contact profile={profile} />
      </main>
      <Footer resources={Object.values(resources)} />
    </>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("portfolio-theme") || "dark");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Home theme={theme} setTheme={setTheme} />} />
        <Route path="/articles/:slug" element={<><Header theme={theme} setTheme={setTheme} /><ArticlePage /><Footer /></>} />
        <Route path="*" element={<Home theme={theme} setTheme={setTheme} />} />
      </Routes>
    </AnimatePresence>
  );
}
