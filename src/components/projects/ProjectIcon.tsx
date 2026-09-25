import {
  BarChart3,
  BookOpen,
  Bot,
  Box,
  Brain,
  Briefcase,
  CalendarDays,
  ClipboardCheck,
  Cloud,
  Code2,
  Cpu,
  Database,
  Gamepad2,
  GitBranch,
  Globe,
  Layers,
  LayoutDashboard,
  Lock,
  Mail,
  Megaphone,
  MessageCircle,
  Package,
  Puzzle,
  Rocket,
  Server,
  Shield,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Terminal,
  Tv,
  Users,
  Workflow,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { ProjectMeta } from '@/lib/types';
import { accentIconBox } from '@/components/rc';
import { cn } from '@/lib/utils';

// Ícones permitidos para project.icon (nome kebab-case do lucide).
// Importa só estes para não levar a lib inteira no bundle.
const PROJECT_ICONS: Record<string, LucideIcon> = {
  'bar-chart-3': BarChart3,
  'bar-chart': BarChart3,
  'book-open': BookOpen,
  bot: Bot,
  box: Box,
  brain: Brain,
  briefcase: Briefcase,
  'calendar-days': CalendarDays,
  'clipboard-check': ClipboardCheck,
  cloud: Cloud,
  code: Code2,
  'code-2': Code2,
  cpu: Cpu,
  database: Database,
  'gamepad-2': Gamepad2,
  gamepad: Gamepad2,
  'git-branch': GitBranch,
  globe: Globe,
  layers: Layers,
  'layout-dashboard': LayoutDashboard,
  lock: Lock,
  mail: Mail,
  megaphone: Megaphone,
  'message-circle': MessageCircle,
  package: Package,
  puzzle: Puzzle,
  rocket: Rocket,
  server: Server,
  shield: Shield,
  'shopping-cart': ShoppingCart,
  smartphone: Smartphone,
  sparkles: Sparkles,
  terminal: Terminal,
  tv: Tv,
  users: Users,
  workflow: Workflow,
  wrench: Wrench,
  zap: Zap,
};

export function resolveProjectIcon(name?: string): LucideIcon | null {
  if (!name) return null;
  return PROJECT_ICONS[name.toLowerCase().trim()] ?? null;
}

// Quadrado do projeto: ícone lucide na cor do accent; sem ícone, inicial do título em mono.
export function ProjectIcon({
  project,
  size = 'sm',
  className,
}: {
  project: Pick<ProjectMeta, 'title' | 'icon' | 'accent'>;
  size?: 'sm' | 'lg';
  className?: string;
}) {
  const Icon = resolveProjectIcon(project.icon);
  const box = accentIconBox[project.accent ?? 'amber'];

  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid shrink-0 place-items-center border',
        size === 'lg' ? 'h-11 w-11 rounded-xl text-lg' : 'h-8 w-8 rounded-[9px] text-sm',
        box,
        !Icon && 'font-mono',
        className,
      )}
    >
      {Icon ? (
        <Icon className={size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} strokeWidth={1.75} />
      ) : (
        project.title.charAt(0).toUpperCase()
      )}
    </span>
  );
}
