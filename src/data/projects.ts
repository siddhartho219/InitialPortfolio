import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "portfolio-cms",
    title: "Portfolio CMS",
    description:
      "An auth-gated admin panel with a schema-driven CRUD engine (Firebase Auth + Firestore) that manages this site's own content — Skills, Projects, and Experience all run through one reusable component, plus a live analytics view and a contact-message inbox. No redeploy needed to edit a word.",
    longDescription:
      "Editing portfolio content used to mean redeploying code for every text change. Built an auth-gated /dashboard with a single, reusable CollectionManager component driven by a field-schema config — the same component powers CRUD for Skills, Projects, and Experience by just changing which fields it's given, rather than writing three separate forms. Firestore handles storage, so content updates ship instantly without touching the codebase. Also includes a lightweight analytics view and an inbox for messages submitted through the site's contact form.",
    tech: ["Next.js", "Firebase Auth", "Firestore", "TypeScript"],
    image: "/images/projects/portfolio-cms.svg",
    featured: true,
    github: "https://github.com/siddhartho219/InitialPortfolio/tree/main/src/app/dashboard",
    status: "Live · Private",
    category: "Full-Stack",
  },
  {
    slug: "restaurant-robot",
    title: "Restaurant Delivery Robot",
    description:
      "Autonomous delivery robot built for an Electronics Lab course — obstacle avoidance and path-following on Arduino.",
    longDescription:
      "Built as a course project for Electronics Lab: an Arduino-based robot using ultrasonic and IR sensors for obstacle avoidance and basic path-following logic. The linked video demo shows the full system working end-to-end, both the hardware (sensors, motors, chassis) and the software (control logic) running together live.",
    tech: ["Arduino", "C++", "Sensors"],
    image: "/images/projects/restaurant-robot.svg",
    featured: false,
    video: "https://youtu.be/f3kyGRTmpDU?si=2mJFxcEOoo4LgCRj",
    status: "Course Project",
    category: "Robotics",
  },
  {
    slug: "green-computing-research",
    title: "Green Computing Research",
    description:
      "Co-authored research paper from a Green Computing course, in preparation for short/blind-review submission to ICCIT.",
    longDescription:
      "Working with my course team on a research paper produced during our Green Computing course. Currently preparing it as a short, blind-review submission to ICCIT — not yet published, actively in progress.",
    tech: ["Research", "Academic Writing", "Green Computing"],
    image: "/images/projects/green-computing-research.svg",
    featured: false,
    status: "In Review · ICCIT",
    category: "Research",
  },
  {
    slug: "ieee-template-crawler",
    title: "IEEE Template Crawler",
    description:
      "Automates fetching IEEE's official LaTeX/Word templates in bulk, with retry logic and structured metadata output.",
    longDescription:
      "A Python + Selenium tool that drives IEEE's template selector across roughly 200 publications, handling flaky page loads with retry logic, de-duplicating repeated templates, and exporting structured JSON metadata for each one. Built to save manual lookup time when preparing conference or journal submissions.",
    tech: ["Python", "Selenium", "Automation"],
    image: "/images/projects/ieee-template-crawler.svg",
    featured: false,
    github: "https://github.com/siddhartho219/ieee_template_crawler",
    category: "Tools",
  },
  {
    slug: "openshare",
    title: "OpenShare",
    description:
      "Local Wi-Fi file transfer app for Android/iOS — no internet, no cloud, direct device-to-device transfer.",
    longDescription:
      "A Flutter app for transferring files between nearby devices over local Wi-Fi. Uses mDNS for automatic peer discovery with a QR-code fallback, HTTP range requests so interrupted transfers resume instead of restarting, and SHA-256 verification with automatic retry on corrupted chunks.",
    tech: ["Flutter", "Dart", "Networking"],
    image: "/images/projects/openshare.svg",
    featured: false,
    github: "https://github.com/siddhartho219/OpenShare",
    status: "v1",
    category: "Mobile",
  },
  {
    slug: "assistive-touch",
    title: "Assistive Touch",
    description:
      "A personal Android utility built to replace a broken volume button — ad-free and permission-stable.",
    longDescription:
      "After my phone's physical volume button stopped working, I tried an existing AssistiveTouch app from the Play Store, but it showed ads while online and had permission issues that made it stop working after a few hours. I built my own version scoped to exactly what I needed: a floating on-screen control, no ads, and stable permission handling.",
    tech: ["Flutter", "Dart", "Android"],
    image: "/images/projects/assistive-touch.svg",
    featured: false,
    github: "https://github.com/siddhartho219/Assistive_touch",
    status: "v1",
    category: "Mobile",
  },
  {
    slug: "bdletter",
    title: "BDletter",
    description:
      "A LaTeX document class for authentic Bangladeshi official letters — school, bank, and government formats.",
    longDescription:
      "A custom LaTeX class that reproduces the specific formatting conventions of official Bangladeshi letters — mixed Bangla/English text, bundled fonts, and layout templates for school, bank, and government correspondence — so producing a properly formatted official letter doesn't mean manually fighting with layout in Word every time.",
    tech: ["LaTeX", "Typography"],
    image: "/images/projects/bdletter.svg",
    featured: false,
    github: "https://github.com/siddhartho219/BDletter",
    category: "Tools",
  },
];
