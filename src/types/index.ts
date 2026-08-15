export interface Project {
  slug: string;
  title: string;
  description: string;
  impact?: string;
  longDescription: string;
  tech: string[];
  image: string;
  featured: boolean;
  github?: string;
  demo?: string;
  video?: string;
  status?: string;
  category: string;
  /**
   * Shipment stage. Omitted = shipped (existing behavior). Set to "upcoming"
   * for projects that exist but aren't released yet — their cards render
   * visually distinct (dimmed, "In Progress" pill, no external links).
   */
  stage?: "shipped" | "upcoming";
}

export interface Skill {
  name: string;
  category: string;
}

export interface Social {
  label: string;
  href: string;
  icon: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  publishedDate?: string;
  tags?: string[];
}
