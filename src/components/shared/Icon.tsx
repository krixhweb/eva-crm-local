// Icon.tsx
// ----------------------
// Simple Icon wrapper so UI components never change
// We only map our custom names → Ant icons here
// ----------------------

import React from 'react';
import { cn } from '../../lib/utils';

// Import only the icons you actually need
import {
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  MailOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  PlusOutlined,
  MinusOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  CalendarOutlined,
  SettingOutlined,
  BellOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  UploadOutlined,
  DownloadOutlined,
  CopyOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  HeartOutlined,
  StarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

// Our custom name → Ant icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  check: CheckOutlined,
  close: CloseOutlined,
  user: UserOutlined,
  mail: MailOutlined,
  search: SearchOutlined,
  arrowLeft: ArrowLeftOutlined,
  arrowRight: ArrowRightOutlined,
  plus: PlusOutlined,
  minus: MinusOutlined,
  edit: EditOutlined,
  trash: DeleteOutlined,
  phone: PhoneOutlined,
  calendar: CalendarOutlined,
  settings: SettingOutlined,
  bell: BellOutlined,
  eye: EyeOutlined,
  eyeOff: EyeInvisibleOutlined,
  upload: UploadOutlined,
  download: DownloadOutlined,
  copy: CopyOutlined,
  info: InfoCircleOutlined,
  alertTriangle: WarningOutlined,
  heart: HeartOutlined,
  star: StarOutlined,
  clock: ClockCircleOutlined,
};

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;     // icon key
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  const Component = iconMap[name]; // pick the correct icon

  // If icon not found → avoid app crash
  if (!Component) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  // Render icon with merged classes
  return <Component className={cn('flex-shrink-0', className)} {...props} />;
};

