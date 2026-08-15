import type { Metadata } from "next";
import type { Project } from "@/types";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, GitBranch, Play } from "lucide-react";

import { projects } from "@/data/projects";
import Container from "@/components/layout/Container";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project: Project | undefined = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <main className="bg-brand-bg text-brand-text">
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0">
          <Container>
            <div className="pb-10">
              <span className="inline-flex w-fit rounded-full bg-brand-blue/10 px-2 py-1 text-xs text-brand-blue">
                {project.category}
              </span>
              <h1 className="mt-3 font-heading text-3xl font-bold text-brand-text md:text-5xl">
                {project.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-brand-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </div>

      <Container>
        <div className="py-14">
          <Link
            href="/projects"
            className="text-sm text-brand-muted transition-colors hover:text-brand-blue"
          >
            ← All Projects
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="font-heading text-2xl font-bold text-brand-text">
                Overview
              </h2>
              <p className="mt-4 text-brand-muted">{project.longDescription}</p>
            </div>

            <GlassCard hover={false} className="p-6">
              <h3 className="font-heading text-lg font-semibold text-brand-text">
                Tech stack
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-brand-muted">
                {project.tech.map((t) => (
                  <li key={t} className="flex items-center justify-between">
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-3">
                {project.github ? (
                  <GlowButton
                    variant="primary"
                    href={project.github}
                    className="w-full justify-center"
                  >
                    <span className="inline-flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                      GitHub
                    </span>
                  </GlowButton>
                ) : null}

                {project.video ? (
                  <GlowButton
                    variant="primary"
                    href={project.video}
                    className="w-full justify-center"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      Watch Demo
                    </span>
                  </GlowButton>
                ) : null}

                {project.demo ? (
                  <GlowButton
                    variant="outline"
                    href={project.demo}
                    className="w-full justify-center"
                  >
                    <span className="inline-flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </span>
                  </GlowButton>
                ) : null}
              </div>
            </GlassCard>
          </div>
        </div>
      </Container>
    </main>
  );
}
