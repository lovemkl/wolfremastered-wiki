import { BookOpen, ScrollText, Users, Lightbulb } from "lucide-react";

export const NAVIGATION_CONFIG = [
  { key: "guides", path: "/guide", icon: BookOpen, isContentType: true },
  { key: "story", path: "/story", icon: ScrollText, isContentType: true },
  { key: "characters", path: "/characters", icon: Users, isContentType: true },
  { key: "tips", path: "/tips", icon: Lightbulb, isContentType: true },
] as const;

export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map((item) => item.path.replace(/^\//, ""));
