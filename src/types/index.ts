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
