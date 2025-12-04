
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/Table";
import { Badge } from "../../../components/ui/Badge";
import { Checkbox } from "../../../components/ui/Checkbox";
import { Button } from "../../../components/ui/Button";
import { Icon } from "../../../components/shared/Icon";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../../components/ui/DropdownMenu';
import { formatCurrency } from '../../../lib/utils';
import type { Campaign } from '../../../types';

interface CampaignTableViewProps {
    campaigns: Campaign[];
    sortConfig: { key: string; direction: 'asc' | 'desc' };
    onSort: (key: string) => void;
    selectedIds: string[];
    onSelectRow: (id: string) => void;
    onSelectAll: (checked: boolean) => void;
    totalCount: number;
}

const STATUS_COLORS: Record<string, "green" | "blue" | "gray" | "yellow" | "red" | "default"> = {
  'Active': 'green',
  'Scheduled': 'blue',
  'Planned': 'blue',
  'Completed': 'gray',
  'Paused': 'yellow',
  'On Hold': 'yellow',
  'Cancelled': 'red'
};

const SortableHead = ({ label, sortKey, currentSort, onSort, align = 'left' }: any) => {
    const isActive = currentSort.key === sortKey;
    return (
        <TableHead 
            className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors select-none text-${align}`}
            onClick={() => onSort(sortKey)}
        >
            <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
                {label}
                <div className="flex flex-col w-3">
                    <Icon name="arrowUp" className={`w-2 h-2 ${isActive && currentSort.direction === 'asc' ? 'text-blue-600' : 'text-gray-300'}`} />
                    <Icon name="arrowDown" className={`w-2 h-2 -mt-0.5 ${isActive && currentSort.direction === 'desc' ? 'text-blue-600' : 'text-gray-300'}`} />
                </div>
            </div>
        </TableHead>
    );
};

export const CampaignTableView: React.FC<CampaignTableViewProps> = ({ 
    campaigns, 
    sortConfig, 
    onSort,
    selectedIds,
    onSelectRow,
    onSelectAll,
    totalCount
}) => {
    const navigate = useNavigate();
    const allSelected = campaigns.length > 0 && selectedIds.length === campaigns.length; 
    const someSelected = selectedIds.length > 0 && !allSelected;

    return (
        <div className="rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 dark:bg-zinc-800/50 hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
                            <TableHead className="w-12 pl-4">
                                <Checkbox 
                                    checked={allSelected} 
                                    onCheckedChange={(c) => onSelectAll(!!c)}
                                    className={someSelected ? "opacity-50" : ""}
                                />
                            </TableHead>
                            <SortableHead label="Campaign Name" sortKey="name" currentSort={sortConfig} onSort={onSort} />
                            <SortableHead label="Status" sortKey="status" currentSort={sortConfig} onSort={onSort} />
                            <SortableHead label="Type" sortKey="type" currentSort={sortConfig} onSort={onSort} />
                            <SortableHead label="Owner" sortKey="owner" currentSort={sortConfig} onSort={onSort} />
                            <SortableHead label="Spend" sortKey="spend" currentSort={sortConfig} onSort={onSort} align="right" />
                            <SortableHead label="Revenue" sortKey="revenue" currentSort={sortConfig} onSort={onSort} align="right" />
                            <SortableHead label="ROI" sortKey="roi" currentSort={sortConfig} onSort={onSort} align="right" />
                            <TableHead className="text-right w-20 pr-4">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {campaigns.map((campaign) => {
                            const isSelected = selectedIds.includes(campaign.id);
                            return (
                                <TableRow 
                                    key={campaign.id} 
                                    className={`group transition-colors border-b border-gray-100 dark:border-zinc-800/50 last:border-0 cursor-pointer ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-zinc-800/30'}`}
                                    onClick={() => navigate(`/marketing/campaigns/${campaign.id}`)}
                                >
                                    <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                                        <Checkbox 
                                            checked={isSelected} 
                                            onCheckedChange={() => onSelectRow(campaign.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col max-w-[250px]">
                                            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors truncate" title={campaign.name}>
                                                {campaign.name}
                                            </span>
                                            <span className="text-xs text-gray-500 font-mono">{campaign.id}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={STATUS_COLORS[campaign.status] || 'default'} className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold border shadow-sm">
                                            {campaign.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap">{campaign.type}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-700 dark:to-zinc-800 border border-gray-200 dark:border-zinc-600 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300 font-bold shadow-sm">
                                                {campaign.owner.avatar}
                                            </div>
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{campaign.owner.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-sm text-gray-600 dark:text-gray-400">
                                        {formatCurrency(campaign.metrics.spend)}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {formatCurrency(campaign.metrics.revenue)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                                            campaign.metrics.roi >= 300 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                            campaign.metrics.roi >= 100 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}>
                                            {campaign.metrics.roi}%
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right pr-4" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                                                    <Icon name="moreVertical" className="w-4 h-4"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/marketing/campaigns/${campaign.id}`)}>
                                                    <Icon name="fileText" className="w-4 h-4 mr-2 text-gray-500"/> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Icon name="edit" className="w-4 h-4 mr-2 text-gray-500"/> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Icon name="analytics" className="w-4 h-4 mr-2 text-gray-500"/> Analytics
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                                    <Icon name="close" className="w-4 h-4 mr-2"/> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
