
import React, { useState, useMemo } from 'react';
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select";
import { Icon } from "../../../components/shared/Icon";
import { CampaignTableView } from './CampaignTableView';
import { CampaignCardView } from './CampaignCardView';
import { CampaignFilterDrawer, CampaignFiltersState } from './CampaignFilterDrawer';
import { mockCampaigns } from '../../../data/mockData';
import type { Campaign } from '../../../types';

interface CampaignManagerProps {
  onCreate: () => void;
}

const DEFAULT_FILTERS: CampaignFiltersState = {
    status: [],
    type: [],
    owners: [],
    dateFrom: null,
    dateTo: null,
    minRoi: '',
    minRevenue: '',
    minSpend: ''
};

export const CampaignManager: React.FC<CampaignManagerProps> = ({ onCreate }) => {
  // --- View State ---
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  
  // --- Filter State ---
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<CampaignFiltersState>(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // --- Sorting & Pagination State ---
  const [sortConfig, setSortConfig] = useState<{ key: keyof Campaign | string; direction: 'asc' | 'desc' }>({ key: 'startDate', direction: 'desc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // --- Handlers ---

  const handleSort = (key: string) => {
      setSortConfig(current => ({
          key,
          direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
      }));
  };

  const handleSelectAll = (checked: boolean) => {
      if (checked) {
          setSelectedIds(paginatedCampaigns.map(c => c.id));
      } else {
          setSelectedIds([]);
      }
  };

  const handleSelectRow = (id: string) => {
      setSelectedIds(prev => 
          prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
  };

  const handleResetFilters = () => {
      setFilters(DEFAULT_FILTERS);
      setSearch('');
      setPage(1);
  };

  // --- Derived Data ---

  const activeFilterCount = 
    filters.status.length + 
    filters.type.length + 
    filters.owners.length + 
    (filters.dateFrom ? 1 : 0) + 
    (filters.dateTo ? 1 : 0) +
    (filters.minRoi ? 1 : 0) +
    (filters.minRevenue ? 1 : 0) + 
    (filters.minSpend ? 1 : 0);

  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter(c => {
      // Text Search
      const matchesSearch = 
        !search || 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.owner.name.toLowerCase().includes(search.toLowerCase());

      // Status Filter
      const matchesStatus = filters.status.length === 0 || filters.status.includes(c.status);

      // Type Filter
      const matchesType = filters.type.length === 0 || filters.type.includes(c.type);

      // Owner Filter (Match by Name)
      const matchesOwner = filters.owners.length === 0 || filters.owners.includes(c.owner.name);

      // Date Range
      let matchesDate = true;
      if (filters.dateFrom) matchesDate = matchesDate && new Date(c.startDate) >= new Date(filters.dateFrom);
      if (filters.dateTo) matchesDate = matchesDate && new Date(c.startDate) <= new Date(filters.dateTo);

      // Metrics
      let matchesMetrics = true;
      if (filters.minRoi) matchesMetrics = matchesMetrics && c.metrics.roi >= Number(filters.minRoi);
      if (filters.minRevenue) matchesMetrics = matchesMetrics && c.metrics.revenue >= Number(filters.minRevenue);
      if (filters.minSpend) matchesMetrics = matchesMetrics && c.metrics.spend >= Number(filters.minSpend);

      return matchesSearch && matchesStatus && matchesType && matchesOwner && matchesDate && matchesMetrics;
    });
  }, [search, filters]);

  const sortedCampaigns = useMemo(() => {
      return [...filteredCampaigns].sort((a, b) => {
          const aValue = getSortValue(a, sortConfig.key);
          const bValue = getSortValue(b, sortConfig.key);
          
          if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
      });
  }, [filteredCampaigns, sortConfig]);

  const paginatedCampaigns = useMemo(() => {
      const start = (page - 1) * pageSize;
      return sortedCampaigns.slice(start, start + pageSize);
  }, [sortedCampaigns, page, pageSize]);

  // Helper to extract sort value
  function getSortValue(campaign: Campaign, key: string): any {
      switch (key) {
          case 'name': return campaign.name.toLowerCase();
          case 'status': return campaign.status;
          case 'type': return campaign.type;
          case 'owner': return campaign.owner.name;
          case 'budget': return campaign.metrics.spend * 1.2; // Mock budget
          case 'spend': return campaign.metrics.spend;
          case 'revenue': return campaign.metrics.revenue;
          case 'roi': return campaign.metrics.roi;
          case 'startDate': return new Date(campaign.startDate).getTime();
          default: return '';
      }
  }

  // --- Render ---

  return (
    <div className="space-y-6">
      
      {/* Toolbar */}
      <Card className="border border-gray-200 dark:border-zinc-800 shadow-sm overflow-visible z-10">
        <div className="p-4 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
          
          {/* Left: Search & Filter Trigger */}
          <div className="flex flex-wrap gap-3 w-full xl:w-auto items-center">
            <div className="relative w-full sm:w-72">
              <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search campaigns..." 
                className="pl-10 h-11 text-sm bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 transition-colors" 
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            
            <Button 
                variant="outline" 
                size="default" 
                onClick={() => setIsFilterOpen(true)} 
                className={`h-11 px-4 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg relative ${activeFilterCount > 0 ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : 'bg-white dark:bg-zinc-900'}`}
            >
                <Icon name="list" className="w-4 h-4 mr-2" /> 
                Filters
                {activeFilterCount > 0 && (
                    <span className="ml-2 bg-blue-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                        {activeFilterCount}
                    </span>
                )}
            </Button>

            {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-gray-500 hover:text-red-600 h-11 px-3">
                    Reset
                </Button>
            )}
          </div>
          
          {/* Right: View Toggle & Actions */}
          <div className="flex gap-3 w-full xl:w-auto justify-between xl:justify-end items-center">
            {/* Segmented Control for View Toggle */}
            <div className="flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 h-11 items-center">
                <button 
                    onClick={() => setViewMode('table')} 
                    className={`h-full px-3 rounded-md transition-all flex items-center gap-2 text-sm font-medium ${viewMode === 'table' ? 'bg-white dark:bg-zinc-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                    title="List View"
                >
                    <Icon name="list" className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-gray-300 dark:bg-zinc-600 mx-1"></div>
                <button 
                    onClick={() => setViewMode('grid')} 
                    className={`h-full px-3 rounded-md transition-all flex items-center gap-2 text-sm font-medium ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                    title="Grid View"
                >
                    <Icon name="grid" className="w-4 h-4" />
                </button>
            </div>
            
            <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm h-11 px-6 rounded-lg font-medium" onClick={onCreate}>
                <Icon name="plus" className="w-4 h-4 mr-2" /> New Campaign
            </Button>
          </div>
        </div>
      </Card>

      {/* Bulk Actions Bar (Conditional) */}
      {selectedIds.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">{selectedIds.length}</span>
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Campaigns Selected</span>
              </div>
              <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-9 bg-white dark:bg-zinc-900 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                      Export
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 bg-white dark:bg-zinc-900 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                      Change Status
                  </Button>
                  <Button variant="ghost" size="sm" className="h-9 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30">
                      Delete
                  </Button>
              </div>
          </div>
      )}

      {/* Views */}
      {viewMode === 'table' ? (
          <CampaignTableView 
            campaigns={paginatedCampaigns} 
            sortConfig={sortConfig}
            onSort={handleSort}
            selectedIds={selectedIds}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
            totalCount={filteredCampaigns.length}
          />
      ) : (
          <CampaignCardView campaigns={paginatedCampaigns} />
      )}

      {/* Pagination */}
      {filteredCampaigns.length > 0 ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing <span className="font-medium text-gray-900 dark:text-gray-100">{((page - 1) * pageSize) + 1}</span> to <span className="font-medium text-gray-900 dark:text-gray-100">{Math.min(page * pageSize, filteredCampaigns.length)}</span> of <span className="font-medium text-gray-900 dark:text-gray-100">{filteredCampaigns.length}</span> results
              </div>
              
              <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Rows per page:</span>
                      <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                          <SelectTrigger className="h-9 w-16 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  
                  <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 w-9 p-0" 
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                      >
                          <Icon name="chevronLeft" className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 w-9 p-0" 
                        disabled={page * pageSize >= filteredCampaigns.length}
                        onClick={() => setPage(p => p + 1)}
                      >
                          <Icon name="chevronRight" className="w-4 h-4" />
                      </Button>
                  </div>
              </div>
          </div>
      ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700">
              <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Icon name="search" className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No campaigns found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mt-2 mb-6">
                  Your search filters didn't match any existing campaigns. Try adjusting or clearing them.
              </p>
              <Button onClick={handleResetFilters} variant="outline">Clear All Filters</Button>
          </div>
      )}

      {/* Filter Drawer */}
      <CampaignFilterDrawer 
        open={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        currentFilters={filters}
        onApply={(newFilters) => { setFilters(newFilters); setPage(1); }} 
        onReset={handleResetFilters}
      />

    </div>
  );
};
