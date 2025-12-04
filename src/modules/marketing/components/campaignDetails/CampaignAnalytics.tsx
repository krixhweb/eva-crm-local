
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Icon } from '../../../../components/shared/Icon';
import { Button } from '../../../../components/ui/Button';
import { formatCurrency } from '../../../../lib/utils';
import { useGlassyToasts } from '../../../../components/ui/GlassyToastProvider';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import type { Campaign } from '../../../../types';

interface CampaignAnalyticsProps {
  campaign: Campaign;
}

// --- Reusable UI Components ---

const SectionHeader = ({ title, icon }: { title: string; icon: string }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-zinc-800">
        <Icon name={icon} className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">{title}</h3>
    </div>
);

const KPICard = ({ title, value, icon, trend, trendUp, colorClass }: any) => (
  <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow relative overflow-hidden group">
    <div className={`absolute -right-4 -top-4 p-4 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${colorClass} bg-current pointer-events-none`}>
         <Icon name={icon} className="w-24 h-24" />
    </div>

    <div className="flex justify-between items-start relative z-10">
        <div>
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        </div>
        <div className={`p-2 rounded-xl ${colorClass} bg-opacity-10`}>
            <Icon name={icon} className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
    </div>

    {trend && (
        <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${trendUp ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                <Icon name="trendingUp" className={`w-3 h-3 mr-1 ${!trendUp && 'rotate-180'}`} />
                {trend}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">vs last period</span>
        </div>
    )}
  </div>
);

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-zinc-900 p-3 border border-gray-100 dark:border-zinc-800 shadow-xl rounded-xl text-xs">
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-gray-500 capitalize">{entry.name}:</span>
                        <span className="font-medium font-mono">
                            {formatter ? formatter(entry.value) : entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// --- Data Generators ---

const generateTimelineData = (days: number, type: string) => {
  return Array.from({ length: days }).map((_, i) => {
    const base = Math.floor(Math.random() * 100);
    return {
      day: `Day ${i + 1}`,
      // Generic
      revenue: Math.floor(Math.random() * 5000) + 1000,
      spend: Math.floor(Math.random() * 2000) + 500,
      // Email
      opens: base * 4 + Math.floor(Math.random() * 50),
      clicks: base + Math.floor(Math.random() * 10),
      // Social
      engagement: base * 2 + Math.floor(Math.random() * 100),
      reach: base * 10 + Math.floor(Math.random() * 500),
      // Webinar
      registrations: Math.floor(Math.random() * 20),
      // ROI
      roi: Math.floor(Math.random() * 300) + 50,
    };
  });
};

const getDistributionData = (type: string) => {
    if (type === 'Social Media' || type === 'Advertisement') {
        return [
            { name: 'Facebook', value: 45, color: '#3B82F6' },
            { name: 'Instagram', value: 35, color: '#E4405F' },
            { name: 'LinkedIn', value: 20, color: '#0A66C2' },
        ];
    }
    if (type === 'Email Campaign') {
         return [
            { name: 'Desktop', value: 40, color: '#8B5CF6' },
            { name: 'Mobile', value: 55, color: '#10B981' },
            { name: 'Tablet', value: 5, color: '#F59E0B' },
        ];
    }
    return [];
};

// --- Main Component Logic ---

export const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({ campaign }) => {
  const { push } = useGlassyToasts();

  const handleRefresh = () => {
      push({ title: "Refreshing Data...", description: "Fetching latest analytics metrics.", variant: "info" });
  };
  
  // --- 1. CONFIGURATION BASED ON TYPE ---
  const config = useMemo(() => {
    const { metrics } = campaign;
    const type = campaign.type;

    // Default Metrics (Advertisement / Generic)
    let kpis = [
        { title: "Spend", value: formatCurrency(metrics.spend), icon: "creditCard", color: "bg-blue-500 text-blue-600", trend: "+5%" },
        { title: "Revenue", value: formatCurrency(metrics.revenue), icon: "dollarSign", color: "bg-green-500 text-green-600", trend: "+12%", trendUp: true },
        { title: "ROAS", value: `${metrics.roi}%`, icon: "trendingUp", color: "bg-purple-500 text-purple-600", trendUp: true },
        { title: "Impressions", value: metrics.impressions.toLocaleString(), icon: "users", color: "bg-indigo-500 text-indigo-600" },
        { title: "Clicks", value: metrics.clicks.toLocaleString(), icon: "mousePointer", color: "bg-pink-500 text-pink-600" },
        { title: "CTR", value: `${((metrics.clicks/metrics.impressions)*100).toFixed(2)}%`, icon: "percent", color: "bg-orange-500 text-orange-600" },
        { title: "Conversions", value: metrics.conversions.toLocaleString(), icon: "checkCircle", color: "bg-teal-500 text-teal-600" },
        { title: "Cost / Conv.", value: formatCurrency(metrics.spend / (metrics.conversions || 1)), icon: "tag", color: "bg-gray-500 text-gray-600" },
    ];

    let chartConfig = {
        mainType: 'area', // area, line, bar
        mainTitle: 'Revenue vs Spend',
        dataKeys: [
            { key: 'revenue', color: '#10B981', name: 'Revenue' },
            { key: 'spend', color: '#3B82F6', name: 'Spend' }
        ],
        hasFunnel: true,
        hasPie: true,
        pieTitle: 'Platform Distribution'
    };

    // --- CONTEXT SPECIFIC OVERRIDES ---

    if (type === 'Email Campaign') {
        const sent = metrics.impressions; // Mock mapping
        const opens = Math.floor(sent * 0.35);
        const openRate = ((opens/sent)*100).toFixed(1);
        const clickRate = ((metrics.clicks/opens)*100).toFixed(1);

        kpis = [
            { title: "Emails Sent", value: sent.toLocaleString(), icon: "send", color: "bg-blue-500 text-blue-600" },
            { title: "Delivered", value: "99.2%", icon: "checkCircle", color: "bg-green-500 text-green-600", trendUp: true },
            { title: "Opens", value: opens.toLocaleString(), icon: "mail", color: "bg-purple-500 text-purple-600" },
            { title: "Open Rate", value: `${openRate}%`, icon: "users", color: "bg-indigo-500 text-indigo-600", trend: "+2%", trendUp: true },
            { title: "Clicks", value: metrics.clicks.toLocaleString(), icon: "mousePointer", color: "bg-pink-500 text-pink-600" },
            { title: "Click Rate", value: `${clickRate}%`, icon: "percent", color: "bg-orange-500 text-orange-600" },
            { title: "Bounce Rate", value: "0.8%", icon: "alertTriangle", color: "bg-red-500 text-red-600", trend: "-0.1%", trendUp: true }, // Lower is better
            { title: "Unsubscribes", value: "12", icon: "user", color: "bg-gray-500 text-gray-600" },
        ];

        chartConfig = {
            mainType: 'line',
            mainTitle: 'Engagement Trend',
            dataKeys: [
                { key: 'opens', color: '#8B5CF6', name: 'Opens' },
                { key: 'clicks', color: '#EC4899', name: 'Clicks' }
            ],
            hasFunnel: false,
            hasPie: true,
            pieTitle: 'Device Breakdown'
        };
    } 
    else if (type === 'Social Media') {
        const engagement = metrics.clicks + Math.floor(metrics.impressions * 0.05); // Likes + Comments mock
        const engRate = ((engagement/metrics.impressions)*100).toFixed(2);

        kpis = [
            { title: "Reach", value: (metrics.impressions * 0.8).toLocaleString(), icon: "globe", color: "bg-blue-500 text-blue-600" },
            { title: "Impressions", value: metrics.impressions.toLocaleString(), icon: "eye", color: "bg-indigo-500 text-indigo-600" },
            { title: "Engagement", value: engagement.toLocaleString(), icon: "heart", color: "bg-pink-500 text-pink-600", trend: "+8%", trendUp: true },
            { title: "Eng. Rate", value: `${engRate}%`, icon: "activity", color: "bg-green-500 text-green-600" },
            { title: "Likes", value: (engagement * 0.8).toLocaleString(), icon: "thumbsUp", color: "bg-teal-500 text-teal-600" },
            { title: "Comments", value: (engagement * 0.1).toLocaleString(), icon: "messageCircle", color: "bg-orange-500 text-orange-600" },
            { title: "Shares", value: (engagement * 0.1).toLocaleString(), icon: "share", color: "bg-purple-500 text-purple-600" },
            { title: "Saves", value: "450", icon: "bookmark", color: "bg-gray-500 text-gray-600" },
        ];

        chartConfig = {
            mainType: 'area',
            mainTitle: 'Reach vs Engagement',
            dataKeys: [
                { key: 'reach', color: '#3B82F6', name: 'Reach' },
                { key: 'engagement', color: '#EC4899', name: 'Engagement' }
            ],
            hasFunnel: false,
            hasPie: true,
            pieTitle: 'Platform Distribution'
        };
    }
    else if (type === 'Webinar' || type === 'Conference / Event') {
        const registrations = metrics.conversions;
        const attendees = Math.floor(registrations * 0.65);
        
        kpis = [
            { title: "Registrations", value: registrations.toLocaleString(), icon: "userPlus", color: "bg-blue-500 text-blue-600", trend: "+15%", trendUp: true },
            { title: "Attendees", value: attendees.toLocaleString(), icon: "users", color: "bg-green-500 text-green-600" },
            { title: "Attendance Rate", value: "65%", icon: "check", color: "bg-teal-500 text-teal-600" },
            { title: "Drop-off", value: "35%", icon: "userMinus", color: "bg-red-500 text-red-600" },
            { title: "Avg Time", value: "45m", icon: "clock", color: "bg-purple-500 text-purple-600" },
            { title: "Questions", value: "124", icon: "helpCircle", color: "bg-orange-500 text-orange-600" },
        ];

         chartConfig = {
            mainType: 'bar',
            mainTitle: 'Daily Registrations',
            dataKeys: [
                { key: 'registrations', color: '#3B82F6', name: 'Registrations' }
            ],
            hasFunnel: true,
            hasPie: false,
            pieTitle: ''
        };
    }
    else if (type === 'Referral Program') {
        kpis = [
             { title: "Referrals Sent", value: "1,250", icon: "send", color: "bg-blue-500 text-blue-600" },
             { title: "Converted", value: "320", icon: "checkCircle", color: "bg-green-500 text-green-600" },
             { title: "Conv. Rate", value: "25.6%", icon: "percent", color: "bg-teal-500 text-teal-600" },
             { title: "Reward Cost", value: formatCurrency(15000), icon: "gift", color: "bg-purple-500 text-purple-600" },
             { title: "Revenue", value: formatCurrency(metrics.revenue), icon: "dollarSign", color: "bg-emerald-500 text-emerald-600" },
             { title: "ROI", value: `${metrics.roi}%`, icon: "trendingUp", color: "bg-orange-500 text-orange-600" },
        ];
         chartConfig = {
            mainType: 'area',
            mainTitle: 'Referral Growth',
            dataKeys: [
                { key: 'revenue', color: '#10B981', name: 'Revenue' }
            ],
            hasFunnel: false,
            hasPie: false,
            pieTitle: ''
        };
    }
    else if (type === 'SMS / WhatsApp Campaign') {
        kpis = [
            { title: "Sent", value: metrics.impressions.toLocaleString(), icon: "send", color: "bg-blue-500 text-blue-600" },
            { title: "Delivered", value: (metrics.impressions * 0.98).toLocaleString(), icon: "check", color: "bg-green-500 text-green-600" },
            { title: "Read Rate", value: "85%", icon: "eye", color: "bg-purple-500 text-purple-600" },
            { title: "Replies", value: "342", icon: "messageSquare", color: "bg-orange-500 text-orange-600" },
            { title: "Clicks", value: metrics.clicks.toLocaleString(), icon: "mousePointer", color: "bg-pink-500 text-pink-600" },
            { title: "Opt-outs", value: "0.5%", icon: "userX", color: "bg-red-500 text-red-600" },
        ];
        chartConfig = {
            mainType: 'bar',
            mainTitle: 'Response Timeline',
            dataKeys: [
                { key: 'clicks', color: '#EC4899', name: 'Clicks' }
            ],
            hasFunnel: false,
            hasPie: false,
            pieTitle: ''
        };
    }

    return { kpis, chartConfig };

  }, [campaign]);

  // --- Mock Data (Re-calculated on render for simplicity) ---
  const timelineData = useMemo(() => generateTimelineData(7, campaign.type), [campaign.type]);
  const distributionData = useMemo(() => getDistributionData(campaign.type), [campaign.type]);
  
  // --- Funnel Data (Only for relevant types) ---
  const funnelData = useMemo(() => [
    { label: 'Impressions/Sent', value: campaign.metrics.impressions, color: 'from-blue-400 to-blue-600' },
    { label: 'Clicks/Visits', value: campaign.metrics.clicks, color: 'from-indigo-400 to-indigo-600' },
    { label: 'Conversions', value: campaign.metrics.conversions, color: 'from-green-400 to-green-600' },
  ], [campaign]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        
      {/* Toolbar */}
      <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
              <Icon name="refreshCw" className="w-4 h-4 mr-2" /> Refresh
          </Button>
      </div>
      
      {/* 1. Performance KPIs Grid */}
      <section>
        <SectionHeader title={`${campaign.type} KPIs`} icon="activity" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {config.kpis.map((kpi, idx) => (
                <KPICard 
                    key={idx}
                    title={kpi.title} 
                    value={kpi.value} 
                    icon={kpi.icon} 
                    colorClass={kpi.color}
                    trend={kpi.trend} 
                    trendUp={kpi.trendUp}
                />
            ))}
        </div>
      </section>

      {/* 2. Trends & Charts */}
      <section>
         <SectionHeader title="Trends & Insights" icon="barChart" />
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Main Trend Chart */}
            <Card className="rounded-2xl border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden lg:col-span-1">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{config.chartConfig.mainTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {config.chartConfig.mainType === 'bar' ? (
                                <BarChart data={timelineData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.6} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9CA3AF'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9CA3AF'}} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    {config.chartConfig.dataKeys.map((dk, i) => (
                                        <Bar key={i} dataKey={dk.key} fill={dk.color} name={dk.name} radius={[4,4,0,0]} />
                                    ))}
                                </BarChart>
                            ) : config.chartConfig.mainType === 'line' ? (
                                <LineChart data={timelineData}>
                                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.6} />
                                     <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9CA3AF'}} dy={10} />
                                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9CA3AF'}} />
                                     <Tooltip content={<CustomTooltip />} />
                                     <Legend />
                                     {config.chartConfig.dataKeys.map((dk, i) => (
                                        <Line key={i} type="monotone" dataKey={dk.key} stroke={dk.color} strokeWidth={3} dot={{r:4}} name={dk.name} />
                                    ))}
                                </LineChart>
                            ) : (
                                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        {config.chartConfig.dataKeys.map((dk, i) => (
                                            <linearGradient key={i} id={`color${dk.key}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={dk.color} stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor={dk.color} stopOpacity={0}/>
                                            </linearGradient>
                                        ))}
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.6} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9CA3AF'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9CA3AF'}} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                                    {config.chartConfig.dataKeys.map((dk, i) => (
                                        <Area key={i} type="monotone" dataKey={dk.key} stroke={dk.color} strokeWidth={3} fillOpacity={1} fill={`url(#color${dk.key})`} name={dk.name} />
                                    ))}
                                </AreaChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Secondary Chart (Funnel or Pie or ROI Trend) */}
            {config.chartConfig.hasPie ? (
                 <Card className="rounded-2xl border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{config.chartConfig.pieTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[320px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={distributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {distributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total</p>
                                <p className="text-xl font-bold text-gray-800 dark:text-white">100%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : config.chartConfig.hasFunnel ? (
                 <Card className="rounded-2xl border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Performance Funnel</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[320px] flex flex-col justify-center gap-4 py-4">
                            {funnelData.map((stage, index) => {
                                const maxVal = funnelData[0].value;
                                const percentWidth = (stage.value / maxVal) * 100;
                                return (
                                    <div key={stage.label} className="relative group">
                                        <div 
                                            className={`mx-auto h-16 rounded-xl flex items-center justify-between px-6 text-white shadow-sm bg-gradient-to-r ${stage.color} transition-all hover:scale-[1.02]`}
                                            style={{ width: `${Math.max(percentWidth, 20)}%` }}
                                        >
                                            <span className="font-semibold text-sm drop-shadow-md">{stage.label}</span>
                                            <span className="font-bold font-mono drop-shadow-md">{stage.value.toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                 /* Fallback: ROI Trend for types that don't use Pie/Funnel (e.g., Referral, SMS default) */
                <Card className="rounded-2xl border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">ROI Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[320px] w-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.6} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9CA3AF'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9CA3AF'}} />
                                    <Tooltip content={<CustomTooltip formatter={(val: number) => `${val}%`} />} />
                                    <Area type="monotone" dataKey="roi" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorRoi)" name="ROI %" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}

         </div>
      </section>

    </div>
  );
};
