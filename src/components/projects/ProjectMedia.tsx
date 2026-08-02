"use client";

import ProjectIllustration from "@/components/projects/ProjectIllustration";

type ProjectMediaProps = {
  slug: string;
  alt: string;
  featured?: boolean;
  priority?: boolean;
};

export default function ProjectMedia({
  slug,
  alt,
  featured = false,
}: ProjectMediaProps) {
  return (
    <div
      className={`pc__media${featured ? " pc__media--featured" : ""}`}
      role="img"
      aria-label={alt}
    >
      <ProjectIllustration slug={slug} />
    </div>
  );
}
