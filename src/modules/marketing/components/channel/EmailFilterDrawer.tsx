
import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from '../../../../components/ui/Drawer';
import { Button } from '../../../../components/ui/Button';
import { Label } from '../../../../components/ui/Label';
import { Input } from '../../../../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/Select';
import { DatePicker } from '../../../../components/ui/DatePicker';
import MultiSelect from '../../../../components/ui/MultiSelect';
import { mockEmailCampaigns } from '../../../../data/emailMockData';

export interface EmailFiltersState {
  status: string[];
  audience: string;
  dateFrom: string | null;
  dateTo: string | null;
  minOpenRate: string;
  tags: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  currentFilters: EmailFiltersState;
  onApply: (filters: EmailFiltersState) => void;
  onReset: () => void;
}

const STATUSES = ["Draft", "Scheduled", "Sent", "Active"];
const AUDIENCES = ["All Customers", "VIP", "New Signups", "Abandoned Carts", "Office Segment", "Newsletter Subs"];

export const EmailFilterDrawer: React.FC<Props> = ({ 
  open, 
  onClose, 
  currentFilters, 
  onApply, 
  onReset 
}) => {
  const [localFilters, setLocalFilters] = useState<EmailFiltersState>(currentFilters);

  // Extract unique tags from mock data for the multiselect
  const uniqueTags = Array.from(new Set(mockEmailCampaigns.flatMap(c => c.tags || []))).sort();

  useEffect(() => {
    if (open) setLocalFilters(currentFilters);
  }, [open, currentFilters]);

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="w-full md:w-[420px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl" resizable showCloseButton={true}>
        <DrawerHeader className="border-b border-gray-100 dark:border-zinc-800 px-6 py-5 bg-white dark:bg-zinc-900 z-10">
          <DrawerTitle>Filter Campaigns</DrawerTitle>
          <DrawerDescription>Refine your view by status, audience, dates, or tags.</DrawerDescription>
        </DrawerHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-gray-50/50 dark:bg-zinc-950/50">
            <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Status</Label>
                <MultiSelect 
                  options={STATUSES} 
                  value={localFilters.status} 
                  onChange={(v) => setLocalFilters({...localFilters, status: v})} 
                  placeholder="Select Status" 
                  className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
                />
            </div>

            <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Audience Segment</Label>
                <Select value={localFilters.audience} onValueChange={v => setLocalFilters({...localFilters, audience: v})}>
                    <SelectTrigger className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"><SelectValue placeholder="Any Segment" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Any Segment</SelectItem>
                        {AUDIENCES.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Tags</Label>
                <MultiSelect 
                  options={uniqueTags} 
                  value={localFilters.tags} 
                  onChange={(v) => setLocalFilters({...localFilters, tags: v})} 
                  placeholder="Select Tags" 
                  className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
                />
            </div>

            <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Creation Date Range</Label>
                <div className="grid grid-cols-2 gap-4">
                    <DatePicker 
                      value={localFilters.dateFrom ? new Date(localFilters.dateFrom) : null} 
                      onChange={d => setLocalFilters({...localFilters, dateFrom: d ? d.toISOString() : null})} 
                      placeholder="Start Date" 
                      className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
                    />
                    <DatePicker 
                      value={localFilters.dateTo ? new Date(localFilters.dateTo) : null} 
                      onChange={d => setLocalFilters({...localFilters, dateTo: d ? d.toISOString() : null})} 
                      placeholder="End Date" 
                      className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Min Open Rate (%)</Label>
                <Input 
                  type="number" 
                  value={localFilters.minOpenRate} 
                  onChange={e => setLocalFilters({...localFilters, minOpenRate: e.target.value})} 
                  placeholder="0" 
                  className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
                  min={0}
                  max={100}
                />
            </div>
        </div>

        <DrawerFooter className="border-t border-gray-100 dark:border-zinc-800 px-6 py-5 bg-white dark:bg-zinc-900 z-20">
            <div className="grid grid-cols-2 gap-4 w-full">
                <Button variant="outline" onClick={() => { onReset(); onClose(); }} className="h-12 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300">Reset</Button>
                <Button onClick={() => { onApply(localFilters); onClose(); }} className="h-12 bg-green-600 hover:bg-green-700 text-white shadow-md font-semibold">Apply Filters</Button>
            </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
