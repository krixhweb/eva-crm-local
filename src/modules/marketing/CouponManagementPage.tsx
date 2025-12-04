
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Progress } from "../../components/ui/Progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { Icon } from "../../components/shared/Icon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/DropdownMenu";
import { formatCurrency } from "../../lib/utils";
import { mockCoupons } from "../../data/mockData";
import { CreateCouponDrawer } from "./components/coupon/CreateCouponDrawer";
import { CouponFilterDrawer, CouponFiltersState } from "./components/coupon/CouponFilterDrawer";

const DEFAULT_FILTERS: CouponFiltersState = {
    status: [], type: [], createdBy: '', dateFrom: null, dateTo: null, minUsage: ''
};

const CouponManagementPage = () => {
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<CouponFiltersState>(DEFAULT_FILTERS);

  const activeFilterCount = filters.status.length + filters.type.length + (filters.createdBy ? 1 : 0) + (filters.dateFrom ? 1 : 0) + (filters.dateTo ? 1 : 0) + (filters.minUsage ? 1 : 0);

  const filteredCoupons = useMemo(() => {
      return mockCoupons.filter(c => {
          const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
          const matchesStatus = filters.status.length === 0 || filters.status.includes(c.status);
          const matchesType = filters.type.length === 0 || filters.type.includes(c.discountType);
          const matchesMinUsage = !filters.minUsage || c.usageCount >= Number(filters.minUsage);
          
          let matchesDate = true;
          if (filters.dateFrom) matchesDate = matchesDate && new Date(c.validFrom) >= new Date(filters.dateFrom);
          if (filters.dateTo) matchesDate = matchesDate && new Date(c.validUntil) <= new Date(filters.dateTo);

          return matchesSearch && matchesStatus && matchesType && matchesMinUsage && matchesDate;
      });
  }, [search, filters]);

  const stats = [
    { label: "Active Coupons", value: mockCoupons.filter(c => c.status === 'Active').length.toString(), icon: 'tag' as const, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20" },
    { label: "Total Redemptions", value: mockCoupons.reduce((acc, c) => acc + c.usageCount, 0).toLocaleString(), icon: 'users' as const, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20" },
    { label: "Revenue Generated", value: formatCurrency(mockCoupons.reduce((acc, c) => acc + c.revenueGenerated, 0)), icon: 'dollarSign' as const, color: "text-green-600 bg-green-100 dark:bg-green-900/20" },
    { label: "Expired Coupons", value: mockCoupons.filter(c => c.status === 'Expired').length.toString(), icon: 'clock' as const, color: "text-red-600 bg-red-100 dark:bg-red-900/20" }
  ];

  const getStatusBadge = (status: string) => {
      switch (status) {
          case 'Active': return 'green';
          case 'Expired': return 'gray';
          case 'Scheduled': return 'blue';
          default: return 'default';
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Coupon Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage discount codes, validity, usage, and redemptions.</p>
        </div>
        <div className="flex gap-2">
             <Button variant="outline" size="sm"><Icon name="download" className="w-4 h-4 mr-2"/> Export</Button>
             <Button variant="outline" size="sm"><Icon name="arrowUp" className="w-4 h-4 mr-2"/> Import</Button>
             <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm" onClick={() => setIsCreateOpen(true)}>
                <Icon name="plus" className="h-4 w-4 mr-2" /> Create Coupon
            </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
               <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                        <Icon name={stat.icon} className="w-6 h-6" />
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

      {/* Filter Bar & Table */}
      <Card>
         <CardHeader className="border-b border-gray-100 dark:border-zinc-800 pb-4">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="relative w-full md:w-72">
                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search coupons..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                 </div>
                 <div className="flex gap-3 w-full md:w-auto justify-end">
                    <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="relative">
                        <Icon name="list" className="h-4 w-4 mr-2" /> Filters
                        {activeFilterCount > 0 && <span className="ml-2 bg-green-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">{activeFilterCount}</span>}
                    </Button>
                 </div>
             </div>
         </CardHeader>
         <CardContent className="p-0">
            <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-zinc-800/50">
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Validity</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Redemptions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCoupons.map((coupon) => (
                      <TableRow key={coupon.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/30 cursor-pointer" onClick={() => navigate(`/marketing/coupons/${coupon.id}`)}>
                        <TableCell>
                             <span className="font-mono font-bold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">{coupon.code}</span>
                        </TableCell>
                        <TableCell>
                            <span className="text-sm font-medium">{coupon.name}</span>
                        </TableCell>
                        <TableCell><Badge variant="outline">{coupon.discountType}</Badge></TableCell>
                        <TableCell className="font-semibold text-blue-600 dark:text-blue-400">
                            {coupon.discountType === 'Flat Amount' ? '₹' : ''}{coupon.value}{coupon.discountType === 'Percentage' ? '%' : ''}
                        </TableCell>
                         <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                             <div className="flex flex-col text-xs">
                                <span>{new Date(coupon.validFrom).toLocaleDateString()}</span>
                                <span className="text-gray-400">↓</span>
                                <span>{new Date(coupon.validUntil).toLocaleDateString()}</span>
                             </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-24">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500">{coupon.usageCount} / {coupon.usageLimit > 10000 ? '∞' : coupon.usageLimit}</span>
                            </div>
                            <Progress value={coupon.usageLimit > 10000 ? 100 : (coupon.usageCount / coupon.usageLimit) * 100} className="h-1.5" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-center">{coupon.usageCount}</TableCell>
                        <TableCell><Badge variant={getStatusBadge(coupon.status) as any}>{coupon.status}</Badge></TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><Icon name="moreVertical" className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => navigate(`/marketing/coupons/${coupon.id}`)}><Icon name="eye" className="w-4 h-4 mr-2"/> View</DropdownMenuItem>
                                    <DropdownMenuItem><Icon name="edit" className="w-4 h-4 mr-2"/> Edit</DropdownMenuItem>
                                    <DropdownMenuItem><Icon name="copy" className="w-4 h-4 mr-2"/> Duplicate</DropdownMenuItem>
                                    <DropdownMenuItem><Icon name="pause" className="w-4 h-4 mr-2"/> Disable</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600"><Icon name="trash" className="w-4 h-4 mr-2"/> Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </div>
         </CardContent>
      </Card>

      <CreateCouponDrawer open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <CouponFilterDrawer 
        open={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        currentFilters={filters} 
        onApply={setFilters} 
        onReset={() => setFilters(DEFAULT_FILTERS)} 
      />
    </div>
  );
};

export default CouponManagementPage;
