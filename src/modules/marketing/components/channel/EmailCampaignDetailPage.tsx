
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import { Icon } from '../../../../components/shared/Icon';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { formatCurrency } from '../../../../lib/utils';
import { mockEmailCampaigns } from '../../../../data/emailMockData';
import { CreateEmailDrawer } from './CreateEmailDrawer';
import { useGlassyToasts } from '../../../../components/ui/GlassyToastProvider';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts';

const EmailCampaignDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { push } = useGlassyToasts();
    
    const [campaign, setCampaign] = useState(mockEmailCampaigns.find(c => c.id === id));
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

    useEffect(() => {
        setCampaign(mockEmailCampaigns.find(c => c.id === id));
    }, [id]);

    if (!campaign) return <div className="p-10 text-center">Campaign not found</div>;

    const handleDuplicate = () => {
        push({ title: "Campaign Duplicated", description: "New draft created.", variant: "success" });
        navigate('/marketing/channel/email');
    };

    const handleDelete = () => {
        if(confirm("Are you sure?")) {
             push({ title: "Campaign Deleted", variant: "error" });
             navigate('/marketing/channel/email');
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Sent': return 'green';
            case 'Scheduled': return 'blue';
            case 'Draft': return 'gray';
            default: return 'red';
        }
    };

    // Mock Analytics Data
    const hourlyData = [
        { hour: '9AM', opens: 120, clicks: 12 }, { hour: '10AM', opens: 450, clicks: 55 }, { hour: '11AM', opens: 890, clicks: 120 },
        { hour: '12PM', opens: 650, clicks: 80 }, { hour: '1PM', opens: 340, clicks: 45 }, { hour: '2PM', opens: 280, clicks: 30 }
    ];
    const linkData = [
        { name: 'Hero CTA', value: 65 }, { name: 'Product Grid', value: 25 }, { name: 'Footer Link', value: 10 }
    ];

    const deliveryRate = Math.round((campaign.stats.delivered / campaign.audienceCount) * 100) || 0;
    const openRate = Math.round((campaign.stats.opens / campaign.stats.delivered) * 100) || 0;
    const clickRate = Math.round((campaign.stats.clicks / campaign.stats.opens) * 100) || 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
             {/* Header */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                         <button onClick={() => navigate('/marketing/channel/email')} className="hover:text-blue-600 transition-colors">Email Marketing</button>
                         <Icon name="chevronRight" className="w-3 h-3" />
                         <span>{campaign.id}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                        {campaign.name}
                        <Badge variant={getStatusColor(campaign.status) as any}>{campaign.status}</Badge>
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Icon name="user" className="w-3 h-3"/> Created by Admin</span>
                        <span className="flex items-center gap-1"><Icon name="clock" className="w-3 h-3"/> {new Date(campaign.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleDuplicate}>Duplicate</Button>
                    <Button variant="outline" onClick={() => setIsEditOpen(true)}>Edit</Button>
                    <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={handleDelete}><Icon name="trash" className="w-4 h-4" /></Button>
                </div>
             </div>

             {/* KPI Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 <Card>
                     <CardContent className="pt-6">
                         <p className="text-xs uppercase text-gray-500 font-medium mb-1">Delivered</p>
                         <div className="flex items-end justify-between">
                            <p className="text-2xl font-bold">{campaign.stats.delivered.toLocaleString()}</p>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{deliveryRate}%</span>
                         </div>
                         <p className="text-xs text-gray-400 mt-1">of {campaign.audienceCount} sent</p>
                     </CardContent>
                 </Card>
                 <Card>
                     <CardContent className="pt-6">
                         <p className="text-xs uppercase text-gray-500 font-medium mb-1">Opens</p>
                         <div className="flex items-end justify-between">
                            <p className="text-2xl font-bold">{campaign.stats.opens.toLocaleString()}</p>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{openRate}%</span>
                         </div>
                         <p className="text-xs text-gray-400 mt-1">unique opens</p>
                     </CardContent>
                 </Card>
                 <Card>
                     <CardContent className="pt-6">
                         <p className="text-xs uppercase text-gray-500 font-medium mb-1">Clicks</p>
                         <div className="flex items-end justify-between">
                            <p className="text-2xl font-bold">{campaign.stats.clicks.toLocaleString()}</p>
                            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">{clickRate}%</span>
                         </div>
                         <p className="text-xs text-gray-400 mt-1">CTR (Click-to-Open)</p>
                     </CardContent>
                 </Card>
                 <Card>
                     <CardContent className="pt-6">
                         <p className="text-xs uppercase text-gray-500 font-medium mb-1">Revenue</p>
                         <div className="flex items-end justify-between">
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(campaign.stats.revenue)}</p>
                         </div>
                         <p className="text-xs text-gray-400 mt-1">attributed</p>
                     </CardContent>
                 </Card>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Content: Preview & Audience */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Email Preview */}
                    <Card className="overflow-hidden">
                        <CardHeader className="bg-gray-50 dark:bg-zinc-800/50 border-b dark:border-zinc-800 flex flex-row justify-between items-center py-3">
                            <CardTitle className="text-sm uppercase text-gray-500">Email Preview</CardTitle>
                            <div className="flex bg-gray-200 dark:bg-zinc-700 p-0.5 rounded-lg">
                                <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded-md ${previewMode === 'desktop' ? 'bg-white dark:bg-zinc-600 shadow' : 'text-gray-500'}`}><Icon name="image" className="w-4 h-4"/></button>
                                <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded-md ${previewMode === 'mobile' ? 'bg-white dark:bg-zinc-600 shadow' : 'text-gray-500'}`}><Icon name="phone" className="w-4 h-4"/></button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 bg-gray-100 dark:bg-zinc-950 flex justify-center py-8">
                             <div className={`bg-white text-black transition-all duration-300 shadow-xl overflow-hidden ${previewMode === 'mobile' ? 'w-[375px] rounded-[30px] border-8 border-gray-800 h-[650px]' : 'w-[600px] rounded-lg min-h-[600px]'}`}>
                                <div className="p-4 border-b">
                                    <p className="text-xs text-gray-500">Subject: <span className="font-bold text-gray-800">{campaign.subject}</span></p>
                                    <p className="text-xs text-gray-500">From: {campaign.fromName} &lt;{campaign.fromEmail}&gt;</p>
                                </div>
                                <div className="p-8 text-center space-y-6">
                                    <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">Header Image</div>
                                    <h2 className="text-2xl font-bold">Big Summer Sale!</h2>
                                    <p className="text-gray-600">Don't miss out on exclusive deals just for you.</p>
                                    <Button className="bg-blue-600 text-white w-full">Shop Now</Button>
                                </div>
                             </div>
                        </CardContent>
                    </Card>
                    
                    {/* Audience Detail */}
                    <Card>
                        <CardHeader><CardTitle>Audience Breakdown</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg border dark:border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><Icon name="users" className="w-4 h-4"/></div>
                                        <div>
                                            <p className="font-medium text-sm">{campaign.audience}</p>
                                            <p className="text-xs text-gray-500">Total Segment Size</p>
                                        </div>
                                    </div>
                                    <span className="font-bold">{campaign.audienceCount.toLocaleString()}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div><p className="text-2xl font-bold text-green-600">99.2%</p><p className="text-xs text-gray-500">Delivery Rate</p></div>
                                    <div><p className="text-2xl font-bold text-orange-500">0.5%</p><p className="text-xs text-gray-500">Bounce Rate</p></div>
                                    <div><p className="text-2xl font-bold text-red-500">0.1%</p><p className="text-xs text-gray-500">Unsubscribes</p></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Right Column: Analytics Charts */}
                <div className="space-y-8">
                     <Card>
                         <CardHeader><CardTitle>Engagement Over Time</CardTitle></CardHeader>
                         <CardContent className="h-[250px]">
                             <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={hourlyData}>
                                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                     <XAxis dataKey="hour" tick={{fontSize: 10}} />
                                     <YAxis tick={{fontSize: 10}} />
                                     <Tooltip />
                                     <Area type="monotone" dataKey="opens" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={2} />
                                     <Area type="monotone" dataKey="clicks" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} strokeWidth={2} />
                                 </AreaChart>
                             </ResponsiveContainer>
                         </CardContent>
                     </Card>

                     <Card>
                         <CardHeader><CardTitle>Click Performance</CardTitle></CardHeader>
                         <CardContent className="h-[250px]">
                             <ResponsiveContainer width="100%" height="100%">
                                 <PieChart>
                                     <Pie data={linkData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                         {linkData.map((entry, index) => (
                                             <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B'][index % 3]} />
                                         ))}
                                     </Pie>
                                     <Tooltip />
                                     <Legend verticalAlign="bottom" height={36}/>
                                 </PieChart>
                             </ResponsiveContainer>
                         </CardContent>
                     </Card>

                     <Card>
                        <CardHeader><CardTitle>Activity Log</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4 relative pl-4 border-l border-gray-200 dark:border-zinc-800">
                                {[
                                    { action: "Campaign Sent", time: "Jan 20, 09:00 AM", user: "System" },
                                    { action: "Approved by Manager", time: "Jan 19, 04:30 PM", user: "Sarah K." },
                                    { action: "Scheduled for Sending", time: "Jan 19, 02:00 PM", user: "John Doe" },
                                    { action: "Draft Created", time: "Jan 15, 10:00 AM", user: "John Doe" },
                                ].map((log, i) => (
                                    <div key={i} className="relative pl-6">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-300 dark:bg-zinc-700 border-2 border-white dark:border-zinc-900"></div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{log.action}</p>
                                        <p className="text-xs text-gray-500">{log.time} • {log.user}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                     </Card>
                </div>
             </div>

             {/* Edit Drawer */}
             <CreateEmailDrawer 
                open={isEditOpen} 
                onClose={() => setIsEditOpen(false)} 
                campaignToEdit={campaign} // Pass existing data
             />
        </div>
    );
};

export default EmailCampaignDetailPage;
