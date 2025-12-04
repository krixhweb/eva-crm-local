
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocialService } from '../api/mockService';
import { SocialPost, PLATFORM_CONFIG, Platform } from '../types';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Icon } from '../../../../components/shared/Icon';
import { Checkbox } from '../../../../components/ui/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/Table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../../components/ui/DropdownMenu';
import { Badge } from '../../../../components/ui/Badge';
import { cn } from '../../../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_TABS = ['all', 'draft', 'scheduled', 'published', 'failed', 'trash'];

export const SocialPostsList: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
        const data = await SocialService.getPosts();
        setPosts(data);
    } finally {
        setLoading(false);
    }
  };

  const filteredPosts = useMemo(() => {
      return posts.filter(p => {
          const matchSearch = p.content.toLowerCase().includes(search.toLowerCase()) || (p.author?.name || '').toLowerCase().includes(search.toLowerCase());
          const matchStatus = statusFilter === 'all' || p.status === statusFilter;
          const matchPlatform = platformFilter === 'all' || p.platforms.includes(platformFilter as any);
          return matchSearch && matchStatus && matchPlatform;
      });
  }, [posts, search, statusFilter, platformFilter]);

  const paginatedPosts = useMemo(() => {
      const start = (page - 1) * pageSize;
      return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, page, pageSize]);

  const totalPages = Math.ceil(filteredPosts.length / pageSize);

  const handleSelectAll = (checked: boolean) => {
      setSelectedIds(checked ? filteredPosts.map(p => p.id) : []);
  };

  const handleSelectRow = (id: string) => {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  const handleDelete = (ids: string[]) => {
      if (confirm(`Delete ${ids.length} posts?`)) {
          setPosts(prev => prev.filter(p => !ids.includes(p.id)));
          setSelectedIds([]);
      }
  };

  // --- Visual Helpers ---

  const getStatusStyles = (status: string) => {
      switch (status) {
          case 'published': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
          case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
          case 'failed': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
          case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-gray-400 dark:border-zinc-700';
          default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
  };

  const formatStatusDate = (post: SocialPost) => {
      const dateStr = post.publishedAt || post.scheduledAt || post.createdAt;
      if (!dateStr) return '';
      const date = new Date(dateStr);
      
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      
      const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (isToday) return `Today, ${time}`;
      return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, ${time}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* 1. Toolbar & Filters */}
        <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                    <div className="relative w-full sm:max-w-xs">
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                            placeholder="Search posts..." 
                            className="pl-9 h-10 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 transition-all" 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={platformFilter} onValueChange={setPlatformFilter}>
                        <SelectTrigger className="w-[160px] h-10 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-sm">
                            <SelectValue placeholder="All Platforms" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Platforms</SelectItem>
                            {Object.keys(PLATFORM_CONFIG).map(key => (
                                <SelectItem key={key} value={key}>
                                    <div className="flex items-center gap-2">
                                        <Icon name={PLATFORM_CONFIG[key as Platform].icon as any} className="w-3.5 h-3.5" />
                                        {PLATFORM_CONFIG[key as Platform].name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <Button 
                    className="h-10 gap-2 bg-green-600 hover:bg-green-700 text-white shadow-sm font-medium px-5"
                    onClick={() => navigate('/marketing/channel/social/compose')}
                >
                    <Icon name="edit" className="h-4 w-4" /> Compose Post
                </Button>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-6 border-b border-gray-200 dark:border-zinc-800 px-1 overflow-x-auto">
                {STATUS_TABS.map(s => (
                    <button
                        key={s}
                        onClick={() => { setStatusFilter(s); setPage(1); }}
                        className={cn(
                            "pb-3 text-sm font-medium capitalize transition-all relative whitespace-nowrap",
                            statusFilter === s 
                                ? "text-green-600 dark:text-green-400" 
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        )}
                    >
                        {s}
                        {statusFilter === s && (
                            <motion.div 
                                layoutId="activeTabIndicator"
                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-green-600 dark:bg-green-400 rounded-t-full"
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>

        {/* 2. Bulk Actions Bar */}
        <AnimatePresence>
            {selectedIds.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-2 px-4"
                >
                    <div className="flex items-center gap-3">
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">
                            {selectedIds.length} Selected
                        </span>
                        <span className="text-sm text-blue-900 dark:text-blue-100 font-medium">
                            Actions:
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/40">
                            <Icon name="checkCircle" className="w-3.5 h-3.5 mr-1.5" /> Publish
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/40">
                            <Icon name="edit2" className="w-3.5 h-3.5 mr-1.5" /> Re-Schedule
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40" onClick={() => handleDelete(selectedIds)}>
                            <Icon name="trash" className="w-3.5 h-3.5 mr-1.5" /> Delete
                        </Button>
                        <div className="w-px h-4 bg-blue-200 dark:bg-blue-800 mx-1 self-center" />
                        <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])} className="h-8 text-gray-500 hover:text-gray-700">
                            Cancel
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* 3. Main Table */}
        <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50/80 dark:bg-zinc-900/80 backdrop-blur sticky top-0 z-10">
                        <TableRow className="border-b border-gray-200 dark:border-zinc-800 hover:bg-transparent">
                            <TableHead className="w-[50px] pl-6">
                                <Checkbox 
                                    checked={selectedIds.length === paginatedPosts.length && paginatedPosts.length > 0} 
                                    onCheckedChange={handleSelectAll} 
                                />
                            </TableHead>
                            <TableHead className="w-[140px]">Status</TableHead>
                            <TableHead className="min-w-[300px]">Content</TableHead>
                            <TableHead className="w-[100px] text-center">Media</TableHead>
                            <TableHead className="w-[150px]">Labels</TableHead>
                            <TableHead className="w-[140px]">Accounts</TableHead>
                            <TableHead className="w-[180px]">Author</TableHead>
                            <TableHead className="w-[80px] text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={8} className="h-20 px-6">
                                        <div className="h-4 w-full bg-gray-100 dark:bg-zinc-800 rounded animate-pulse mb-2"></div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : paginatedPosts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-96 text-center">
                                    <div className="flex flex-col items-center justify-center gap-4 max-w-md mx-auto">
                                        <div className="p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-full">
                                            <Icon name="fileText" className="w-10 h-10 text-gray-300" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">No posts found</h3>
                                            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                                                No posts match your current filters. Try changing criteria or create a new post.
                                            </p>
                                        </div>
                                        <Button onClick={() => navigate('/marketing/channel/social/compose')} className="bg-green-600 hover:bg-green-700 text-white mt-2">
                                            Compose Post
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedPosts.map(post => (
                                <React.Fragment key={post.id}>
                                    {/* Desktop Row */}
                                    <TableRow className="group hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors border-b border-gray-100 dark:border-zinc-800/50 h-[76px] hidden md:table-row">
                                        <TableCell className="pl-6 align-middle">
                                            <Checkbox 
                                                checked={selectedIds.includes(post.id)} 
                                                onCheckedChange={() => handleSelectRow(post.id)} 
                                            />
                                        </TableCell>
                                        <TableCell className="align-middle">
                                            <div className="flex flex-col gap-1">
                                                <span className={cn("inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide w-fit border", getStatusStyles(post.status))}>
                                                    {post.status}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {formatStatusDate(post)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-middle">
                                            <div className="max-w-[350px] pr-4">
                                                <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 font-medium leading-snug cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate('/marketing/channel/social/compose')}>
                                                    {post.content || <span className="italic text-gray-400">No text content</span>}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-middle text-center">
                                            {post.attachments.length > 0 ? (
                                                <div className="relative w-10 h-10 inline-block group cursor-pointer">
                                                    <img 
                                                        src={post.attachments[0].url} 
                                                        alt="Media" 
                                                        className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm" 
                                                    />
                                                    {post.attachments.length > 1 && (
                                                        <div className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md ring-2 ring-white dark:ring-zinc-900">
                                                            +{post.attachments.length - 1}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center mx-auto">
                                                    <Icon name="image" className="w-4 h-4 text-gray-300" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="align-middle">
                                            <div className="flex flex-wrap gap-1.5">
                                                {post.labels?.slice(0, 2).map(label => (
                                                    <Badge key={label} variant="secondary" className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 border-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:border-zinc-700 font-normal">
                                                        {label}
                                                    </Badge>
                                                ))}
                                                {post.labels && post.labels.length > 2 && (
                                                     <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 bg-gray-50 text-gray-500 border-gray-200">+{post.labels.length - 2}</Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-middle">
                                            <div className="flex items-center pl-2">
                                                {post.platforms.slice(0, 3).map((p, i) => (
                                                    <div 
                                                        key={p} 
                                                        className={cn(
                                                            "w-7 h-7 rounded-full flex items-center justify-center text-white shadow-sm border-2 border-white dark:border-zinc-900 -ml-2 transition-transform hover:scale-110 hover:z-10 relative",
                                                            PLATFORM_CONFIG[p].bg
                                                        )}
                                                        style={{ zIndex: 10 - i }}
                                                        title={PLATFORM_CONFIG[p].name}
                                                    >
                                                        <Icon name={PLATFORM_CONFIG[p].icon as any} className="w-3.5 h-3.5" />
                                                    </div>
                                                ))}
                                                {post.platforms.length > 3 && (
                                                    <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 text-[9px] font-bold flex items-center justify-center border-2 border-white dark:border-zinc-900 -ml-2 z-0">
                                                        +{post.platforms.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 text-purple-600 dark:text-purple-300 flex items-center justify-center text-xs font-bold border border-purple-100 dark:border-purple-900/50">
                                                    {post.author.avatar}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{post.author.name}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6 align-middle">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => navigate('/marketing/channel/social/compose')} title="Edit">
                                                    <Icon name="edit" className="w-4 h-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                                                            <Icon name="moreVertical" className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem onClick={() => navigate('/marketing/channel/social/compose')}>
                                                            <Icon name="edit" className="w-4 h-4 mr-2 text-gray-400" /> Edit Post
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Icon name="copy" className="w-4 h-4 mr-2 text-gray-400" /> Duplicate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Icon name="analytics" className="w-4 h-4 mr-2 text-gray-400" /> View Analytics
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20" onClick={() => handleDelete([post.id])}>
                                                            <Icon name="trash" className="w-4 h-4 mr-2" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    {/* Mobile Card View */}
                                    <div className="md:hidden border-b border-gray-100 dark:border-zinc-800 p-4 flex flex-col gap-3 bg-white dark:bg-zinc-900" onClick={() => navigate('/marketing/channel/social/compose')}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col gap-1.5">
                                                <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide w-fit border", getStatusStyles(post.status), "border-transparent")}>
                                                    {post.status}
                                                </span>
                                                <span className="text-[11px] text-gray-400">
                                                    {formatStatusDate(post)}
                                                </span>
                                            </div>
                                            <Checkbox 
                                                checked={selectedIds.includes(post.id)} 
                                                onCheckedChange={() => handleSelectRow(post.id)} 
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                        
                                        <div className="flex gap-4 mt-1">
                                            {post.attachments.length > 0 && (
                                                <img 
                                                    src={post.attachments[0].url} 
                                                    className="w-20 h-20 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200 dark:border-zinc-700"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-3 leading-relaxed font-medium">
                                                    {post.content || <span className="italic text-gray-400">No content</span>}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-zinc-800/50">
                                             <div className="flex items-center">
                                                {post.platforms.map((p, i) => (
                                                    <div 
                                                        key={p} 
                                                        className={cn(
                                                            "w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm border-2 border-white dark:border-zinc-900 -ml-1.5 first:ml-0",
                                                            PLATFORM_CONFIG[p].bg
                                                        )}
                                                        style={{ zIndex: 10 - i }}
                                                    >
                                                        <Icon name={PLATFORM_CONFIG[p].icon as any} className="w-3 h-3" />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                 {post.stats && (
                                                     <div className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                                                         <Icon name="heart" className="w-3.5 h-3.5" /> {post.stats.likes}
                                                     </div>
                                                 )}
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400" onClick={(e) => { e.stopPropagation(); navigate('/marketing/channel/social/compose'); }}>
                                                    <Icon name="edit" className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* 4. Footer Pagination */}
            <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>Rows per page:</span>
                    <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                        <SelectTrigger className="h-8 w-16 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="hidden sm:inline">
                        Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filteredPosts.length)} of {filteredPosts.length}
                    </span>
                </div>
                
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setPage(p => Math.max(1, p - 1))} 
                        disabled={page === 1}
                        className="h-8 w-8 p-0"
                    >
                        <Icon name="chevronLeft" className="w-4 h-4" />
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                        disabled={page === totalPages}
                        className="h-8 w-8 p-0"
                    >
                        <Icon name="chevronRight" className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
};
