export const initialProfile = {
  name: "Ziaullah Saafir",
  headline: "Building Practical Solutions Through Code.",
  introduction:
    "I'm a developer and computer science student who enjoys turning ideas into useful software. I build with the web, keep learning, and care about how things work behind the interface.",
  about:
    "I'm studying Computer Science at FAST University, Peshawar Campus. My journey spans frontend interfaces, backend systems, and the ideas that connect them. I enjoy learning by building practical projects and improving them one step at a time. Looking ahead, I'm especially interested in deepening my understanding of AI and software engineering as I grow as a developer.",
  education: "BS Computer Science · FAST University, Peshawar Campus",
  interests: ["Software Engineering", "System Design", "Artificial Intelligence", "Machine Learning"],
  github_url: "https://github.com/ZiaSaafir",
  linkedin_url: "https://www.linkedin.com/in/zia-saafir-7b8562355/",
  availability_enabled: false,
  avatar: "",
};

export const initialProjects = [
  {
    id: "agriculture-shop-management-pos",
    name: "Agriculture Shop Management & POS",
    slug: "agriculture-shop-management-pos",
    description:
      "Agriculture Shop Management & POS System built with Django REST Framework, React, and PostgreSQL. Includes inventory, flexible units, sales, purchases, customer and supplier ledgers, partial payments, returns, reports, and backup/restore, with a scalable foundation for future multi-branch and SaaS deployment.",
    category: "full-stack",
    technologies: ["Django REST Framework", "React", "PostgreSQL"],
    github_url: "https://github.com/ZiaSaafir/Agriculture-Shop-Management-POS",
    featured: true,
  },
  {
    id: "clinic-management-system-api",
    name: "Clinic Management System API",
    slug: "clinic-management-system-api",
    description:
      "A Django REST Framework based Clinic Management System with patients, doctors, appointments, prescriptions, billing, reports, Swagger API docs, and Bootstrap demo dashboard.",
    category: "backend",
    technologies: ["Django REST Framework", "Bootstrap"],
    github_url: "https://github.com/ZiaSaafir/clinic-management-system-api",
  },
  {
    id: "ai-assistant-app",
    name: "AI Assistant App",
    slug: "ai-assistant-app",
    description:
      "A beautiful, responsive AI chat application built with React that uses Google's Gemini AI to answer your questions. Features chat history, quick questions, and a clean UI.",
    category: "ai-ml",
    technologies: ["React", "Google Gemini"],
    github_url: "https://github.com/ZiaSaafir/AI-Assistant-App",
    featured: true,
  },
  { id: "full-stack-todo-app", name: "Full Stack Todo App", category: "full-stack", technologies: [] },
  { id: "digital-library-system", name: "Digital Library System", category: "backend", technologies: [] },
  { id: "epic-full-stack-e-commerce-app", name: "Epic Full-Stack E-commerce App", category: "full-stack", technologies: [] },
];

export const initialSkills = [
  { name: "Python", group: "languages" },
  { name: "JavaScript", group: "languages" },
  { name: "C++", group: "languages" },
  { name: "React", group: "frontend" },
  { name: "HTML", group: "frontend" },
  { name: "CSS", group: "frontend" },
  { name: "Django", group: "backend" },
  { name: "Django REST Framework", group: "backend" },
  { name: "REST APIs", group: "backend" },
  { name: "MySQL", group: "databases" },
  { name: "SQLite", group: "databases" },
  { name: "Artificial Intelligence", group: "ai-ml" },
  { name: "Machine Learning", group: "ai-ml" },
  { name: "Deep Learning", group: "ai-ml" },
  { name: "Generative AI", group: "ai-ml" },
  { name: "Git & GitHub", group: "tools" },
];

export const skillGroups = [
  ["languages", "Programming Languages"],
  ["frontend", "Frontend Development"],
  ["backend", "Backend Development"],
  ["databases", "Databases"],
  ["ai-ml", "AI & Machine Learning"],
  ["tools", "Development Tools"],
];

export const categories = [
  ["all", "All projects"],
  ["full-stack", "Full-stack"],
  ["backend", "Backend"],
  ["frontend", "Frontend"],
  ["ai-ml", "AI / ML"],
  ["other", "Other"],
];
