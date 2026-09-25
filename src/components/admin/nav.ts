import {
  BarChart3,
  Briefcase,
  ClipboardCheck,
  Code2,
  FileText,
  Folder,
  FolderGit2,
  Image,
  LayoutDashboard,
  Link as LinkIcon,
  Megaphone,
  Settings,
  Share2,
  ShoppingCart,
  ToggleLeft,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

export type AdminNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

// Itens soltos no topo da sidebar
export const ADMIN_NAV_TOP: AdminNavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

// Grupos da sidebar — a folha "Mais" do mobile segue esta mesma ordem
export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    title: 'Conteúdo',
    items: [
      { title: 'Posts', href: '/admin/editor/posts', icon: FileText },
      { title: 'Desafios', href: '/admin/editor/challenges', icon: Code2 },
      { title: 'Projetos', href: '/admin/editor/projects', icon: FolderGit2 },
      { title: 'Soluções', href: '/admin/submissions', icon: ClipboardCheck },
    ],
  },
  {
    title: 'Mídia',
    items: [
      { title: 'Asset Packs', href: '/admin/assets', icon: Folder },
      { title: 'Anúncios', href: '/admin/ads', icon: Image },
      { title: 'Páginas de Venda', href: '/admin/sales', icon: ShoppingCart },
      { title: 'Media kit', href: '/admin/mediakit', icon: Megaphone },
    ],
  },
  {
    title: 'Recrutamento',
    items: [{ title: 'Indicações', href: '/admin/referrals', icon: Briefcase }],
  },
  {
    title: 'Site',
    items: [
      { title: 'Links do Setup', href: '/admin/setup', icon: Settings },
      { title: 'Links do Site', href: '/admin/links', icon: LinkIcon },
      { title: 'Links Sociais', href: '/admin/social', icon: Share2 },
      { title: 'Feature Flags', href: '/admin/feature-flags', icon: ToggleLeft },
    ],
  },
];

// Barra de abas inferior do mobile (o 5º destino, "Mais", abre a folha)
export const ADMIN_TABS: AdminNavItem[] = [
  { title: 'Painel', href: '/admin', icon: LayoutDashboard },
  { title: 'Posts', href: '/admin/editor/posts', icon: FileText },
  { title: 'Desafios', href: '/admin/editor/challenges', icon: Trophy },
  { title: 'Dados', href: '/admin/analytics', icon: BarChart3 },
];

export function isNavActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(href + '/');
}

// Título da seção atual (header mobile)
export function currentSectionTitle(pathname: string | null): string {
  const all = [...ADMIN_NAV_TOP, ...ADMIN_NAV_GROUPS.flatMap((g) => g.items)];
  const match = all
    .filter((it) => isNavActive(pathname, it.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.title ?? 'Admin';
}
