// Icon.tsx
// ----------------------
// Simple Icon wrapper so UI components never change
// We only map our custom names → Ant icons here
// ----------------------

import React from 'react';
import { cn } from '../../lib/utils';

// Use Phosphor icon pack centrally for the app
import {
  Check,
  X,
  User,
  Envelope,
  MagnifyingGlass,
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  Pencil,
  Trash,
  Phone,
  Calendar,
  Gear,
  Bell,
  Eye,
  EyeSlash,
  Upload,
  Download,
  Copy,
  Info,
  Warning,
  Heart,
  Star,
  Clock,
  List,
  Users,
  Gauge,
  ShoppingCart,
  Megaphone,
  PaperPlaneRight,
  CurrencyDollar,
  CheckCircle,
  TrendUp,
  Funnel,
  ChatCentered,
  ArrowsClockwise,
  CaretDown,
  SignOut,
} from 'phosphor-react';

// Our custom name → Ant icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  check: Check,
  close: X,
  user: User,
  mail: Envelope,
  search: MagnifyingGlass,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  plus: Plus,
  minus: Minus,
  edit: Pencil,
  trash: Trash,
  phone: Phone,
  calendar: Calendar,
  settings: Gear,
  bell: Bell,
  eye: Eye,
  eyeOff: EyeSlash,
  upload: Upload,
  download: Download,
  copy: Copy,
  info: Info,
  alertTriangle: Warning,
  heart: Heart,
  star: Star,
  clock: Clock,
  menu: List,
  users: Users,
  dashboard: Gauge,
  shoppingCart: ShoppingCart,
  megaphone: Megaphone,
  list: List,
  send: PaperPlaneRight,
  dollarSign: CurrencyDollar,
  checkCircle: CheckCircle,
  trendingUp: TrendUp,
  pipeline: Funnel,
  messageCircle: ChatCentered,
  refreshCw: ArrowsClockwise,
  chevronDown: CaretDown,
  logout: SignOut,
};

interface IconProps {
  name: string; // icon key
  className?: string;
  size?: number | string;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  color?: string;
  [key: string]: any;
}

export const Icon: React.FC<IconProps> = ({ name, className, size = 20, weight = 'regular', color, ...props }) => {
  const Component = iconMap[name]; // pick the correct icon

  // If icon not found → render a neutral fallback icon instead of null
  if (!Component) {
    console.warn(`Icon "${name}" not found in iconMap, using fallback`);
    return <Info className={className} size={size} weight={weight as any} color={color} {...props} />;
  }

  // Render icon with merged classes and pass through props
  return <Component className={className} size={size} weight={weight as any} color={color} {...props} />;
};

