
import { SocialAccount, SocialPost, LinkMetadata } from '../types';

const MOCK_ACCOUNTS: SocialAccount[] = [
  { id: 'acc_1', provider: 'facebook', name: 'Eva CRM', username: '@evacrm', connectedAt: '2023-01-15', status: 'connected', followersCount: 12500 },
  { id: 'acc_2', provider: 'instagram', name: 'Eva Life', username: '@evalife', connectedAt: '2023-02-20', status: 'connected', followersCount: 8400 },
  { id: 'acc_3', provider: 'x', name: 'Eva Official', username: '@eva_hq', connectedAt: '2023-03-10', status: 'connected', followersCount: 3200 },
  { id: 'acc_4', provider: 'linkedin', name: 'Eva Inc.', username: 'company/eva', connectedAt: '2023-01-10', status: 'connected', followersCount: 15000 },
];

const MOCK_POSTS: SocialPost[] = [
    {
        id: 'post_1',
        content: 'Launching our new summer collection! ☀️ #summer #fashion',
        status: 'published',
        platforms: ['facebook', 'instagram'],
        accountIds: ['acc_1', 'acc_2'],
        attachments: [
            { id: 'att_1', url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80', type: 'image' }
        ],
        publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        labels: ['Campaign', 'Product Launch'],
        author: { name: 'Sarah Jenkins', avatar: 'SJ' },
        stats: { likes: 245, comments: 42, shares: 12, impressions: 3500, clicks: 120, engagementRate: 8.5 }
    },
    {
        id: 'post_2',
        content: 'Join our webinar on advanced CRM strategies. Link in bio! 📈',
        status: 'scheduled',
        platforms: ['linkedin', 'x'],
        accountIds: ['acc_4', 'acc_3'],
        attachments: [],
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        labels: ['Webinar', 'Education'],
        author: { name: 'Mike Ross', avatar: 'MR' }
    },
    {
        id: 'post_3',
        content: '5 tips for better customer retention. \n1. Listen\n2. Engage...',
        status: 'draft',
        platforms: ['linkedin'],
        accountIds: ['acc_4'],
        attachments: [],
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        labels: ['Tips'],
        author: { name: 'Sarah Jenkins', avatar: 'SJ' }
    },
    {
        id: 'post_4',
        content: 'Flash Sale! 24 Hours only.',
        status: 'failed',
        platforms: ['facebook'],
        accountIds: ['acc_1'],
        attachments: [],
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        labels: ['Sale'],
        author: { name: 'System', avatar: 'SY' }
    }
];

export const SocialService = {
  getAccounts: async (): Promise<SocialAccount[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_ACCOUNTS), 500));
  },
  getPosts: async (): Promise<SocialPost[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_POSTS), 500));
  },
  createPost: async (post: Partial<SocialPost>) => {
    console.log("Creating post", post);
    return new Promise(resolve => setTimeout(() => resolve({ ...post, id: `post_${Date.now()}` } as SocialPost), 800));
  },
  getLinkPreview: async (url: string): Promise<LinkMetadata> => {
    return new Promise(resolve => setTimeout(() => resolve({
        url,
        domain: new URL(url).hostname,
        title: "Eva CRM - The Future of E-Commerce",
        description: "Boost your sales and manage customers with our all-in-one platform.",
        image: "https://placehold.co/600x315/22c55e/ffffff?text=Link+Preview"
    }), 1000));
  },
  connectAccount: async (provider: string): Promise<void> => {
    console.log(`Connecting to ${provider}...`);
    return new Promise(resolve => setTimeout(resolve, 1000));
  },
  deleteAccount: async (id: string): Promise<void> => {
    console.log(`Disconnecting account ${id}...`);
    return new Promise(resolve => setTimeout(resolve, 500));
  }
};
