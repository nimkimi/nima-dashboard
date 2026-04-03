export interface Link {
  id: string;
  label: string;
  url: string;
  icon: string;
}

const STORAGE_KEY = "dash_links_v1";

export const DEFAULT_LINKS: Link[] = [
  { id: "1", label: "GitHub", url: "https://github.com", icon: "🐙" },
  { id: "2", label: "Claude", url: "https://claude.ai", icon: "🤖" },
  { id: "3", label: "ChatGPT", url: "https://chatgpt.com", icon: "💬" },
  { id: "4", label: "Vercel", url: "https://vercel.com", icon: "▲" },
  {
    id: "5",
    label: "MDN Docs",
    url: "https://developer.mozilla.org",
    icon: "📚",
  },
  {
    id: "6",
    label: "Stack Overflow",
    url: "https://stackoverflow.com",
    icon: "🔍",
  },
  {
    id: "7",
    label: "Hacker News",
    url: "https://news.ycombinator.com",
    icon: "🔶",
  },
  { id: "8", label: "YouTube", url: "https://youtube.com", icon: "▶️" },
];

export function loadLinks(): Link[] {
  if (typeof window === "undefined") return DEFAULT_LINKS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Link[]) : DEFAULT_LINKS;
  } catch {
    return DEFAULT_LINKS;
  }
}

export function saveLinks(links: Link[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

export function resetLinks(): Link[] {
  if (typeof window === "undefined") return DEFAULT_LINKS;
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_LINKS;
}
