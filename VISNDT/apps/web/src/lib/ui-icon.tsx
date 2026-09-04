import {
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  Clock,
  Factory,
  FileText,
  Inbox,
  Link2,
  ListTodo,
  Package,
  Paperclip,
  Send,
  Settings,
  Tag,
  Target,
  Users,
} from 'lucide-react';
import { IconWrapper } from '@visndt/design-system';

/**
 * VISNDT Web UI Icon Map — Professional Icon Library Layer.
 *
 * Replaces legacy Emoji UI Representation with a semantic icon set rendered
 * through the shared design-system IconWrapper (unified size / color / container).
 * Business semantics must stay deterministic:
 *   semantic name → lucide icon → IconWrapper. No AI guessing.
 */
export const UI_ICONS = {
  dashboard: BarChart3, // 📊
  list: ListTodo, // 📋
  file: FileText, // 📄
  link: Link2, // 🔗
  bell: Bell, // 🔔
  settings: Settings, // ⚙️
  send: Send, // 📨
  package: Package, // 📦
  target: Target, // 🎯
  building: Building2, // 🏢
  clock: Clock, // ⏳
  check: CheckCircle2, // ✅
  tag: Tag, // 🏷️
  inbox: Inbox, // 📭
  attachment: Paperclip, // 📎
  factory: Factory, // 🏭
  users: Users, // 👥
} as const;

export type UiIconName = keyof typeof UI_ICONS;

export interface UiIconProps {
  name: UiIconName;
  size?: number;
  color?: string;
  container?: boolean;
  containerTone?: 'primary' | 'neutral' | 'none';
  className?: string;
  strokeWidth?: number;
}

/** Renders a semantic icon via the design-system IconWrapper. */
export default function UiIcon({
  name,
  size = 20,
  color,
  container = false,
  containerTone = 'neutral',
  className,
  strokeWidth = 1.75,
}: UiIconProps) {
  const Cmp = UI_ICONS[name];
  return (
    <IconWrapper
      size={size}
      color={color}
      container={container}
      containerTone={containerTone}
      className={className}
    >
      <Cmp strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </IconWrapper>
  );
}