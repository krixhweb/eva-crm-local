
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/Card";
import { Icon } from '../../../../components/shared/Icon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/Table";
import { Progress } from "../../../../components/ui/Progress";
import { Badge } from "../../../../components/ui/Badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency } from '../../../../lib/utils';
import { mockTeamMembers } from '../../../../data/mockData';
import { motion } from 'framer-motion';
import { staggerContainer, slideUp, fadeIn } from '../../../../lib/motion';

const KPICard = ({ title, value, change, icon, changeIsPositive }: any) => (
    <motion.div {...({ variants: slideUp } as any)}>
        <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Icon name={icon} className="h-4 w-4 text-gray-500" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold tracking-tight">{value}</div>
                <p className={`text-xs mt-1 font-medium flex items-center gap-1 ${changeIsPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <Icon name={changeIsPositive ? 'trendingUp' : 'trendingUp'} className={`w-3 h-3 ${!changeIsPositive && 'rotate-180'}`} />
                    {change} from last period
                </p>
            </CardContent>
        </Card>
    </motion.div>
);

const Performance: React.FC<any> = ({ metrics }) => {
    const navigate = useNavigate();

    return (
        <motion.div 
            {...({
                variants: staggerContainer,
                initial: "hidden",
                animate: "show"
            } as any)}
            className="space-y-6"
        >
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Total Revenue" value={formatCurrency(metrics.revenue)} change="15.2%" icon="dollarSign" changeIsPositive={true} />
                <KPICard title="Win Rate" value={`${metrics.winRate}%`} change="3.1%" icon="trophy" changeIsPositive={true} />
                <KPICard title="New Deals" value={metrics.deals.toString()} change="5.4%" icon="plus" changeIsPositive={false} />
                <KPICard title="Activities" value={metrics.activities.toString()} change="21.3%" icon="activity" changeIsPositive={true} />
            </div>
    
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div {...({ variants: fadeIn } as any)} className="h-full">
                    <Card className="flex flex-col h-full">
                        <CardHeader>
                            <CardTitle>Revenue Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={metrics.revenueChart}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" vertical={false} />
                                        <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis tickFormatter={(value) => `₹${value/1000}k`} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.1)' }} />
                                        <Legend verticalAlign="top" align="right" iconType="circle" />
                                        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3B82F6" strokeWidth={3} fill="url(#colorRevenue)" animationDuration={1500} />
                                        <Area type="monotone" dataKey="quota" name="Quota" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
        
                <motion.div {...({ variants: fadeIn } as any)} className="h-full">
                    <Card className="flex flex-col h-full">
                        <CardHeader>
                            <CardTitle>Win Rate Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={metrics.winRateChart}>
                                        <defs>
                                            <linearGradient id="colorWinRate" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" vertical={false} />
                                        <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <Tooltip formatter={(value: number) => `${value}%`} contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.1)' }} />
                                        <Legend verticalAlign="top" align="right" iconType="circle" />
                                        <Area type="monotone" dataKey="rate" stroke="#16A34A" strokeWidth={3} fillOpacity={1} fill="url(#colorWinRate)" name="Win Rate" animationDuration={1500} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
    
            {/* Leaderboard */}
            <motion.div {...({ variants: slideUp } as any)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Sales Team Board</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[60px] text-center">Rank</TableHead>
                                    <TableHead>Sales Representative</TableHead>
                                    <TableHead>Deals</TableHead>
                                    <TableHead>Revenue</TableHead>
                                    <TableHead>Commission</TableHead>
                                    <TableHead className="w-[250px]">Quota Progress</TableHead>
                                    <TableHead>Win Rate</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockTeamMembers.map((rep, index) => {
                                    const progress = Math.min(100, Math.round((rep.revenue / 1500000) * 100));
                                    const winRate = 50 + Math.round(Math.random() * 30);
                                    return (
                                        <TableRow 
                                            key={rep.id} 
                                            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
                                            onClick={() => navigate(`/sales/rep/${rep.id}`)}
                                        >
                                            <TableCell className="text-center">
                                                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-transform group-hover:scale-110 ${
                                                    index === 0 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                    index === 1 ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                                                    index === 2 ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                                    'bg-white text-gray-500 border border-gray-100'
                                                }`}>
                                                    #{index + 1}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
                                                        {rep.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">{rep.name}</div>
                                                        <div className="text-xs text-gray-500">Senior Executive</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-700 dark:text-gray-300">{rep.dealsClosed}</TableCell>
                                            <TableCell className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(rep.revenue)}</TableCell>
                                            <TableCell className="text-gray-600 dark:text-gray-400">{formatCurrency(rep.revenue * 0.1)}</TableCell>
                                            <TableCell>
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                                                        <span>{formatCurrency(rep.revenue)} / {formatCurrency(1500000)}</span>
                                                        <span className={progress >= 100 ? 'text-green-600' : ''}>{progress}%</span>
                                                    </div>
                                                    <Progress value={progress} className="h-2" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={winRate >= 65 ? "green" : winRate >= 50 ? "yellow" : "gray"}>
                                                    {winRate}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Icon name="chevronRight" className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default Performance;
