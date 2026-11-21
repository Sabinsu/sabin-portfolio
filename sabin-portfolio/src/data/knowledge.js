// Rule-based FAQ used when the AI API is not configured (or unreachable).
// Every answer is generated from the same data files that power the site,
// so the assistant can never contradict (or invent beyond) the portfolio.

import { profile } from "./profile";
import { experience, education } from "./experience";
import { skillCategories } from "./skills";
import { projects } from "./projects";

export const GREETING =
  "Hello! Welcome to Sabin's Digital Universe. I'm Sabin's AI Assistant. You can ask me anything about his experience, technical skills, projects, education, automation work, and professional background. How can I help you today?";

export const suggestedQuestions = [
  "Who is Sabin Prasad Subedi?",
  "What programming languages does he know?",
  "What automation projects has he worked on?",
  "Does he have Selenium and Playwright experience?",
  "What is his professional experience?",
  "Tell me about ShopZone.",
  "What is his educational background?",
  "Can I hire him?",
  "How can I contact him?",
  "Can I download his resume?",
];

const skillsOf = (id) => skillCategories.find((c) => c.id === id)?.skills.map((s) => s.name) ?? [];
const list = (arr) => (arr.length > 1 ? `${arr.slice(0, -1).join(", ")} and ${arr[arr.length - 1]}` : arr[0] ?? "");

const job = experience[0];
const shop = projects.find((p) => p.id === "shopzone");

const L = {
  contact: { label: "Contact section", href: "#contact" },
  projects: { label: "Projects", href: "#projects" },
  experience: { label: "Experience", href: "#experience" },
  skills: { label: "Skills", href: "#skills" },
  automation: { label: "Automation Lab", href: "#automation" },
  education: { label: "Education", href: "#education" },
  resume: { label: "Download resume", href: profile.resumeUrl },
  github: { label: "GitHub", href: profile.social.github },
  linkedin: { label: "LinkedIn", href: profile.social.linkedin },
  email: { label: "Email Sabin", href: profile.social.email },
  shopDemo: { label: "ShopZone live demo", href: shop?.links?.demo },
  shopCode: { label: "ShopZone on GitHub", href: shop?.links?.github },
  ai: { label: "AI Lab", href: "#ai-lab" },
};

