import { Fragment } from "react";

import About from "@/components/about/About";
import Blog from "@/components/blog/Blog";
import Contact from "@/components/contact/Contact";
import Experience from "@/components/experience/Experience";
import Hero from "@/components/hero/Hero";
import ProjectGrid from "@/components/projects/ProjectGrid";
import Skills from "@/components/skills/Skills";

export default function Page() {
  return (
    <Fragment>
      <Hero />
      <About />
      <Experience />
      <ProjectGrid />
      <Blog />
      <Skills />
      <Contact />
    </Fragment>
  );
}
