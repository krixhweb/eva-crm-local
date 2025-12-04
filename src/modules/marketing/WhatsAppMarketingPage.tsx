
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Icon } from "../../components/shared/Icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { CreateWhatsAppDrawer } from './components/channel/CreateWhatsAppDrawer';

// Mock Data
const mockBroadcasts = [
    { id: 'WA-001', name: "Flash Sale Alert", template: "flash_sale_v1", audience: "VIP Customers", delivered: 500, read: 450, replied: 45, status: "Completed", date: "2024-07-25" },
    { id: 'WA-002', name: "Order Update", template: "order_shipped", audience: "Recent Buyers", delivered: 120, read: 118, replied: 2, status: "Active", date: "Automated" },
    { id: 'WA-003', name: "Abandoned Cart Recovery", template: "cart_reminder", audience: "Cart Abandoners", delivered: 50, read: 30, replied: 5, status: "Active", date: "Automated" },
    { id: 'WA-004', name: "Diwali Greeting", template: "festive_greet", audience: "All Contacts", delivered: 2500, read: 2100, replied: 150, status: "Scheduled", date: "2024-10-30" },
];

const stats = [
    { label: "Messages Sent", value: "3,170", icon: "send", color: "text-green-600 bg-green-100 dark:bg-green-900/20" },
    { label: "Read Rate", value: "92%", icon: "checkCircle", color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20" },
    { label: "Replied", value: "6.4%", icon: "messageSquare", color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20" },
    { label: "Failed", value: "0.8%", icon: "alertCircle", color: "text-red-600 bg-red-100 dark:bg-red-900/20" },
];

const WhatsAppMarketingPage: React.FC = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [search, setSearch] = useState('');

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Completed': return 'green';
            case 'Active': return 'blue';
            case 'Scheduled': return 'yellow';
            default: return 'gray';
        }
    };

    const filteredBroadcasts = mockBroadcasts.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">WhatsApp Marketing</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your WhatsApp broadcasts and templates.</p>
            </div>

            {/* Header & Integration Status */}
            <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-800/30">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                        <Icon name="messageCircle" className="h-6 w-6 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-green-800 dark:text-green-300">WhatsApp Business API Connected</h3>
                        <p className="text-xs text-green-600 dark:text-green-400">Provider: Gupshup • Number: +91 98765 43210</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-100 dark:border-green-800 dark:text-green-300">
                    Manage Settings
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${stat.color}`}>
                                    <Icon name={stat.icon as any} className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Actions & Table */}
            <Card>
                <CardHeader className="border-b border-gray-100 dark:border-zinc-800 pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-72">
                            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                                placeholder="Search broadcasts..." 
                                className="pl-9" 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm" onClick={() => setIsCreateOpen(true)}>
                                <Icon name="plus" className="h-4 w-4 mr-2" /> New Broadcast
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 dark:bg-zinc-800/50">
                                    <TableHead>Broadcast Name</TableHead>
                                    <TableHead>Template</TableHead>
                                    <TableHead>Audience</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-center">Delivered</TableHead>
                                    <TableHead className="text-center">Read</TableHead>
                                    <TableHead className="text-center">Replied</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBroadcasts.map((b) => (
                                    <TableRow key={b.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">{b.name}</TableCell>
                                        <TableCell className="font-mono text-xs text-gray-500">{b.template}</TableCell>
                                        <TableCell className="text-gray-600 dark:text-gray-400 text-sm">{b.audience}</TableCell>
                                        <TableCell className="text-gray-600 dark:text-gray-400 text-sm">{b.date}</TableCell>
                                        <TableCell className="text-center text-gray-900 font-medium">{b.delivered}</TableCell>
                                        <TableCell className="text-center text-blue-600 font-medium">
                                            {Math.round((b.read / b.delivered) * 100)}%
                                        </TableCell>
                                        <TableCell className="text-center text-purple-600 font-medium">
                                            {b.replied}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={getStatusBadge(b.status) as any}>{b.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <CreateWhatsAppDrawer open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
        </div>
    );
};

export default WhatsAppMarketingPage;