const intents = [
  {
    test: /^(hi|hello|hey|namaste|good (morning|afternoon|evening))\b/,
    reply: () => ({
      text: "Hi there! I can tell you about Sabin's experience, skills, projects, education, or how to get in touch. What would you like to know?",
      expression: "happy",
    }),
  },
  {
    test: /(thank|thanks|great|awesome|nice)/,
    reply: () => ({ text: "You're welcome! Anything else you'd like to know about Sabin's work?", expression: "happy" }),
  },
  {
    test: /(resume|cv|curriculum)/,
    reply: () => ({
      text: "Yes. Sabin's resume is available as a PDF. You can also preview it in the Resume section of this page.",
      links: [L.resume, { label: "Resume section", href: "#resume" }],
      expression: "happy",
    }),
  },
  {
    test: /(hire|hiring|available|availability|work with|freelance|opportunit|job|recruit)/,
    reply: () => ({
      text: `Sabin is open to professional opportunities. His CV lists him as available full-time. He currently works as ${job.role} at AutoLab Technologies, and services he offers include web automation, web scraping, software and backend development, e-commerce development and technical team leadership. The best way to start is a message through the contact section or by email.`,
      links: [L.contact, L.email, L.linkedin],
      expression: "happy",
    }),
  },
  {
    test: /(contact|reach|email|phone|call|linkedin|get in touch|connect)/,
    reply: () => ({
      text: `You can reach Sabin at ${profile.email} or on ${profile.phone}. He is also on LinkedIn and GitHub, and you can use the contact form on this page.`,
      links: [L.email, L.linkedin, L.github, L.contact],
    }),
  },
  {
    test: /(shopzone|shop zone|e-?commerce|store)/,
    reply: () => ({
      text: `${shop.title} is a full-stack e-commerce platform built with ${list(shop.tech)}. Features: ${list(shop.features.map((f) => f.toLowerCase()))}. It is deployed live, and the source code is on GitHub. Open the project in the Projects section for screenshots and the case study.`,
      links: [L.shopDemo, L.shopCode, L.projects],
      expression: "happy",
    }),
  },
  {
    test: /(selenium|playwright|seleniumbase)/,
    reply: () => ({
      text: `Yes. Selenium, SeleniumBase and Playwright are part of Sabin's daily automation work at AutoLab Technologies, where he builds browser automation and web scraping workflows in Python.`,
      links: [L.automation, L.experience],
    }),
  },
  {
    test: /(automation|scrap|crawl|extract)/,
    reply: () => ({
      text: `Automation is Sabin's core focus. At AutoLab Technologies he builds browser automation and web scraping pipelines with ${list(skillsOf("automation").slice(0, 3))}, processes data with Pandas, and supports it with FastAPI, Redis and Celery services on AWS. The Automation Lab section shows the typical workflow.`,
      links: [L.automation, L.experience],
    }),
  },
  {
    test: /(language|programming|code in|coding|tech stack|technolog|skill|stack)/,
    reply: () => ({
      text: `Sabin works with Python and JavaScript (plus HTML, CSS and SQL). Frontend: ${list(skillsOf("frontend"))}. Backend: ${list(skillsOf("backend"))}. Automation: ${list(skillsOf("automation"))}. Databases: ${list(skillsOf("database"))}. Cloud: ${list(skillsOf("cloud"))}.`,
      links: [L.skills],
    }),
  },
  {
    test: /(experience|work|career|autolab|company|job history|role|lead|team)/,
    reply: () => ({
      text: `Since ${job.period.split(" ")[0]}, Sabin has been ${job.role} at ${job.company}. He designs browser automation and scraping workflows, builds backend services (FastAPI, Redis, Celery, AWS), and leads a technical team: coordinating projects, delegating tasks and guiding technical decisions.`,
      links: [L.experience],
    }),
  },
  {
    test: /(educat|study|studies|degree|diploma|bit|college|school|university|qualif)/,
    reply: () => ({
      text: `${education[0].degree} (${education[0].period.replace("Completed ", "completed in ")}) from ${education[0].institution}, and he is currently studying ${education[1].degree} at ${education[1].institution}.`,
      links: [L.education],
    }),
  },
  {
    test: /(machine learning|\bml\b|\bai\b|artificial|neural|deep learning|llm)/,
    reply: () => ({
      text: "To be transparent: Sabin's professional experience is in automation, web scraping, and backend and web development. AI and machine learning are areas he is exploring, and he does not claim professional ML experience. This site's assistant is an example of AI integration through a secure serverless API. The AI Lab section separates what he has done from what he's exploring.",
      links: [L.ai],
    }),
  },
  {
    test: /(who|about|introduce|tell me about (sabin|him))/,
    reply: () => ({
      text: `${profile.name} is a ${profile.role.replace(" | ", ", focused on ")} based in Nepal. He is ${job.role} at ${job.company} (${job.period.split(" ")[0]} to present) and is currently studying a Bachelor in Information Technology. He is an automation engineer, software developer, web scraping specialist and technical team leader.`,
      links: [L.experience, L.projects],
      expression: "happy",
    }),
  },
  {
    test: /(project|built|portfolio|work samples)/,
    reply: () => ({
      text: `Sabin's featured project is ${shop.title}, a full-stack e-commerce platform, with a live demo and source code. At work he builds Python automation and web scraping systems, though the details of employer projects aren't public.`,
      links: [L.projects, L.shopDemo, L.github],
    }),
  },
];

export function answerLocally(question) {
  const q = question.toLowerCase().trim();
  for (const intent of intents) {
    if (intent.test.test(q)) {
      const r = intent.reply();
      return { links: [], expression: "neutral", ...r };
    }
  }
  return {
    text: "I'm not sure about that one, and I don't want to guess about Sabin. I can help with his experience, skills, projects, education and contact details. For anything else, please reach out to him directly.",
    links: [L.contact, L.email],
    expression: "thinking",
  };
}
