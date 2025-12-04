
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Icon } from '../../../../components/shared/Icon';
import { SocialService } from '../api/mockService';
import { SocialPost, SocialAccount } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

const KPICard = ({ title, value, icon, color, trend, trendUp, subtext }: any) => (
    <Card>
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                    <Icon name={icon} className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
                {trend && (
                    <span className={`flex items-center text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                        <Icon name="trendingUp" className={`w-3 h-3 mr-0.5 ${!trendUp && 'rotate-180'}`} />
                        {trend}
                    </span>
                )}
                {subtext && <span className="text-xs text-gray-400">{subtext}</span>}
            </div>
        </CardContent>
    </Card>
);

export const SocialDashboard = () => {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [accounts, setAccounts] = useState<SocialAccount[]>([]);

    useEffect(() => {
        SocialService.getPosts().then(setPosts);
        SocialService.getAccounts().then(setAccounts);
    }, []);

    // Metrics Calculation
    const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
    const publishedCount = posts.filter(p => p.status === 'published').length;
    
    // Calculate Total Audience from connected accounts
    const totalAudience = accounts.reduce((sum, acc) => sum + (acc.followersCount || 0), 0);
    
    // Calculate Average Engagement Rate from posts that have stats
    const engagementRates = posts
        .filter(p => p.stats?.engagementRate)
        .map(p => p.stats!.engagementRate);
    const avgEngagement = engagementRates.length > 0 
        ? (engagementRates.reduce((a, b) => a + b, 0) / engagementRates.length).toFixed(2) 
        : "0.00";

    // Chart Data
    const platformData = [
        { name: 'Facebook', value: posts.filter(p => p.platforms.includes('facebook')).length, color: '#1877F2' },
        { name: 'Instagram', value: posts.filter(p => p.platforms.includes('instagram')).length, color: '#E4405F' },
        { name: 'Twitter', value: posts.filter(p => p.platforms.includes('x')).length, color: '#1DA1F2' },
        { name: 'LinkedIn', value: posts.filter(p => p.platforms.includes('linkedin')).length, color: '#0A66C2' },
    ].filter(d => d.value > 0);

    const activityData = [
        { day: 'Mon', posts: 2 },
        { day: 'Tue', posts: 4 },
        { day: 'Wed', posts: 1 },
        { day: 'Thu', posts: 3 },
        { day: 'Fri', posts: 5 },
        { day: 'Sat', posts: 2 },
        { day: 'Sun', posts: 1 },
    ];

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard 
                    title="Total Audience" 
                    value={totalAudience.toLocaleString()} 
                    icon="users" 
                    color="bg-blue-500" 
                    trend="+12.5%" 
                    trendUp={true}
                    subtext="Across all accounts" 
                />
                <KPICard 
                    title="Avg Engagement" 
                    value={`${avgEngagement}%`} 
                    icon="activity" 
                    color="bg-purple-500" 
                    trend="+1.2%" 
                    trendUp={true}
                    subtext="Last 30 days" 
                />
                <KPICard 
                    title="Scheduled Posts" 
                    value={scheduledCount} 
                    icon="calendar" 
                    color="bg-orange-500" 
                    subtext="In Queue" 
                />
                <KPICard 
                    title="Published (30d)" 
                    value={publishedCount} 
                    icon="checkCircle" 
                    color="bg-green-500" 
                    trend="+5" 
                    trendUp={true}
                    subtext="Posts sent" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Posting Frequency</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={activityData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Line type="monotone" dataKey="posts" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, fill: '#3B82F6'}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Platform Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={platformData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {platformData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {posts.slice(0, 5).map(post => (
                            <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${post.status === 'published' ? 'bg-green-500' : post.status === 'scheduled' ? 'bg-orange-500' : 'bg-gray-400'}`} />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px] md:max-w-md">{post.content}</span>
                                </div>
                                <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                        {posts.length === 0 && <p className="text-center text-gray-500 text-sm py-4">No recent activity.</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
