
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Icon } from '../../../../components/shared/Icon';
import { Input } from '../../../../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/Select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../../components/ui/DropdownMenu';
import { Badge } from '../../../../components/ui/Badge';
import { TemplateStore } from '../../../../data/emailMockData';
import type { EmailTemplate } from '../../../../types';
import { useGlassyToasts } from '../../../../components/ui/GlassyToastProvider';
import ConfirmationDialog from '../../../../components/modals/ConfirmationDialog';
import { SendTestEmailModal } from '../../../../components/modals/SendTestEmailModal';

const CATEGORIES = ["All", "Newsletter", "Promotional", "Automated", "Product", "Survey", "Basic"];

export const EmailTemplatesTab = () => {
    const navigate = useNavigate();
    const { push } = useGlassyToasts();
    
    // --- State ---
    const [templates, setTemplates] = useState<EmailTemplate[]>(TemplateStore.getAll());
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortBy, setSortBy] = useState('updated'); // updated, name, usage
    const [deleteTarget, setDeleteTarget] = useState<EmailTemplate | null>(null);
    const [testEmailTarget, setTestEmailTarget] = useState<EmailTemplate | null>(null);

    // Refresh data on mount
    useEffect(() => {
        setTemplates(TemplateStore.getAll());
    }, []);

    // --- Filtering & Sorting ---
    const filteredTemplates = useMemo(() => {
        return templates.filter(t => {
            const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
            return matchesSearch && matchesCategory;
        }).sort((a, b) => {
            if (sortBy === 'updated') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'usage') return b.usageCount - a.usageCount;
            return 0;
        });
    }, [templates, search, categoryFilter, sortBy]);

    // --- Handlers ---
    const handleCreate = () => navigate('/marketing/channel/email/templates/new');
    
    const handleEdit = (template: EmailTemplate) => {
        navigate(`/marketing/channel/email/templates/${template.id}/edit`);
    };

    const handlePreview = (template: EmailTemplate) => {
        navigate(`/marketing/channel/email/templates/${template.id}`);
    };

    const handleUseTemplate = (template: EmailTemplate) => {
        push({ title: "Template Selected", description: `Starting new campaign with ${template.name}`, variant: "success" });
        navigate('/marketing/channel/email/create');
    };

    const handleDuplicate = (template: EmailTemplate) => {
        const newTemplate: EmailTemplate = {
            ...template,
            id: `TMP-${Date.now()}`,
            name: `Copy of ${template.name}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            usageCount: 0,
            campaignReferences: [],
            analytics: { avgOpenRate: 0, avgClickRate: 0 }
        };
        TemplateStore.add(newTemplate);
        setTemplates(TemplateStore.getAll());
        push({ title: "Duplicated", description: "Template copied successfully.", variant: "info" });
    };

    const handleDeleteRequest = (template: EmailTemplate) => {
        if (template.usageCount > 0) {
            push({ title: "Cannot Delete", description: `Used in ${template.usageCount} campaigns. Archive instead.`, variant: "error" });
            return;
        }
        setDeleteTarget(template);
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            TemplateStore.delete(deleteTarget.id);
            setTemplates(TemplateStore.getAll());
            push({ title: "Deleted", description: "Template removed.", variant: "success" });
            setDeleteTarget(null);
        }
    };

    const handleExport = (template: EmailTemplate) => {
        const blob = new Blob([template.contentHtml], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${template.name.replace(/\s+/g, '_')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        push({ title: "Exported", description: "HTML file downloaded.", variant: "success" });
    };

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'Newsletter': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300';
            case 'Promotional': return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300';
            case 'Automated': return 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300';
            case 'Basic': return 'bg-gray-50 text-gray-600 dark:bg-zinc-800 dark:text-gray-300';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            
            {/* Toolbar */}
            <Card className="border border-gray-200 dark:border-zinc-800 shadow-sm">
                <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3 w-full md:w-auto flex-1">
                         <div className="relative w-full max-w-sm">
                            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                                placeholder="Search templates..." 
                                className="pl-9" 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)} 
                            />
                         </div>
                         <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                         </Select>
                         <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort By" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="updated">Recently Updated</SelectItem>
                                <SelectItem value="name">Name (A-Z)</SelectItem>
                                <SelectItem value="usage">Most Used</SelectItem>
                            </SelectContent>
                         </Select>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm whitespace-nowrap" onClick={handleCreate}>
                        <Icon name="plus" className="w-4 h-4 mr-2" /> New Template
                    </Button>
                </div>
            </Card>

            {/* Grid */}
            {filteredTemplates.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-800">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <Icon name="image" className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No Templates Found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto mt-2">Try adjusting your filters or create a new email template to get started.</p>
                    <Button onClick={handleCreate} variant="outline">Create Template</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTemplates.map((template) => (
                        <Card 
                            key={template.id} 
                            className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-gray-200 dark:border-zinc-800 overflow-hidden flex flex-col"
                            onClick={() => handlePreview(template)}
                        >
                            {/* Thumbnail Area */}
                            <div className={`h-48 w-full relative bg-gray-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-b border-gray-100 dark:border-zinc-800`}>
                                {template.thumbnail === 'placeholder' || !template.thumbnail ? (
                                    <div className="text-center opacity-30">
                                        <Icon name="image" className="w-12 h-12 mx-auto mb-2" />
                                        <span className="text-xs font-medium uppercase tracking-widest">{template.category}</span>
                                    </div>
                                ) : (
                                    <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                )}
                                
                                {/* Hover Overlay Actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
                                    <Button size="sm" className="bg-white text-black hover:bg-gray-100 font-medium border-none" onClick={(e) => { e.stopPropagation(); handleUseTemplate(template); }}>
                                        Use
                                    </Button>
                                    <Button size="sm" variant="outline" className="border-white text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); handlePreview(template); }}>
                                        Preview
                                    </Button>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[180px]" title={template.name}>
                                        {template.name}
                                    </h4>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={(e) => e.stopPropagation()}>
                                                <Icon name="moreVertical" className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handlePreview(template); }}>Preview</DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(template); }}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleUseTemplate(template); }}>Use Template</DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setTestEmailTarget(template); }}>Send Test</DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleExport(template); }}>Export HTML</DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicate(template); }}>Duplicate</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={(e) => { e.stopPropagation(); handleDeleteRequest(template); }}>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                
                                <div className="mt-auto flex items-center justify-between">
                                     <Badge variant="secondary" className={`text-[10px] px-2 py-0.5 font-normal border-none ${getCategoryColor(template.category)}`}>
                                        {template.category}
                                     </Badge>
                                     <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <Icon name="trendingUp" className="w-3 h-3" /> {template.usageCount} uses
                                     </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <ConfirmationDialog 
                isOpen={!!deleteTarget} 
                onClose={() => setDeleteTarget(null)} 
                onConfirm={confirmDelete} 
                title="Delete Template" 
                description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`} 
            />

            {testEmailTarget && (
                <SendTestEmailModal 
                    isOpen={!!testEmailTarget} 
                    onClose={() => setTestEmailTarget(null)} 
                    templateName={testEmailTarget.name}
                />
            )}
        </div>
    );
};
