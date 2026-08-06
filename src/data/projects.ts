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
      "A research paper on reducing the environmental cost of running large language models — submitted for conference review, now being extended into a full paper for journal submission.",
    impact: "→ 1 paper, submission-ready for ICCIT",
    longDescription:
      "Co-authored a research paper on green computing, focused on reducing the energy and compute footprint of running large language models. Submitted a short version for blind-review to ICCIT, and currently extending the work into a full paper targeting journal publication.",
    tech: ["Research", "Academic Writing", "Green Computing"],
    image: "/images/projects/green-computing-research.svg",
    featured: false,
    status: "Conference Review → Journal (In Progress)",
    category: "Research",
  },
  {
    slug: "ieee-template-crawler",
    title: "IEEE Template Crawler",
    description:
      "Manually hunting down the right IEEE template for each publication wastes real time. Built a Python + Selenium crawler that drives IEEE's official template selector across 200+ publications, with retry logic for flaky loads and structured JSON output per template.",
    impact: "→ 200+ publications, structured JSON output",
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
      "Sharing files between nearby devices usually means routing through the cloud. Built a Flutter app using mDNS for automatic peer discovery (QR fallback), HTTP range requests so interrupted transfers resume instead of restarting, and SHA-256 verification with automatic retry on corrupted chunks.",
    impact: "→ direct device-to-device, resumable transfers",
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
      "My phone's physical volume button stopped working, and the existing AssistiveTouch apps I tried showed ads and lost their permissions after a few hours. Built a scoped-down replacement: a floating on-screen control, no ads, stable permission handling.",
    impact: "→ daily-use replacement, zero ads",
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
      "Producing a properly formatted official Bangladeshi letter usually means re-fighting layout in Word every time. Built a LaTeX document class that handles mixed Bangla/English text, bundled fonts, and ready-made templates for school, bank, and government letter formats.",
    impact: "→ 3 official letter formats, reusable class",
    longDescription:
      "A custom LaTeX class that reproduces the specific formatting conventions of official Bangladeshi letters — mixed Bangla/English text, bundled fonts, and layout templates for school, bank, and government correspondence — so producing a properly formatted official letter doesn't mean manually fighting with layout in Word every time.",
    tech: ["LaTeX", "Typography"],
    image: "/images/projects/bdletter.svg",
    featured: false,
    github: "https://github.com/siddhartho219/BDletter",
    category: "Tools",
  },
];
