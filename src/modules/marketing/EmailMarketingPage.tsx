
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/shared/Icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/DropdownMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Checkbox } from '../../components/ui/Checkbox';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../lib/utils';
import { CreateEmailDrawer } from './components/channel/CreateEmailDrawer';
import { EmailTemplatesTab } from './components/channel/EmailTemplatesTab';
import { EmailFilterDrawer, EmailFiltersState } from './components/channel/EmailFilterDrawer';
import { EmailMarketingToolbar } from './components/channel/EmailMarketingToolbar';
import { mockEmailCampaigns } from '../../data/emailMockData';
import type { EmailCampaign } from '../../types';
import { useGlassyToasts } from '../../components/ui/GlassyToastProvider';
import ConfirmationDialog from '../../components/modals/ConfirmationDialog';
import { EmailAnalyticsTab } from './components/channel/EmailAnalyticsTab';

const DEFAULT_FILTERS: EmailFiltersState = {
    status: [],
    audience: 'all',
    dateFrom: null,
    dateTo: null,
    minOpenRate: '',
    tags: []
};

const EmailMarketingPage: React.FC = () => {
    const navigate = useNavigate();
    const { push } = useGlassyToasts();
    
    // --- STATE ---
    const [activeTab, setActiveTab] = useState("campaigns");
    const [campaigns, setCampaigns] = useState<EmailCampaign[]>(mockEmailCampaigns);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<EmailFiltersState>(DEFAULT_FILTERS);
    const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null);
    
    // Pagination & Sorting
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortConfig, setSortConfig] = useState<{ key: keyof EmailCampaign | string, direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });
    
    // Selection & Actions
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- MOCK ASYNC LOAD ---
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(timer);
    }, [search, filters, currentPage, sortConfig]);

    // --- FILTERING LOGIC ---
    const filteredCampaigns = useMemo(() => {
        return campaigns.filter(c => {
            // Search
            const matchesSearch = !search || 
                c.name.toLowerCase().includes(search.toLowerCase()) || 
                c.subject.toLowerCase().includes(search.toLowerCase()) ||
                c.id.toLowerCase().includes(search.toLowerCase());
            
            // Status
            const matchesStatus = filters.status.length === 0 || filters.status.includes(c.status);
            
            // Audience
            const matchesAudience = filters.audience === 'all' || c.audience === filters.audience;
            
            // Date Range
            let matchesDate = true;
            if (filters.dateFrom) matchesDate = matchesDate && new Date(c.createdAt) >= new Date(filters.dateFrom);
            if (filters.dateTo) matchesDate = matchesDate && new Date(c.createdAt) <= new Date(filters.dateTo);

            // Metrics
            const openRate = c.stats.delivered > 0 ? (c.stats.opens / c.stats.delivered) * 100 : 0;
            const matchesPerf = !filters.minOpenRate || openRate >= Number(filters.minOpenRate);

            // Tags
            const matchesTags = filters.tags.length === 0 || filters.tags.some(t => c.tags?.includes(t));

            return matchesSearch && matchesStatus && matchesAudience && matchesDate && matchesPerf && matchesTags;
        });
    }, [campaigns, search, filters]);

    // --- SORTING LOGIC ---
    const sortedCampaigns = useMemo(() => {
        return [...filteredCampaigns].sort((a, b) => {
            const dir = sortConfig.direction === 'asc' ? 1 : -1;
            
            if (sortConfig.key === 'openRate') {
                const rateA = a.stats.delivered > 0 ? a.stats.opens / a.stats.delivered : 0;
                const rateB = b.stats.delivered > 0 ? b.stats.opens / b.stats.delivered : 0;
                return (rateA - rateB) * dir;
            }
            if (sortConfig.key === 'clickRate') {
                const rateA = a.stats.delivered > 0 ? a.stats.clicks / a.stats.delivered : 0;
                const rateB = b.stats.delivered > 0 ? b.stats.clicks / b.stats.delivered : 0;
                return (rateA - rateB) * dir;
            }
            if (sortConfig.key === 'revenue') {
                return (a.stats.revenue - b.stats.revenue) * dir;
            }
            
            // Default string/date sorting
            const valA = a[sortConfig.key as keyof EmailCampaign];
            const valB = b[sortConfig.key as keyof EmailCampaign];
            
            if (typeof valA === 'string' && typeof valB === 'string') {
                return valA.localeCompare(valB) * dir;
            }
            return 0;
        });
    }, [filteredCampaigns, sortConfig]);

    // --- PAGINATION LOGIC ---
    const paginatedCampaigns = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedCampaigns.slice(start, start + itemsPerPage);
    }, [sortedCampaigns, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

    // --- DYNAMIC KPI LOGIC ---
    const kpiStats = useMemo(() => {
        const dataSet = filteredCampaigns; // KPIs reflect the current filter view
        if (dataSet.length === 0) return [
            { label: "Deliverability", value: "0%", trend: "0%", trendUp: true, color: "bg-gray-100 text-gray-600", icon: "checkCircle" },
            { label: "Avg Open Rate", value: "0%", trend: "0%", trendUp: true, color: "bg-gray-100 text-gray-600", icon: "eye" },
            { label: "Avg Click Rate", value: "0%", trend: "0%", trendUp: true, color: "bg-gray-100 text-gray-600", icon: "mousePointer" },
            { label: "Total Revenue", value: "₹0", trend: "0%", trendUp: true, color: "bg-gray-100 text-gray-600", icon: "dollarSign" },
        ];

        const totalSent = dataSet.reduce((acc, c) => acc + c.stats.delivered, 0);
        const totalOpens = dataSet.reduce((acc, c) => acc + c.stats.opens, 0);
        const totalClicks = dataSet.reduce((acc, c) => acc + c.stats.clicks, 0);
        const totalRevenue = dataSet.reduce((acc, c) => acc + c.stats.revenue, 0);
        const totalAttempted = dataSet.reduce((acc, c) => acc + c.audienceCount, 0);
        
        const delRate = totalAttempted > 0 ? (totalSent / totalAttempted) * 100 : 0;
        const openRate = totalSent > 0 ? (totalOpens / totalSent) * 100 : 0;
        const clickRate = totalSent > 0 ? (totalClicks / totalSent) * 100 : 0;

        return [
            { label: "Deliverability", value: `${delRate.toFixed(1)}%`, trend: "+0.2%", trendUp: true, color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400", icon: "checkCircle" },
            { label: "Avg Open Rate", value: `${openRate.toFixed(1)}%`, trend: "+2.4%", trendUp: true, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400", icon: "eye" },
            { label: "Avg Click Rate", value: `${clickRate.toFixed(1)}%`, trend: "-0.5%", trendUp: false, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400", icon: "mousePointer" },
            { label: "Total Revenue", value: formatCurrency(totalRevenue), trend: "+15%", trendUp: true, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400", icon: "dollarSign" },
        ];
    }, [filteredCampaigns]);

    // --- HANDLERS ---
    const handleSort = (key: string) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedIds(checked ? paginatedCampaigns.map(c => c.id) : []);
    };

    const handleSelectRow = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleDelete = () => {
        if (deleteTarget) {
            setCampaigns(prev => prev.filter(c => c.id !== deleteTarget));
            push({ title: "Campaign Deleted", variant: "error" });
            setDeleteTarget(null);
        }
    };

    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedIds.length} campaigns?`)) {
            setCampaigns(prev => prev.filter(c => !selectedIds.includes(c.id)));
            setSelectedIds([]);
            push({ title: "Campaigns Deleted", variant: "error" });
        }
    };

    const handleDuplicate = (campaign: EmailCampaign) => {
        const newCampaign = { ...campaign, id: `EC-${Date.now()}`, name: `Copy of ${campaign.name}`, status: 'Draft' as const, createdAt: new Date().toISOString(), stats: { delivered: 0, opens: 0, clicks: 0, bounces: 0, unsubscribes: 0, revenue: 0 } };
        setCampaigns([newCampaign, ...campaigns]);
        push({ title: "Campaign Duplicated", variant: "success" });
    };

    // --- RENDER HELPERS ---
    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'Sent': return 'green';
            case 'Scheduled': return 'blue';
            case 'Draft': return 'gray';
            case 'Active': return 'purple';
            case 'Failed': return 'red';
            case 'Paused': return 'yellow';
            default: return 'default';
        }
    };

    // Count active filters
    const activeFilterCount = 
        (filters.status.length > 0 ? 1 : 0) +
        (filters.audience !== 'all' ? 1 : 0) +
        (filters.dateFrom || filters.dateTo ? 1 : 0) +
        (filters.minOpenRate ? 1 : 0) +
        (filters.tags.length > 0 ? 1 : 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Top Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Email Marketing</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage campaigns, templates, and performance.</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                    <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="campaigns" className="space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {kpiStats.map((stat, i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${stat.color}`}>
                                            <Icon name={stat.icon as any} className="h-5 w-5" />
                                        </div>
                                        <div className={`flex items-center text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                            <Icon name="trendingUp" className={`h-3 w-3 mr-1 ${!stat.trendUp && "rotate-180"}`} />
                                            {stat.trend}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Toolbar */}
                    <EmailMarketingToolbar 
                        search={search}
                        onSearchChange={setSearch}
                        activeFilterCount={activeFilterCount}
                        onOpenFilter={() => setIsFilterOpen(true)}
                        sortKey={String(sortConfig.key)}
                        onSortChange={handleSort}
                        onExport={() => push({title: "Exporting...", description: "CSV download started."})}
                        onCreate={() => navigate('/marketing/channel/email/create')}
                        selectedCount={selectedIds.length}
                        onBulkDelete={handleBulkDelete}
                    />

                    {/* Main Table Card */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50 dark:bg-zinc-800/50">
                                            <TableHead className="w-12 pl-4">
                                                <Checkbox 
                                                    checked={selectedIds.length === paginatedCampaigns.length && paginatedCampaigns.length > 0}
                                                    onCheckedChange={handleSelectAll}
                                                />
                                            </TableHead>
                                            <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>Campaign Name</TableHead>
                                            <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>Status</TableHead>
                                            <TableHead>Audience</TableHead>
                                            <TableHead className="text-right cursor-pointer" onClick={() => handleSort('createdAt')}>Sent / Created</TableHead>
                                            <TableHead className="text-right cursor-pointer" onClick={() => handleSort('openRate')}>Open Rate</TableHead>
                                            <TableHead className="text-right cursor-pointer" onClick={() => handleSort('clickRate')}>CTR</TableHead>
                                            <TableHead className="text-right cursor-pointer" onClick={() => handleSort('revenue')}>Revenue</TableHead>
                                            <TableHead className="w-12"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            [1,2,3].map(i => (
                                                <TableRow key={i}>
                                                    <TableCell colSpan={9} className="h-16">
                                                        <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded w-full animate-pulse"></div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : paginatedCampaigns.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                                                    No campaigns found matching your criteria.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedCampaigns.map((c) => {
                                                const openRate = c.stats.delivered > 0 ? (c.stats.opens / c.stats.delivered) * 100 : 0;
                                                const clickRate = c.stats.delivered > 0 ? (c.stats.clicks / c.stats.delivered) * 100 : 0;
                                                return (
                                                    <TableRow key={c.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer" onClick={() => navigate(`/marketing/channel/email/${c.id}`)}>
                                                        <TableCell className="pl-4" onClick={e => e.stopPropagation()}>
                                                            <Checkbox 
                                                                checked={selectedIds.includes(c.id)}
                                                                onCheckedChange={() => handleSelectRow(c.id)}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <p className="font-medium text-gray-900 dark:text-gray-100">{c.name}</p>
                                                                <p className="text-xs text-gray-500">{c.subject}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={getStatusBadge(c.status) as any} className="rounded-full px-2.5">{c.status}</Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                {c.audience}
                                                                <span className="text-xs text-gray-400 block">{c.audienceCount.toLocaleString()} recipients</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right text-sm text-gray-500">
                                                            {c.sentAt ? new Date(c.sentAt).toLocaleDateString() : c.scheduledFor ? new Date(c.scheduledFor).toLocaleDateString() : new Date(c.createdAt).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {c.status === 'Sent' || c.status === 'Active' ? (
                                                                <span className={`font-medium ${openRate > 20 ? 'text-green-600' : 'text-gray-600'}`}>{openRate.toFixed(1)}%</span>
                                                            ) : '-'}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                             {c.status === 'Sent' || c.status === 'Active' ? (
                                                                <span className="font-medium">{clickRate.toFixed(1)}%</span>
                                                             ) : '-'}
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium text-gray-900 dark:text-gray-100">
                                                            {formatCurrency(c.stats.revenue)}
                                                        </TableCell>
                                                        <TableCell className="text-right pr-4" onClick={e => e.stopPropagation()}>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-700">
                                                                        <Icon name="moreVertical" className="w-4 h-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onClick={() => navigate(`/marketing/channel/email/${c.id}`)}>
                                                                        <Icon name="fileText" className="w-4 h-4 mr-2"/> View Report
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => { setEditingCampaign(c); setIsCreateOpen(true); }}>
                                                                        <Icon name="edit" className="w-4 h-4 mr-2"/> Edit
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleDuplicate(c)}>
                                                                        <Icon name="copy" className="w-4 h-4 mr-2"/> Duplicate
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setDeleteTarget(c.id)}>
                                                                        <Icon name="trash" className="w-4 h-4 mr-2"/> Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            
                            {/* Pagination */}
                            {filteredCampaigns.length > 0 && (
                                <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100 dark:border-zinc-800">
                                    <div className="text-sm text-gray-500">
                                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCampaigns.length)} of {filteredCampaigns.length}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
                                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="templates" className="mt-6">
                    <EmailTemplatesTab />
                </TabsContent>
                
                <TabsContent value="analytics" className="mt-6">
                     <EmailAnalyticsTab />
                </TabsContent>
            </Tabs>

            {/* Drawers & Dialogs */}
            <CreateEmailDrawer 
                open={isCreateOpen} 
                onClose={() => { setIsCreateOpen(false); setEditingCampaign(null); }} 
                campaignToEdit={editingCampaign} 
            />
            
            <EmailFilterDrawer 
                open={isFilterOpen} 
                onClose={() => setIsFilterOpen(false)} 
                currentFilters={filters}
                onApply={setFilters}
                onReset={() => setFilters(DEFAULT_FILTERS)}
            />

            <ConfirmationDialog 
                isOpen={!!deleteTarget} 
                onClose={() => setDeleteTarget(null)} 
                onConfirm={handleDelete}
                title="Delete Campaign"
                description="Are you sure you want to delete this campaign? This cannot be undone."
            />
        </div>
    );
};

export default EmailMarketingPage;
