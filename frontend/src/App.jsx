import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, AtSign,
  BookOpen, Check, Code2, ExternalLink, Github, Layers3, Linkedin,
  Menu, Moon, Search, Send, Sparkles, Sun, X,
} from "lucide-react";
import {
  categories, initialProfile, initialProjects, initialSkills, skillGroups,
} from "./content.js";

const API = import.meta.env.VITE_API_URL || "";
const defaultArticles = [];

async function getJSON(path) {
  const response = await fetch(`${API}/api/${path}`);
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}

function usePortfolioData() {
  const [data, setData] = useState({
    profile: initialProfile,
    projects: initialProjects,
    articles: defaultArticles,
    skills: initialSkills,
    connected: true,
  });

  useEffect(() => {
    let active = true;
    Promise.all([
      getJSON("profile/"),
      getJSON("projects/"),
      getJSON("articles/"),
      getJSON("skills/"),
    ])
      .then(([profile, projects, articles, skills]) => {
        if (!active) return;
        setData({
          profile: { ...initialProfile, ...profile },
          projects,
          articles,
          skills,
          connected: true,
        });
      })
      .catch(() => {
        if (active) setData((current) => ({ ...current, connected: false }));
      });
    return () => { active = false; };
  }, []);

  return data;
}

function IconLink({ href, label, children }) {
  return (
    <a className="icon-link" href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
      {children}
    </a>
  );
}

