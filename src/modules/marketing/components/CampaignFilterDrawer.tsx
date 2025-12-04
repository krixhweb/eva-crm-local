
import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from '../../../components/ui/Drawer';
import { Button } from '../../../components/ui/Button';
import { Label } from '../../../components/ui/Label';
import { Input } from '../../../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';
import { DatePicker } from '../../../components/ui/DatePicker';
import { mockTeamMembers } from '../../../data/mockData';
import MultiSelect from '../../../components/ui/MultiSelect';
import { Icon } from '../../../components/shared/Icon';

export interface CampaignFiltersState {
  status: string[];
  type: string[];
  owners: string[]; 
  dateFrom: string | null;
  dateTo: string | null;
  minRoi: string;
  minRevenue: string;
  minSpend: string;
}

interface CampaignFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  currentFilters: CampaignFiltersState;
  onApply: (filters: CampaignFiltersState) => void;
  onReset: () => void;
}

const CAMPAIGN_TYPES = [
  "Advertisement",
  "Social Media",
  "Email Campaign",
  "Webinar",
  "Conference / Event",
  "Public Relations (PR)",
  "Referral Program",
  "SMS / WhatsApp Campaign"
];

const CAMPAIGN_STATUSES = [
  "Planned",
  "Active",
  "Completed",
  "Paused",
  "Cancelled",
  "On Hold"
];

export const CampaignFilterDrawer: React.FC<CampaignFilterDrawerProps> = ({ 
  open, 
  onClose, 
  currentFilters, 
  onApply, 
  onReset 
}) => {
  const [localFilters, setLocalFilters] = useState<CampaignFiltersState>(currentFilters);

  useEffect(() => {
    if (open) {
      setLocalFilters(currentFilters);
    }
  }, [open, currentFilters]);

  const handleOwnerChange = (value: string) => {
    setLocalFilters(prev => ({
        ...prev,
        owners: value === 'all' ? [] : [value]
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleLocalReset = () => {
    onReset();
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="w-full md:w-[420px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl" resizable={false} showCloseButton={true}>
        <DrawerHeader className="border-b border-gray-100 dark:border-zinc-800 px-6 py-5 bg-white dark:bg-zinc-900 z-10">
          <DrawerTitle className="text-xl font-bold">Filter Campaigns</DrawerTitle>
          <DrawerDescription>Narrow down your view with detailed criteria.</DrawerDescription>
        </DrawerHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 bg-gray-50/50 dark:bg-zinc-950/50">
            
            {/* Owner */}
            <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Campaign Owner</Label>
                <Select 
                    value={localFilters.owners[0] || "all"} 
                    onValueChange={handleOwnerChange}
                >
                    <SelectTrigger className="h-11 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700">
                        <SelectValue placeholder="Select Owner" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Owners</SelectItem>
                        {mockTeamMembers.map(m => (
                            <SelectItem key={m.id} value={m.name}>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                                        {m.avatar}
                                    </div>
                                    {m.name}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Date Range</Label>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <span className="text-xs text-gray-500 font-medium">Start Date</span>
                        <DatePicker 
                            value={localFilters.dateFrom ? new Date(localFilters.dateFrom) : null}
                            onChange={(d) => setLocalFilters(prev => ({ ...prev, dateFrom: d ? d.toISOString() : null }))}
                            className="h-11 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
                            placeholder="From"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <span className="text-xs text-gray-500 font-medium">End Date</span>
                        <DatePicker 
                            value={localFilters.dateTo ? new Date(localFilters.dateTo) : null}
                            onChange={(d) => setLocalFilters(prev => ({ ...prev, dateTo: d ? d.toISOString() : null }))}
                            className="h-11 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
                            placeholder="To"
                        />
                    </div>
                </div>
            </div>

            {/* Campaign Status */}
            <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Campaign Status</Label>
                <MultiSelect
                    options={CAMPAIGN_STATUSES}
                    value={localFilters.status}
                    onChange={(val) => setLocalFilters(prev => ({ ...prev, status: val }))}
                    placeholder="Select Statuses"
                    className="h-11 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
                />
            </div>

            {/* Campaign Type */}
            <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Campaign Type</Label>
                <MultiSelect
                    options={CAMPAIGN_TYPES}
                    value={localFilters.type}
                    onChange={(val) => setLocalFilters(prev => ({ ...prev, type: val }))}
                    placeholder="Select Types"
                    className="h-11 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
                />
            </div>

            {/* Performance Metrics */}
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                    <Icon name="analytics" className="w-4 h-4 text-blue-500" />
                    <Label className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">Performance Metrics</Label>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-gray-500 font-medium">Minimum ROI (%)</Label>
                        <div className="relative">
                            <Input 
                                type="number" 
                                placeholder="e.g. 150" 
                                value={localFilters.minRoi}
                                onChange={e => setLocalFilters(prev => ({ ...prev, minRoi: e.target.value }))}
                                className="pl-9 h-11 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 bg-green-100 dark:bg-green-900/30 rounded text-green-600 dark:text-green-400">
                                <Icon name="trendingUp" className="w-3 h-3" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs text-gray-500 font-medium">Min Revenue</Label>
                            <div className="relative">
                                <Input 
                                    type="number" 
                                    placeholder="0" 
                                    value={localFilters.minRevenue}
                                    onChange={e => setLocalFilters(prev => ({ ...prev, minRevenue: e.target.value }))}
                                    className="pl-8 h-11 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-gray-500 font-medium">Min Spend</Label>
                            <div className="relative">
                                <Input 
                                    type="number" 
                                    placeholder="0" 
                                    value={localFilters.minSpend}
                                    onChange={e => setLocalFilters(prev => ({ ...prev, minSpend: e.target.value }))}
                                    className="pl-8 h-11 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <DrawerFooter className="border-t border-gray-100 dark:border-zinc-800 px-6 py-5 bg-white dark:bg-zinc-900 z-20">
            <div className="grid grid-cols-2 gap-4 w-full">
                <Button variant="outline" className="h-12 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300" onClick={handleLocalReset}>Reset All</Button>
                <Button className="h-12 bg-green-600 hover:bg-green-700 text-white shadow-md font-semibold" onClick={handleApply}>Apply Filters</Button>
            </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
