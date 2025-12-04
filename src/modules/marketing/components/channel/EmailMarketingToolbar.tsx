
import React from 'react';
import { Card } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Icon } from "../../../../components/shared/Icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/Select";
import { Badge } from "../../../../components/ui/Badge";

interface EmailMarketingToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    activeFilterCount: number;
    onOpenFilter: () => void;
    sortKey: string;
    onSortChange: (key: string) => void;
    onExport: () => void;
    onCreate: () => void;
    selectedCount: number;
    onBulkDelete: () => void;
}

export const EmailMarketingToolbar: React.FC<EmailMarketingToolbarProps> = ({
    search,
    onSearchChange,
    activeFilterCount,
    onOpenFilter,
    sortKey,
    onSortChange,
    onExport,
    onCreate,
    selectedCount,
    onBulkDelete
}) => {
    return (
        <Card className="p-4 mb-6 border border-gray-200 dark:border-zinc-800 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Left Side: Search & Filters */}
                <div className="flex items-center gap-3 w-full md:w-auto flex-1">
                    <div className="relative w-full md:max-w-sm">
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                            placeholder="Search campaigns..." 
                            className="pl-9 bg-white dark:bg-zinc-900" 
                            value={search} 
                            onChange={(e) => onSearchChange(e.target.value)} 
                        />
                    </div>
                    
                    <Button variant="outline" onClick={onOpenFilter} className="gap-2 relative border-gray-300 dark:border-zinc-700">
                        <Icon name="list" className="h-4 w-4" /> 
                        <span className="hidden sm:inline">Filter</span>
                        {activeFilterCount > 0 && (
                            <Badge variant="green" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </Button>

                    <div className="hidden md:flex items-center gap-2 ml-2">
                         <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
                         <Select value={String(sortKey)} onValueChange={onSortChange}>
                            <SelectTrigger className="h-9 w-[150px] text-xs bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdAt">Date Created</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="openRate">Open Rate</SelectItem>
                                <SelectItem value="revenue">Revenue</SelectItem>
                            </SelectContent>
                         </Select>
                    </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {selectedCount > 0 ? (
                        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg border border-red-100 dark:border-red-900">
                            <span className="text-sm text-red-600 font-medium hidden sm:inline">{selectedCount} selected</span>
                            <Button variant="destructive" size="sm" onClick={onBulkDelete} className="h-8">
                                <Icon name="trash" className="h-4 w-4 mr-2" /> Delete
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Button variant="outline" onClick={onExport} className="border-gray-300 dark:border-zinc-700">
                                <Icon name="download" className="h-4 w-4 mr-2" /> Export
                            </Button>
                            <Button onClick={onCreate} className="bg-green-600 hover:bg-green-700 text-white shadow-sm">
                                <Icon name="plus" className="h-4 w-4 mr-2" /> Create Campaign
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
};
