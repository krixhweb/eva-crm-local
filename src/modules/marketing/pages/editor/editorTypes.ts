export type BlockType = 'header' | 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'social' | 'html' | '2-col' | '3-col';

export interface BlockStyle {
  backgroundColor?: string;
  color?: string;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  marginTop: number;
  marginBottom: number;
  textAlign?: 'left' | 'center' | 'right';
  fontSize?: number;
  fontWeight?: string;
  lineHeight?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: string;
  width?: string;
  height?: number;
  fontFamily?: string;
  gap?: number;
  iconSize?: number;
  iconStyle?: 'circle' | 'square' | 'rounded' | 'outline';
  objectFit?: 'cover' | 'contain' | 'fill';
  fullWidth?: boolean;
}

export interface SocialNetwork {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'website' | 'whatsapp';
  url: string;
  enabled: boolean;
}

export interface ColumnData {
    hasImage: boolean;
    imageSrc: string;
    imageAlt?: string;
    imageWidth?: number;
    headerText: string;
    bodyText: string;
    hasButton: boolean;
    buttonText: string;
    buttonLink: string;
    buttonColor?: string;
    buttonTextColor?: string;
    price?: string;
    backgroundColor: string;
    padding: number; 
    textAlign: 'left' | 'center' | 'right';
    borderRadius?: number;
    border?: string;
}

export interface BlockContent {
  text?: string;
  src?: string;
  alt?: string;
  link?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p';
  html?: string;
  socials?: SocialNetwork[];
  layoutRatio?: '1-1' | '1-2' | '2-1' | '1-1-1'; 
  columns?: ColumnData[];
}

export interface Block {
  id: string;
  type: BlockType;
  content: BlockContent;
  styles: BlockStyle;
}

export const DEFAULT_SOCIALS: SocialNetwork[] = [
    { id: 'fb', platform: 'facebook', url: 'https://facebook.com', enabled: true },
    { id: 'ig', platform: 'instagram', url: 'https://instagram.com', enabled: true },
    { id: 'tw', platform: 'twitter', url: 'https://twitter.com', enabled: true },
    { id: 'li', platform: 'linkedin', url: 'https://linkedin.com', enabled: false },
    { id: 'yt', platform: 'youtube', url: 'https://youtube.com', enabled: false },
    { id: 'web', platform: 'website', url: 'https://example.com', enabled: false },
];

// Use a counter to ensure uniqueness even when generated in tight loops
let blockIdCounter = 0;
export const generateId = () => {
    blockIdCounter += 1;
    return `blk_${Date.now()}_${blockIdCounter}_${Math.floor(Math.random() * 1000)}`;
};

export const getDefaultColumnData = (): ColumnData => ({
    hasImage: false,
    imageSrc: 'https://placehold.co/300x200/e2e8f0/94a3b8?text=Img',
    imageWidth: 100,
    headerText: 'Column Title',
    bodyText: 'Short description goes here.',
    hasButton: false,
    buttonText: 'Learn More',
    buttonLink: '#',
    buttonColor: '#3B82F6',
    buttonTextColor: '#FFFFFF',
    price: '',
    backgroundColor: 'transparent',
    textAlign: 'left',
    padding: 10,
    borderRadius: 0
});

export const getDefaultBlock = (type: BlockType): Block => {
  const baseStyles: BlockStyle = { 
      paddingTop: 16, paddingBottom: 16, paddingLeft: 24, paddingRight: 24, 
      marginTop: 0, marginBottom: 0,
      textAlign: 'left', backgroundColor: 'transparent', width: '100%',
      fontSize: 16, lineHeight: '1.5', color: '#374151',
      fontFamily: 'Inter, sans-serif'
  };
  
  switch (type) {
    case 'header': return { 
        id: generateId(), type, 
        content: { text: 'Heading Text', tag: 'h2' }, 
        styles: { ...baseStyles, fontSize: 28, fontWeight: '700', color: '#111827', lineHeight: '1.2', textAlign: 'left', paddingTop: 24, paddingBottom: 12 } 
    };
    case 'text': return { 
        id: generateId(), type, 
        content: { text: 'Start typing your email content here. Keep it short and engaging to drive clicks.' }, 
        styles: { ...baseStyles, fontSize: 16, color: '#4B5563', lineHeight: '1.6' } 
    };
    case 'button': return { 
        id: generateId(), type, 
        content: { text: 'Call To Action', link: 'https://' }, 
        styles: { ...baseStyles, backgroundColor: '#10B981', color: '#FFFFFF', borderRadius: 8, width: 'auto', paddingTop: 14, paddingBottom: 14, paddingLeft: 32, paddingRight: 32, fontWeight: '600', textAlign: 'center', fullWidth: false } 
    };
    case 'image': return { 
        id: generateId(), type, 
        content: { src: 'https://placehold.co/600x300/e2e8f0/94a3b8?text=Image', alt: 'Image description' }, 
        styles: { ...baseStyles, width: '100%', borderRadius: 8, paddingLeft: 0, paddingRight: 0, textAlign: 'center', objectFit: 'cover' } 
    };
    case 'divider': return { 
        id: generateId(), type, 
        content: {}, 
        styles: { ...baseStyles, borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'solid', paddingTop: 24, paddingBottom: 24, width: '100%' } 
    };
    case 'spacer': return { 
        id: generateId(), type, 
        content: {}, 
        styles: { ...baseStyles, height: 40, backgroundColor: 'transparent' } 
    };
    case 'social': return { 
      id: generateId(), type, 
      content: { socials: JSON.parse(JSON.stringify(DEFAULT_SOCIALS)) }, 
      styles: { ...baseStyles, gap: 16, textAlign: 'center', iconSize: 32, iconStyle: 'circle', color: '#4B5563' } 
    };
    case 'html': return { 
        id: generateId(), type, 
        content: { html: '<div style="background:#f3f4f6; padding:20px; text-align:center; border-radius: 8px; color: #6b7280; font-family: monospace; font-size: 14px;">HTML Code Block</div>' }, 
        styles: { ...baseStyles, paddingLeft: 0, paddingRight: 0 } 
    };
    case '2-col': return {
        id: generateId(), type,
        content: {
            layoutRatio: '1-1',
            columns: [getDefaultColumnData(), getDefaultColumnData()]
        }, 
        styles: { ...baseStyles, gap: 16, paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10 }
    };
    case '3-col': return {
        id: generateId(), type,
        content: {
            layoutRatio: '1-1-1',
            columns: [getDefaultColumnData(), getDefaultColumnData(), getDefaultColumnData()]
        }, 
        styles: { ...baseStyles, gap: 16, paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10 }
    };
    default: return { id: generateId(), type, content: {}, styles: baseStyles };
  }
};