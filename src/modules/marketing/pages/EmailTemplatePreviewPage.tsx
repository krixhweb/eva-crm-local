
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Icon } from '../../../components/shared/Icon';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { TemplateStore } from '../../../data/emailMockData';
import type { EmailTemplate } from '../../../types';
import { useGlassyToasts } from '../../../components/ui/GlassyToastProvider';
import { cn, formatCurrency } from '../../../lib/utils';
import ConfirmationDialog from '../../../components/modals/ConfirmationDialog';
import { SendTestEmailModal } from '../../../components/modals/SendTestEmailModal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';

const EmailTemplatePreviewPage = () => {
    const { templateId } = useParams<{ templateId: string }>();
    const navigate = useNavigate();
    const { push } = useGlassyToasts();
    const [template, setTemplate] = useState<EmailTemplate | undefined>(undefined);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);

    useEffect(() => {
        if (templateId) {
            const t = TemplateStore.getById(templateId);
            setTemplate(t);
        }
    }, [templateId]);

    if (!template) return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
            <p className="text-gray-500 mb-4">Template not found.</p>
            <Button variant="outline" onClick={() => navigate('/marketing/channel/email')}>Back to Email Marketing</Button>
        </div>
    );

    const handleEdit = () => navigate(`/marketing/channel/email/templates/${template.id}/edit`);

    const handleDuplicate = () => {
        const newTemplate = {
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
        push({ title: "Duplicated", description: "Template copied successfully.", variant: "info" });
        navigate(`/marketing/channel/email/templates/${newTemplate.id}`);
    };

    const handleDelete = () => {
        if (template.usageCount > 0) {
            push({ title: "Cannot Delete", description: "Template is in use.", variant: "error" });
            return;
        }
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        TemplateStore.delete(template.id);
        push({ title: "Deleted", description: "Template removed.", variant: "success" });
        navigate('/marketing/channel/email');
    };

    const handleExportHtml = () => {
        const blob = new Blob([template.contentHtml], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${template.name.replace(/\s+/g, '_')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        push({ title: "Exported", description: "HTML downloaded.", variant: "success" });
    };

    const renderPreviewContent = (json: string) => {
        try {
            const blocks = JSON.parse(json);
            if (!Array.isArray(blocks) || blocks.length === 0) return <div className="text-center text-gray-400 py-20">Empty Template</div>;
            // Simplified render for preview
            return (
                <div className="bg-white min-h-[600px] shadow-lg rounded-lg overflow-hidden">
                    {blocks.map((block: any) => (
                        <div key={block.id} style={{ padding: '10px', textAlign: block.styles.align }}>
                            {block.type === 'header' && <h1 style={{ fontSize: block.styles.fontSize, fontWeight: block.styles.fontWeight, color: block.styles.color, margin: 0 }}>{block.content.text}</h1>}
                            {block.type === 'text' && <div style={{ fontSize: block.styles.fontSize, color: block.styles.color, margin: 0 }} dangerouslySetInnerHTML={{__html: block.content.text}}></div>}
                            {block.type === 'button' && (
                                <div style={{ padding: block.styles.padding }}>
                                    <button style={{ backgroundColor: block.styles.backgroundColor, color: block.styles.color, padding: '10px 20px', border: 'none', borderRadius: block.styles.borderRadius }}>{block.content.text}</button>
                                </div>
                            )}
                            {block.type === 'image' && (
                                <div style={{ padding: block.styles.padding }}>
                                    {block.content.src ? <img src={block.content.src} alt="preview" style={{ maxWidth: '100%' }} /> : <div className="bg-gray-200 h-32 w-full flex items-center justify-center text-gray-400">Image Placeholder</div>}
                                </div>
                            )}
                            {/* ... other types */}
                        </div>
                    ))}
                </div>
            );
        } catch (e) {
            return <div className="text-center text-red-400 py-20">Error rendering preview</div>;
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col animate-in fade-in">
            {/* Top Header */}
            <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/marketing/channel/email')} className="text-gray-500">
                        <Icon name="arrowLeft" className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <div className="h-6 w-px bg-gray-200 dark:bg-zinc-700"></div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white">{template.name}</h1>
                            <Badge variant="outline">{template.category}</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Last updated {new Date(template.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                     <Button variant="outline" onClick={() => setIsTestModalOpen(true)}>
                        <Icon name="send" className="w-4 h-4 mr-2" /> Send Test
                    </Button>
                    <Button variant="outline" onClick={handleExportHtml}>
                        <Icon name="download" className="w-4 h-4 mr-2" /> Export HTML
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleEdit}>
                        <Icon name="edit" className="w-4 h-4 mr-2" /> Edit Template
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Left: Preview Canvas */}
                <div className="flex-1 bg-gray-100 dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 flex flex-col overflow-hidden relative">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-800 p-1 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700 flex z-10">
                         <button onClick={() => setPreviewMode('desktop')} className={cn("p-2 rounded transition-colors", previewMode === 'desktop' ? "bg-gray-100 dark:bg-zinc-700 text-blue-600" : "text-gray-500")}><Icon name="image" className="w-4 h-4" /></button>
                         <button onClick={() => setPreviewMode('mobile')} className={cn("p-2 rounded transition-colors", previewMode === 'mobile' ? "bg-gray-100 dark:bg-zinc-700 text-blue-600" : "text-gray-500")}><Icon name="phone" className="w-4 h-4" /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 flex justify-center">
                         <div className={cn("transition-all duration-300", previewMode === 'mobile' ? "w-[375px]" : "w-[800px]")}>
                            {renderPreviewContent(template.designJson)}
                        </div>
                    </div>
                </div>

                {/* Right: Metadata Panel */}
                <div className="w-80 shrink-0 flex flex-col gap-6">
                     <Card>
                         <div className="p-4 border-b dark:border-zinc-800">
                             <h3 className="font-bold text-sm uppercase text-gray-500">Details</h3>
                         </div>
                         <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Template ID</label>
                                <p className="font-mono text-sm">{template.id}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Category</label>
                                <p className="text-sm font-medium">{template.category}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Created By</label>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                                        {template.createdBy.charAt(0)}
                                    </div>
                                    <p className="text-sm">{template.createdBy}</p>
                                </div>
                            </div>
                         </div>
                         <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 border-t dark:border-zinc-800">
                             <div className="flex justify-between items-center">
                                 <span className="text-sm font-medium">Usage Count</span>
                                 <Badge variant="green">{template.usageCount}</Badge>
                             </div>
                         </div>
                     </Card>

                     <Card>
                         <div className="p-4 border-b dark:border-zinc-800">
                             <h3 className="font-bold text-sm uppercase text-gray-500">Actions</h3>
                         </div>
                         <div className="p-4 space-y-3">
                             <Button variant="outline" className="w-full justify-start" onClick={handleDuplicate}>
                                 <Icon name="copy" className="w-4 h-4 mr-2" /> Duplicate Template
                             </Button>
                             <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleDelete}>
                                 <Icon name="trash" className="w-4 h-4 mr-2" /> Delete Template
                             </Button>
                         </div>
                     </Card>
                </div>
            </div>

            <ConfirmationDialog 
                isOpen={isDeleteOpen} 
                onClose={() => setIsDeleteOpen(false)} 
                onConfirm={confirmDelete} 
                title="Delete Template" 
                description="Are you sure you want to delete this template? This cannot be undone." 
            />
            <SendTestEmailModal isOpen={isTestModalOpen} onClose={() => setIsTestModalOpen(false)} templateName={template.name} />
        </div>
    );
};

export default EmailTemplatePreviewPage;