function Header({ theme, setTheme, profile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const homeAnchor = (anchor) => pathname === "/" ? anchor : `/${anchor}`;
  const links = [["About", "#about"], ["Skills", "#skills"], ["Projects", "#projects"], ["Writing", "#writing"]];
  return (
    <header className="site-header">
      <a className="wordmark" href={homeAnchor("#home")} aria-label="Ziaullah Saafir home">
        <span className="wordmark-mark">Z</span><span>ziaullah<span className="wordmark-muted">.dev</span></span>
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

function Hero({ profile }) {
  const roles = ["Full-stack developer", "Backend developer", "React & Django builder", "AI / ML enthusiast"];
  const headlineWords = (profile.headline || initialProfile.headline).split(" ");
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
        <Eyebrow>{profile.name || initialProfile.name} · computer science student · developer</Eyebrow>
        {profile.availability_enabled && profile.availability_label && <p className="availability-label"><span />{profile.availability_label}</p>}
        <h1>{headlineLead}{headlineAccent && <><br /><span className="serif-accent">{headlineAccent}</span></>}</h1>
        <p className="hero-intro">{profile.introduction || initialProfile.introduction}</p>
        <p className="typing-line"><span className="typing-prefix">Currently exploring</span> <span key={roleIndex} className="typing-word">{roles[roleIndex]}</span><span className="typing-cursor">_</span></p>
        <div className="hero-actions">
          <a className="button button-primary" href="#projects">Explore projects <ArrowDownRight size={16} /></a>
          <a className="button button-quiet" href="#contact">Get in touch <ArrowUpRight size={15} /></a>
        </div>
        <div className="hero-socials">
          <IconLink href={profile.github_url || initialProfile.github_url} label="GitHub"><Github size={17} /></IconLink>
          <IconLink href={profile.linkedin_url || initialProfile.linkedin_url} label="LinkedIn"><Linkedin size={17} /></IconLink>
          {profile.cv ? <a className="cv-link" href={profile.cv} target="_blank" rel="noreferrer">Download CV <ArrowDown size={14} /></a> : <button className="cv-link cv-disabled" type="button" disabled title="Upload a CV in Django Admin to enable this download">Download CV <ArrowDown size={14} /></button>}
        </div>
      </div>
      <div className="hero-art" aria-label="Profile placeholder">
        <div className="art-grid" />
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="profile-monogram">
          {profile.avatar ? <img className="profile-image" src={profile.avatar} alt={`${profile.name} profile`} /> : <><span>ZS</span><span className="monogram-caption">Profile photo<br />add in admin</span></>}
        </div>
        <div className="float-card float-code"><Code2 size={15} /><span>curiosity += 1</span></div>
        <div className="float-card float-idea"><Sparkles size={15} /><span>build · learn · repeat</span></div>
        <div className="art-caption"><span>01 — 2026</span><span>Peshawar, PK</span></div>
      </div>
      <div className="hero-bottom"><span>Scroll to explore</span><span className="scroll-line" /></div>
    </section>
  );
}

function About({ profile }) {
  const interests = profile.interests?.length ? profile.interests : initialProfile.interests;
  return (
    <section className="section-wrap content-section" id="about">
      <SectionHeading index="01" title={<>A little about<br /><span className="serif-accent">the builder.</span></>} note="Grounded in fundamentals. Curious about what comes next." />
      <div className="about-grid">
        <div className="about-copy">
          <Eyebrow>Who I am</Eyebrow>
          <p className="about-lead">{profile.about || initialProfile.about}</p>
          <p className="body-copy">I like understanding how a product works from the first interaction to the data behind it. That curiosity has led me from building interfaces to exploring APIs, databases, and the craft of thoughtful software.</p>
          <div className="interest-list">{interests.map((interest) => <span className="interest-chip" key={interest}>{interest}</span>)}</div>
        </div>
        <div className="journey-card">
          <div className="journey-icon"><BookOpen size={19} /></div>
          <p className="card-kicker">Currently studying</p>
          <h3>{profile.education || initialProfile.education}</h3>
          <div className="journey-rule" />
          <p className="body-copy">Building a strong foundation in computer science while turning new ideas into projects and practical experience.</p>
          <span className="journey-foot">Learning is part of the work <ArrowUpRight size={14} /></span>
        </div>
      </div>
    </section>
  );
}

function Skills({ skills }) {
  return (
    <section className="section-wrap content-section" id="skills">
      <SectionHeading index="02" title={<>Tools of<br /><span className="serif-accent">the trade.</span></>} note="A growing toolkit, organized by where I put it to work." />
      <div className="skills-grid">
        {skillGroups.map(([group, label], index) => {
          const items = skills.filter((skill) => skill.group === group);
          return (
            <motion.article className="skill-card" key={group} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.06 }}>
              <div className="skill-card-top"><span className="skill-number">0{index + 1}</span><Layers3 size={16} /></div>
              <h3>{label}</h3>
              <div className="skill-tags">{(items.length ? items : []).map((skill) => <span key={skill.id || skill.name}>{skill.name}</span>)}</div>
              {!items.length && <span className="muted-caption">Add skills in the admin dashboard</span>}
            </motion.article>
          );
        })}
      </div>
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

function Projects({ projects }) {
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
      {filtered.length ? <div className="projects-grid">{filtered.map((project, index) => <ProjectCard key={project.id || project.slug || project.name} project={project} index={index} />)}</div> : <div className="empty-state"><Code2 size={24} /><p>No projects match that search.</p><button onClick={() => { setSearch(""); setCategory("all"); }}>Clear filters</button></div>}
      <div className="projects-cta"><span>More experiments and code live on GitHub.</span><a href={initialProfile.github_url} target="_blank" rel="noreferrer">Browse GitHub <ArrowUpRight size={15} /></a></div>
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

function Writing({ articles }) {
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
      {shown.length ? <div className="articles-grid">{shown.map((article) => <ArticleCard key={article.id || article.slug} article={article} />)}</div> : <div className="writing-empty"><div className="empty-icon"><BookOpen size={20} /></div><div><h3>The next note is taking shape.</h3><p>Articles and external publications will appear here as they’re added.</p></div><a href={initialProfile.linkedin_url} target="_blank" rel="noreferrer">Connect on LinkedIn <ArrowUpRight size={14} /></a></div>}
      <div className="writing-platforms"><span>Find me elsewhere</span><a href={initialProfile.linkedin_url} target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn <ArrowUpRight size={13} /></a><a href={initialProfile.github_url} target="_blank" rel="noreferrer"><Github size={15} /> GitHub <ArrowUpRight size={13} /></a></div>
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
      const response = await fetch(`${API}/api/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) {
        const detail = Object.values(result).flat().find((item) => typeof item === "string");
        throw new Error(detail || "Your message could not be sent. Please try the email link.");
      }
      setState({ status: "sent", message: result.email_configured ? result.message : "Message saved. Email delivery isn't configured yet; for a direct reply, use the email link." });
      setForm({ name: "", email: "", subject: "", message: "", website: "" });
    } catch (error) {
      setState({ status: "error", message: error.message || "The service is temporarily unavailable. Please use the email link." });
    }
  }
  const email = profile.email;
  const contactHref = email ? `mailto:${email}` : (profile.linkedin_url || initialProfile.linkedin_url);
  return (
    <section className="contact-section" id="contact">
      <div className="section-wrap contact-wrap">
        <SectionHeading index="05" title={<>Have an idea?<br /><span className="serif-accent">Let's connect.</span></>} note="A project, a question, or just a good conversation — my inbox is open." />
        <div className="contact-grid">
          <div className="contact-aside">
            <Eyebrow>Start a conversation</Eyebrow>
            <p>I'm always glad to connect with people who care about building thoughtful things.</p>
            <a className="email-card" href={contactHref} target={email ? undefined : "_blank"} rel={email ? undefined : "noreferrer"}>
              <span className="email-icon">{email ? <AtSign size={17} /> : <Linkedin size={17} />}</span><span><small>{email ? "Email me" : "Connect directly"}</small><strong>{email || "Message me on LinkedIn"}</strong></span><ArrowUpRight size={17} />
            </a>
            <div className="contact-socials">
              <a href={profile.github_url || initialProfile.github_url} target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={13} /></a>
              <a href={profile.linkedin_url || initialProfile.linkedin_url} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={13} /></a>
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

function Footer({ profile, connected }) {
  const { pathname } = useLocation();
  const homeAnchor = pathname === "/" ? "#home" : "/#home";
  return (
    <footer className="site-footer section-wrap">
      <a className="footer-brand" href={homeAnchor}>ZS<span>.</span></a>
      <span className="footer-credit">Designed & built with curiosity <span>✳</span> 2026</span>
      <div className="footer-right">
        <span className={`api-status ${connected ? "" : "api-offline"}`}><i />{connected ? "Content synced" : "Showing saved portfolio content"}</span>
        <a href="/admin/" target="_blank" rel="noreferrer">Manage site <ArrowUpRight size={12} /></a>
        <a href={homeAnchor}>Back to top <ArrowRight size={13} /></a>
      </div>
    </footer>
  );
}

function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    getJSON(`articles/${encodeURIComponent(slug)}/`)
      .then((result) => { if (active) setArticle(result); })
      .catch(() => { if (active) setError("This article could not be found or is not published."); });
    return () => { active = false; };
  }, [slug]);
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
      </article> : error ? <div className="reader-error"><BookOpen size={24} /><h1>Article unavailable</h1><p>{error}</p></div> : <div className="reader-loading">Loading article...</div>}
    </main>
  );
}

function Home({ theme, setTheme }) {
  const data = usePortfolioData();
  return (
    <>
      <Header theme={theme} setTheme={setTheme} profile={data.profile} />
      {!data.connected && <div className="offline-notice" role="status">Content API unavailable; showing the saved portfolio information.</div>}
      <main>
        <Hero profile={data.profile} />
        <About profile={data.profile} />
        <Skills skills={data.skills} />
        <Projects projects={data.projects} />
        <Writing articles={data.articles} />
        <Contact profile={data.profile} />
      </main>
      <Footer profile={data.profile} connected={data.connected} />
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
        <Route path="/articles/:slug" element={<><Header theme={theme} setTheme={setTheme} profile={initialProfile} /><ArticlePage /><Footer profile={initialProfile} connected /></>} />
        <Route path="*" element={<Home theme={theme} setTheme={setTheme} />} />
      </Routes>
    </AnimatePresence>
  );
}
