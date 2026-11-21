// Technology skills grouped by category. `level` is intentionally qualitative —
// no invented percentages.

export const skillCategories = [
  {
    id: "frontend",
    title: "Frontend",
    note: "Interfaces",
    skills: [
      { name: "HTML" },
      { name: "CSS" },
      { name: "JavaScript" },
      { name: "React" },
      { name: "Vite" },
      { name: "Tailwind CSS" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    note: "Services & APIs",
    skills: [
      { name: "Node.js" },
      { name: "Express.js" },
      { name: "Python" },
      { name: "FastAPI" },
    ],
  },
  {
    id: "automation",
    title: "Automation",
    note: "Core focus",
    featured: true,
    skills: [
      { name: "Selenium" },
      { name: "SeleniumBase" },
      { name: "Playwright" },
      { name: "Web Scraping" },
      { name: "Browser Automation" },
      { name: "Data Automation" },
    ],
  },
  {
    id: "database",
    title: "Database",
    note: "Storage",
    skills: [
      { name: "MongoDB" },
      { name: "Mongoose" },
      { name: "MySQL" },
      { name: "SQL" },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & Deployment",
    note: "Infrastructure",
    skills: [
      { name: "AWS" },
      { name: "EC2" },
      { name: "ECS" },
      { name: "Vercel" },
      { name: "Railway" },
      { name: "Render" },
      { name: "Cloudflare" },
    ],
  },
  {
    id: "tools",
    title: "Tools & Data",
    note: "Workflow",
    skills: [
      { name: "Git" },
      { name: "GitHub" },
      { name: "Figma" },
      { name: "Pandas" },
      { name: "OpenPyXL" },
      { name: "Redis" },
      { name: "Celery" },
    ],
  },
];
