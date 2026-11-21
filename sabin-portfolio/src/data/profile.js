// Central, editable profile data. Update this file to change site content —
// no need to touch any UI components.

import sabinPhoto from "../assets/profile/sabin.webp";

export const profile = {
  name: "Sabin Prasad Subedi",
  initials: "S",
  role: "Software Developer | Automation & Web Technologies",
  tagline:
    "I build reliable automation systems, scalable web applications, and efficient digital workflows — from browser automation and large-scale scraping pipelines to full-stack products and the teams that ship them.",
  positioning: [
    "Automation Engineer",
    "Software Developer",
    "Web Scraping Specialist",
    "Technical Team Leader",
  ],
  location: "Lagankhel, Lalitpur, Nepal",
  email: "subedis784@gmail.com",
  phone: "+977 9862108527",
  photo: sabinPhoto,
  resumeUrl: "/resume.pdf",
  social: {
    github: "https://github.com/Sabinsu",
    linkedin: "https://www.linkedin.com/in/sabin-subedi-353534230/",
    email: "mailto:subedis784@gmail.com",
  },
  stats: [
    { label: "Professional Experience", value: "2+ Yrs" },
    { label: "Core Focus", value: "Automation" },
    { label: "Specialty", value: "Web Scraping" },
    { label: "Also Leading", value: "Engineering Teams" },
  ],
  about: {
    paragraphs: [
      "I'm a software developer based in Nepal, working at the intersection of automation engineering and full-stack web development. My day-to-day is split between building browser automation and web scraping systems that run reliably at scale, and shipping the backend and frontend services that surround them.",
      "At AutoLab Technologies, I lead a small engineering team while staying hands-on — writing the Selenium and Playwright automation myself, designing the FastAPI services and Celery task queues that process the data, and coordinating the project alongside teammates.",
      "I care about systems that keep working after the demo: automation that survives site changes, APIs that fail predictably, and code a teammate can pick up without a walkthrough.",
    ],
    highlights: [
      {
        title: "Automation & Scraping",
        description:
          "Browser automation and structured data extraction with Selenium, SeleniumBase and Playwright.",
      },
      {
        title: "Backend Systems",
        description:
          "APIs and background processing with FastAPI, Redis and Celery, deployed on AWS.",
      },
      {
        title: "Web Development",
        description:
          "Full-stack products with React, Node.js/Express, and MongoDB/MySQL.",
      },
      {
        title: "Team Leadership",
        description:
          "Coordinating projects, delegating tasks, and guiding technical decisions as Team Leader.",
      },
    ],
  },
};
