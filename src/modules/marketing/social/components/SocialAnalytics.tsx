
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Icon } from '../../../../components/shared/Icon';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const overviewData = [
    { date: 'Mon', reach: 1200, engagement: 150 },
    { date: 'Tue', reach: 1800, engagement: 230 },
    { date: 'Wed', reach: 1500, engagement: 180 },
    { date: 'Thu', reach: 2200, engagement: 320 },
    { date: 'Fri', reach: 2800, engagement: 410 },
    { date: 'Sat', reach: 2400, engagement: 380 },
    { date: 'Sun', reach: 2100, engagement: 290 },
];

const platformData = [
    { name: 'Facebook', value: 45, color: '#1877F2' },
    { name: 'Instagram', value: 35, color: '#E4405F' },
    { name: 'LinkedIn', value: 15, color: '#0A66C2' },
    { name: 'X', value: 5, color: '#000000' },
];

const StatCard = ({ title, value, change, icon, color }: any) => (
    <Card>
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{title}</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</h3>
                    <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                        <Icon name="trendingUp" className="w-3 h-3" /> {change}
                    </p>
                </div>
                <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                    <Icon name={icon} className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
            </div>
        </CardContent>
    </Card>
);

export const SocialAnalytics = () => {
  return (
    <div className="space-y-6 animate-in fade-in">
       {/* Overview Stats */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <StatCard title="Total Reach" value="128.4K" change="+12%" icon="globe" color="bg-blue-500" />
           <StatCard title="Impressions" value="452.1K" change="+8.5%" icon="eye" color="bg-purple-500" />
           <StatCard title="Engagement" value="18.2K" change="+15%" icon="heart" color="bg-pink-500" />
           <StatCard title="Ctr" value="3.2%" change="+0.4%" icon="mousePointer" color="bg-green-500" />
       </div>

       {/* Main Charts */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <Card className="lg:col-span-2">
               <CardHeader>
                   <div className="flex items-center justify-between">
                       <CardTitle>Audience Growth & Engagement</CardTitle>
                       <div className="flex gap-2">
                           <span className="flex items-center gap-1 text-xs text-gray-500"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Reach</span>
                           <span className="flex items-center gap-1 text-xs text-gray-500"><div className="w-2 h-2 bg-pink-500 rounded-full"></div> Engagement</span>
                       </div>
                   </div>
               </CardHeader>
               <CardContent>
                   <div className="h-[300px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={overviewData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                               <defs>
                                   <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                                       <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                   </linearGradient>
                                   <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="#EC4899" stopOpacity={0.2}/>
                                       <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                                   </linearGradient>
                               </defs>
                               <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6B7280'}} dy={10} />
                               <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6B7280'}} />
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                               <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                               <Area type="monotone" dataKey="reach" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorReach)" />
                               <Area type="monotone" dataKey="engagement" stroke="#EC4899" strokeWidth={3} fillOpacity={1} fill="url(#colorEng)" />
                           </AreaChart>
                       </ResponsiveContainer>
                   </div>
               </CardContent>
           </Card>

           <Card>
               <CardHeader><CardTitle>Audience by Platform</CardTitle></CardHeader>
               <CardContent>
                   <div className="h-[300px] w-full relative">
                       <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                               <Pie data={platformData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                   {platformData.map((entry, index) => (
                                       <Cell key={`cell-${index}`} fill={entry.color} />
                                   ))}
                               </Pie>
                               <Tooltip />
                           </PieChart>
                       </ResponsiveContainer>
                       {/* Custom Legend */}
                       <div className="absolute bottom-0 w-full px-4">
                           {platformData.map(d => (
                               <div key={d.name} className="flex justify-between items-center text-sm mb-2">
                                   <div className="flex items-center gap-2">
                                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                                       <span className="text-gray-600 dark:text-gray-400">{d.name}</span>
                                   </div>
                                   <span className="font-bold">{d.value}%</span>
                               </div>
                           ))}
                       </div>
                   </div>
               </CardContent>
           </Card>
       </div>

       {/* Platform Breakdown Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {platformData.map(p => (
               <Card key={p.name} className="overflow-hidden">
                   <div className="h-1 w-full" style={{ backgroundColor: p.color }}></div>
                   <CardContent className="p-5">
                       <h4 className="font-bold text-lg mb-4">{p.name}</h4>
                       <div className="space-y-3 text-sm">
                           <div className="flex justify-between">
                               <span className="text-gray-500">Followers</span>
                               <span className="font-medium">12.5K</span>
                           </div>
                           <div className="flex justify-between">
                               <span className="text-gray-500">Engagement</span>
                               <span className="font-medium text-green-600">4.2%</span>
                           </div>
                           <div className="flex justify-between">
                               <span className="text-gray-500">Clicks</span>
                               <span className="font-medium">850</span>
                           </div>
                       </div>
                   </CardContent>
               </Card>
           ))}
       </div>
    </div>
  );
};
