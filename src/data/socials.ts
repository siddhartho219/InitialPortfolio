import type { Social } from "@/types";

import {
  EMAIL,
  GITHUB,
  LINKEDIN,
  TWITTER,
  WHATSAPP,
} from "@/data/contact";

export const socials: Social[] = [
  {
    label: "GitHub",
    href: GITHUB,
    icon: "github",
  },
  {
    label: "LinkedIn",
    href: LINKEDIN,
    icon: "linkedin",
  },
  {
    label: "X",
    href: TWITTER,
    icon: "twitter",
  },
  {
    label: "WhatsApp",
    href: WHATSAPP,
    icon: "whatsapp",
  },
  {
    label: "Email",
    href: `mailto:${EMAIL}`,
    icon: "mail",
  },
];
