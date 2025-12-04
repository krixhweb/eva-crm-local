
import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '../../../../components/ui/Drawer';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Label } from '../../../../components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/Select';
import { Icon } from '../../../../components/shared/Icon';
import { useGlassyToasts } from '../../../../components/ui/GlassyToastProvider';
import { cn } from '../../../../lib/utils';
import { Textarea } from '../../../../components/ui/Textarea';
import type { EmailCampaign } from '../../../../types';

interface CreateEmailDrawerProps {
    open: boolean;
    onClose: () => void;
    campaignToEdit?: EmailCampaign | null;
}

export const CreateEmailDrawer: React.FC<CreateEmailDrawerProps> = ({ open, onClose, campaignToEdit }) => {
    const { push } = useGlassyToasts();
    const [step, setStep] = useState(1);
    const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual');
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        previewText: '',
        fromName: 'Eva CRM Team',
        fromEmail: 'hello@evacrm.com',
        audience: '',
        contentHtml: ''
    });

    // Reset or Load Data
    useEffect(() => {
        if (open) {
            if (campaignToEdit) {
                setFormData({
                    name: campaignToEdit.name,
                    subject: campaignToEdit.subject,
                    previewText: campaignToEdit.previewText,
                    fromName: campaignToEdit.fromName,
                    fromEmail: campaignToEdit.fromEmail,
                    audience: campaignToEdit.audience,
                    contentHtml: campaignToEdit.contentHtml
                });
            } else {
                setFormData({ name: '', subject: '', previewText: '', fromName: 'Eva CRM Team', fromEmail: 'hello@evacrm.com', audience: '', contentHtml: '' });
            }
            setStep(1);
        }
    }, [open, campaignToEdit]);

    const handleNext = () => {
        if (step === 1) {
            if (!formData.name || !formData.subject || !formData.fromEmail) {
                push({ title: "Validation Error", description: "Please fill in all required fields.", variant: "error" });
                return;
            }
            setStep(2);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSaveDraft = () => {
        setLoading(true);
        setTimeout(() => {
            push({ title: "Draft Saved", description: `"${formData.name}" saved as draft.`, variant: "info" });
            setLoading(false);
            onClose();
        }, 500);
    };

    const handleFinish = () => {
        setLoading(true);
        setTimeout(() => {
            push({ title: "Campaign Saved", description: `"${formData.name}" is ready for automation.`, variant: "success" });
            setLoading(false);
            onClose();
        }, 800);
    };

    const handleSendTest = () => {
        push({ title: "Test Sent", description: "Check your inbox (mock).", variant: "info" });
    };

    return (
        <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
            <DrawerContent className="w-full md:w-[900px] p-0 rounded-l-3xl border-l border-gray-200 dark:border-zinc-800" showCloseButton={false}>
                
                {/* Header */}
                <DrawerHeader className="border-b px-8 py-5 flex justify-between items-center bg-white dark:bg-zinc-900 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600">
                            <Icon name="mail" className="h-5 w-5" />
                        </div>
                        <div>
                            <DrawerTitle className="text-xl font-bold">{campaignToEdit ? 'Edit Campaign' : 'Create Email Campaign'}</DrawerTitle>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                <span className={cn("font-medium transition-colors", step === 1 ? "text-blue-600" : "")}>1. Basic Details</span>
                                <span className="text-gray-300">/</span>
                                <span className={cn("font-medium transition-colors", step === 2 ? "text-blue-600" : "")}>2. Email Builder</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500">Cancel</Button>
                        {step === 1 && <Button variant="outline" size="sm" onClick={handleSaveDraft}>Save Draft</Button>}
                    </div>
                </DrawerHeader>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50 dark:bg-zinc-950/50">
                    
                    {/* STEP 1: DETAILS */}
                    {step === 1 && (
                        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4">
                            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-6">
                                <div className="space-y-2">
                                    <Label>Campaign Name <span className="text-red-500">*</span></Label>
                                    <Input placeholder="e.g. Summer Sale Newsletter" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                    <p className="text-xs text-gray-500">Internal name for your reference.</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Subject Line <span className="text-red-500">*</span></Label>
                                        <Input placeholder="Enter a catchy subject..." value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Preview Text</Label>
                                        <Input placeholder="Text shown in inbox preview..." value={formData.previewText} onChange={e => setFormData({...formData, previewText: e.target.value})} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Audience Segment</Label>
                                    <Select value={formData.audience} onValueChange={v => setFormData({...formData, audience: v})}>
                                        <SelectTrigger><SelectValue placeholder="Select who should receive this" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Customers (12,450)</SelectItem>
                                            <SelectItem value="vip">VIP Customers (450)</SelectItem>
                                            <SelectItem value="new">New Signups - Last 30 Days (1,200)</SelectItem>
                                            <SelectItem value="abandoned">Recent Cart Abandoners (560)</SelectItem>
                                            <SelectItem value="office">Office Segment (3,200)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-100 dark:border-zinc-800">
                                    <div className="space-y-2">
                                        <Label>From Name</Label>
                                        <Input value={formData.fromName} onChange={e => setFormData({...formData, fromName: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>From Email <span className="text-red-500">*</span></Label>
                                        <Input value={formData.fromEmail} onChange={e => setFormData({...formData, fromEmail: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: CONTENT */}
                    {step === 2 && (
                        <div className="h-full flex flex-col space-y-4 animate-in fade-in slide-in-from-right-4">
                            {/* Editor Toolbar */}
                            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                                <div className="flex gap-1 bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
                                    <button 
                                        onClick={() => setEditorMode('visual')}
                                        className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all", editorMode === 'visual' ? "bg-white dark:bg-zinc-600 shadow text-blue-600 dark:text-white" : "text-gray-500")}
                                    >
                                        Drag & Drop
                                    </button>
                                    <button 
                                        onClick={() => setEditorMode('html')}
                                        className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all", editorMode === 'html' ? "bg-white dark:bg-zinc-600 shadow text-blue-600 dark:text-white" : "text-gray-500")}
                                    >
                                        HTML Code
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={handleSendTest}>
                                        <Icon name="send" className="w-3 h-3 mr-2" /> Send Test
                                    </Button>
                                </div>
                            </div>

                            {/* Mock Editor Canvas */}
                            <div className="flex-1 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col relative">
                                {editorMode === 'visual' ? (
                                    <div className="flex h-[450px]">
                                        {/* Sidebar */}
                                        <div className="w-64 border-r border-gray-200 dark:border-zinc-800 p-4 bg-gray-50 dark:bg-zinc-900/50">
                                            <p className="text-xs font-bold text-gray-500 uppercase mb-3">Components</p>
                                            <div className="space-y-2">
                                                {['Image', 'Text', 'Button', 'Divider', 'Social Links', 'Product Grid'].map(item => (
                                                    <div key={item} className="p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 cursor-grab hover:border-blue-400 transition-colors flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-gray-100 dark:bg-zinc-700 rounded flex items-center justify-center">
                                                            <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
                                                        </div>
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Canvas */}
                                        <div className="flex-1 bg-gray-100 dark:bg-zinc-950 p-8 overflow-y-auto flex justify-center">
                                            <div className="w-full max-w-[600px] min-h-full bg-white dark:bg-zinc-900 shadow-lg rounded-lg border border-gray-200 dark:border-zinc-800 p-8 space-y-6">
                                                {/* Mock Content based on inputs */}
                                                <div className="text-center border-2 border-dashed border-transparent hover:border-blue-500 p-2 rounded transition-all">
                                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formData.subject || "Your Headline Here"}</h2>
                                                </div>
                                                <div className="h-48 bg-gray-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-gray-400 border-2 border-dashed border-transparent hover:border-blue-500 transition-all">
                                                    Hero Image Placeholder
                                                </div>
                                                <div className="text-gray-600 dark:text-gray-400 leading-relaxed border-2 border-dashed border-transparent hover:border-blue-500 p-2 rounded transition-all">
                                                    <p>Hi {formData.audience.includes('New') ? 'Friend' : '{Customer_Name}'},</p>
                                                    <p className="mt-2">Here is your exclusive preview: {formData.previewText || "Add content here..."}</p>
                                                </div>
                                                <div className="text-center border-2 border-dashed border-transparent hover:border-blue-500 p-2 rounded transition-all">
                                                    <Button className="bg-blue-600 text-white px-8">Call to Action</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Textarea 
                                        className="flex-1 font-mono text-sm p-4 border-none resize-none focus-visible:ring-0 bg-zinc-900 text-green-400" 
                                        placeholder="<!-- Write your HTML here -->"
                                        value={formData.contentHtml}
                                        onChange={e => setFormData({...formData, contentHtml: e.target.value})}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <DrawerFooter className="border-t px-8 py-5 bg-white dark:bg-zinc-900 flex justify-between items-center shrink-0">
                    <Button variant="outline" onClick={step === 1 ? onClose : handleBack}>
                        {step === 1 ? "Cancel" : "Back"}
                    </Button>
                    <div className="flex gap-3">
                        <Button onClick={step === 2 ? handleFinish : handleNext} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white w-40 shadow-md">
                            {loading ? <Icon name="refreshCw" className="w-4 h-4 animate-spin" /> : (step === 2 ? "Save & Finish" : "Next Step")}
                        </Button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
