
import type { BlockType, BlockContent, BlockStyle, ColumnData } from './editorTypes';
import { getDefaultColumnData } from './editorTypes';

export interface PresetBlockDefinition {
  type: BlockType;
  content?: Partial<BlockContent>;
  styles?: Partial<BlockStyle>;
}

export interface EmailPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  blocks: PresetBlockDefinition[];
}

const col = (overrides: Partial<ColumnData>): ColumnData => ({ ...getDefaultColumnData(), ...overrides });

export const EMAIL_PRESETS: EmailPreset[] = [
  // --- 1. NEWSLETTER ---
  {
    id: 'newsletter',
    name: 'The Weekly Pulse',
    description: 'Focuses on readability and storytelling.',
    category: 'Content',
    blocks: [
      { type: 'header', content: { text: 'The Weekly Pulse', tag: 'h1' }, styles: { textAlign: 'center', fontSize: 32, paddingTop: 30 } },
      { type: 'image', content: { src: 'https://placehold.co/600x300/e2e8f0/94a3b8?text=Hero+Image', alt: 'Hero' }, styles: { paddingBottom: 20 } },
      { type: 'text', content: { text: '<p><strong>Editor\'s Note:</strong> Welcome to this week\'s edition. We are exploring new trends in e-commerce and how they affect your bottom line.</p>' }, styles: { backgroundColor: '#F9FAFB', paddingLeft: 30, paddingRight: 30, paddingTop: 20, paddingBottom: 20, borderRadius: 8 } },
      { type: 'header', content: { text: 'Featured Stories', tag: 'h2' }, styles: { paddingTop: 30, paddingBottom: 10 } },
      { 
        type: '2-col', 
        content: { 
            layoutRatio: '1-1',
            columns: [
                col({ hasImage: true, imageSrc: 'https://placehold.co/300x200/f3f4f6/9ca3af?text=Story+1', headerText: 'Trend Alert', bodyText: 'Why minimal design is taking over 2024.', hasButton: true, buttonText: 'Read More' }),
                col({ hasImage: true, imageSrc: 'https://placehold.co/300x200/f3f4f6/9ca3af?text=Story+2', headerText: 'Customer Success', bodyText: 'How to retain 80% of your users.', hasButton: true, buttonText: 'Read More' })
            ]
        }
      },
      { type: 'divider' },
      { type: 'social', styles: { paddingTop: 30, paddingBottom: 30 } }
    ]
  },
  
  // --- 2. PROMOTIONAL ---
  {
    id: 'promotional',
    name: 'Flash Sale',
    description: 'High urgency, bold colors, large CTAs.',
    category: 'Sales',
    blocks: [
      { type: 'text', content: { text: '<div style="text-align: center; font-weight: bold; color: #ffffff; background-color: #DC2626; padding: 10px;">⚠️ FLASH SALE: 24 HOURS ONLY</div>' }, styles: { paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 } },
      { type: 'header', content: { text: '50% OFF EVERYTHING', tag: 'h1' }, styles: { textAlign: 'center', fontSize: 48, fontWeight: '900', color: '#DC2626', paddingTop: 40 } },
      { type: 'image', content: { src: 'https://placehold.co/600x400/fee2e2/dc2626?text=SALE', alt: 'Sale' }, styles: { paddingBottom: 20 } },
      { type: 'button', content: { text: 'SHOP THE SALE' }, styles: { backgroundColor: '#DC2626', fontSize: 24, borderRadius: 0, fullWidth: true, paddingLeft: 0, paddingRight: 0 } },
      { type: 'text', content: { text: '<p style="text-align: center; font-size: 14px; color: #666;">*Offer valid until midnight. Exclusions apply.</p>' }, styles: { paddingTop: 20 } },
      { type: 'social', styles: { paddingTop: 40 } }
    ]
  },

  // --- 3. MINIMAL ---
  {
    id: 'minimal',
    name: 'Corporate Update',
    description: 'Text-heavy, clean, no distractions.',
    category: 'Business',
    blocks: [
      { type: 'header', content: { text: 'ACME Corp', tag: 'h3' }, styles: { textAlign: 'left', color: '#333' } },
      { type: 'divider', styles: { borderColor: '#000' } },
      { type: 'text', content: { text: '<p>Dear Customer,</p><p>We are writing to inform you about upcoming changes to our terms of service, effective immediately. Please review the attached document for full details.</p><p>This update ensures we continue to provide the best security and service reliability.</p>' }, styles: { fontSize: 16, lineHeight: '1.8' } },
      { type: 'spacer', styles: { height: 40 } },
      { type: 'text', content: { text: '<p>Sincerely,<br/><strong>Sarah Jenkins</strong><br/>CEO, ACME Corp</p>' } },
      { type: 'divider' },
      { type: 'text', content: { text: '<p style="text-align: center; font-size: 11px; color: #999;">123 Business Rd, Tech City. <a href="#" style="color: #999;">Unsubscribe</a></p>' } }
    ]
  },

  // --- 4. PRODUCT SHOWCASE ---
  {
    id: 'product',
    name: 'New Arrivals',
    description: 'Visual-heavy grid layout.',
    category: 'Sales',
    blocks: [
      { type: 'header', content: { text: 'Fresh Drops', tag: 'h1' }, styles: { textAlign: 'center' } },
      { type: 'text', content: { text: '<p style="text-align: center;">Explore our latest collection for the season.</p>' } },
      { type: 'image', content: { src: 'https://placehold.co/600x350/e0e7ff/4338ca?text=Collection+Hero', alt: 'Collection' }, styles: { borderRadius: 0 } },
      { type: 'spacer', styles: { height: 20 } },
      { 
        type: '2-col', 
        content: { 
            layoutRatio: '1-1',
            columns: [
                col({ hasImage: true, imageSrc: 'https://placehold.co/300x300/f3f4f6/333?text=Item+1', headerText: 'Urban Jacket', price: '$120.00', hasButton: true, buttonText: 'Buy Now', textAlign: 'center' }),
                col({ hasImage: true, imageSrc: 'https://placehold.co/300x300/f3f4f6/333?text=Item+2', headerText: 'Denim Jeans', price: '$85.00', hasButton: true, buttonText: 'Buy Now', textAlign: 'center' })
            ]
        }
      },
      { type: 'button', content: { text: 'View All Products' }, styles: { textAlign: 'center', backgroundColor: '#000000' } },
      { type: 'social' }
    ]
  },

  // --- 5. AUTOMATED TRIGGER ---
  {
    id: 'automated',
    name: 'Welcome Aboard',
    description: 'Personal tone, clear next steps.',
    category: 'Automated',
    blocks: [
      { type: 'image', content: { src: 'https://placehold.co/100x100/22c55e/ffffff?text=Logo', alt: 'Logo' }, styles: { width: '100px', textAlign: 'center', paddingTop: 40 } },
      { type: 'header', content: { text: 'Welcome to the Family!', tag: 'h1' }, styles: { textAlign: 'center' } },
      { type: 'text', content: { text: '<p style="text-align: center;">Hi there! We are thrilled to have you with us. Here is a quick guide to get you started.</p>' } },
      { 
        type: '3-col', 
        content: { 
            layoutRatio: '1-1-1',
            columns: [
                col({ hasImage: true, imageSrc: 'https://cdn-icons-png.flaticon.com/512/2921/2921222.png', headerText: 'Step 1', bodyText: 'Complete Profile', textAlign: 'center', imageWidth: 50 }),
                col({ hasImage: true, imageSrc: 'https://cdn-icons-png.flaticon.com/512/2921/2921222.png', headerText: 'Step 2', bodyText: 'Browse Catalog', textAlign: 'center', imageWidth: 50 }),
                col({ hasImage: true, imageSrc: 'https://cdn-icons-png.flaticon.com/512/2921/2921222.png', headerText: 'Step 3', bodyText: 'First Order', textAlign: 'center', imageWidth: 50 })
            ]
        }
      },
      { type: 'button', content: { text: 'Go to Dashboard' }, styles: { textAlign: 'center' } },
      { type: 'text', content: { text: '<p style="text-align: center; font-size: 12px;"><a href="#">Help Center</a> • <a href="#">Contact Support</a></p>' } }
    ]
  },

  // --- 6. SURVEY ---
  {
    id: 'survey',
    name: 'Your Voice',
    description: 'Simple question, direct call to action.',
    category: 'Feedback',
    blocks: [
      { type: 'header', content: { text: 'How did we do?', tag: 'h2' }, styles: { textAlign: 'center', paddingTop: 40 } },
      { type: 'text', content: { text: '<p style="text-align: center;">We recently resolved your ticket. Please rate your experience.</p>' } },
      { 
        type: '3-col',
        content: {
            layoutRatio: '1-1-1',
            columns: [
                col({ hasImage: true, imageSrc: 'https://placehold.co/80x80/ef4444/ffffff?text=Bad', headerText: '', hasButton: true, buttonText: 'Bad', buttonColor: '#ef4444', textAlign: 'center' }),
                col({ hasImage: true, imageSrc: 'https://placehold.co/80x80/f59e0b/ffffff?text=Okay', headerText: '', hasButton: true, buttonText: 'Okay', buttonColor: '#f59e0b', textAlign: 'center' }),
                col({ hasImage: true, imageSrc: 'https://placehold.co/80x80/22c55e/ffffff?text=Great', headerText: '', hasButton: true, buttonText: 'Great', buttonColor: '#22c55e', textAlign: 'center' })
            ]
        }
      },
      { type: 'text', content: { text: '<p style="text-align: center;">Your feedback helps us improve.</p>' } }
    ]
  },

  // --- COLUMN PRESETS ---
  {
    id: '2col-img-text',
    name: 'Image + Text',
    description: 'Standard product highlight.',
    category: '2-Column',
    blocks: [
      { 
        type: '2-col',
        content: {
            columns: [
                col({ hasImage: true, imageSrc: 'https://placehold.co/300x250/e2e8f0/94a3b8?text=Product', headerText: '', bodyText: '' }),
                col({ hasImage: false, headerText: 'Feature Highlight', bodyText: 'Detailed description of the product feature.', hasButton: true, buttonText: 'Learn More' })
            ]
        }
      }
    ]
  },
  {
    id: '2col-cta',
    name: 'CTA Split',
    description: 'Call to action with visual.',
    category: '2-Column',
    blocks: [
      { 
        type: '2-col',
        content: {
            columns: [
                col({ hasImage: false, headerText: 'Ready to Start?', bodyText: 'Join today.', hasButton: true, buttonText: 'Sign Up', backgroundColor: '#f3f4f6', padding: 30 }),
                col({ hasImage: true, imageSrc: 'https://placehold.co/300x250/1e293b/ffffff?text=Graph', headerText: '', bodyText: '' })
            ]
        }
      }
    ]
  },
  {
    id: '3col-pricing',
    name: 'Pricing Tiers',
    description: 'Comparison table.',
    category: '3-Column',
    blocks: [
      { 
        type: '3-col',
        content: {
            columns: [
                col({ headerText: 'Basic', price: '$0', bodyText: 'Free forever.', textAlign: 'center', backgroundColor: '#f9fafb' }),
                col({ headerText: 'Pro', price: '$29', bodyText: 'For serious pros.', textAlign: 'center', backgroundColor: '#eff6ff', border: '1px solid #3b82f6' }),
                col({ headerText: 'Ent.', price: 'Contact', bodyText: 'Custom solution.', textAlign: 'center', backgroundColor: '#f9fafb' })
            ]
        },
        styles: { gap: 10 }
      }
    ]
  },
  {
    id: '3col-features',
    name: 'Feature Icons',
    description: 'Grid of icons and text.',
    category: '3-Column',
    blocks: [
      { 
        type: '3-col',
        content: {
            columns: [
                col({ hasImage: true, imageSrc: 'https://placehold.co/80x80/f3f4f6/9ca3af?text=1', headerText: 'Fast', bodyText: 'Speedy delivery.', textAlign: 'center' }),
                col({ hasImage: true, imageSrc: 'https://placehold.co/80x80/f3f4f6/9ca3af?text=2', headerText: 'Secure', bodyText: 'Safe payments.', textAlign: 'center' }),
                col({ hasImage: true, imageSrc: 'https://placehold.co/80x80/f3f4f6/9ca3af?text=3', headerText: 'Support', bodyText: '24/7 help.', textAlign: 'center' })
            ]
        }
      }
    ]
  }
];
