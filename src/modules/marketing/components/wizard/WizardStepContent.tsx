
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Label } from '../../../../components/ui/Label';
import { Button } from '../../../../components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/Select';
import { Icon } from '../../../../components/shared/Icon';
import { Badge } from '../../../../components/ui/Badge';
import { DatePicker } from '../../../../components/ui/DatePicker';
import { Switch } from '../../../../components/ui/Switch';
import { Textarea } from '../../../../components/ui/Textarea';
import type { WizardData } from '../../pages/CampaignWizardPage';
import { TemplateStore } from '../../../../data/emailMockData';
import { cn, formatCurrency } from '../../../../lib/utils';
// Drag and Drop Editor Imports
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import EditorCanvas from '../../pages/editor/EditorCanvas';
import SidebarToolbox from '../../pages/editor/SidebarToolbox';
import PropertiesPanel from '../../pages/editor/PropertiesPanel';
import { getDefaultBlock, generateId } from '../../pages/editor/editorTypes';
import { generateEmailHtml } from '../../../../lib/emailHtmlGenerator';
import ConfirmationDialog from '../../../../components/modals/ConfirmationDialog';

// --- STEP 1: SETUP ---
export const WizardStep1Setup = ({ data, updateData }: { data: WizardData, updateData: (d: Partial<WizardData>) => void }) => {
  const [tagInput, setTagInput] = useState('');

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!data.tags.includes(tagInput.trim())) {
        updateData({ tags: [...data.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    updateData({ tags: data.tags.filter(t => t !== tag) });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-8 duration-300">
      <div className="lg:col-span-2 space-y-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Campaign Essentials</h2>
            <p className="text-gray-500">Define the core details and identity of your email campaign.</p>
          </div>

          <Card className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="md:col-span-2">
                <Label>Campaign Name <span className="text-red-500">*</span></Label>
                <Input 
                    value={data.campaignName} 
                    onChange={e => updateData({ campaignName: e.target.value })} 
                    placeholder="e.g. Summer Sale 2024 - Batch A"
                    className="mt-1.5"
                />
             </div>

             <div className="md:col-span-2">
                <Label>Subject Line <span className="text-red-500">*</span></Label>
                <div className="relative">
                    <Input 
                        value={data.subjectLine} 
                        onChange={e => updateData({ subjectLine: e.target.value })} 
                        placeholder="e.g. Don't miss out: 50% Off Everything"
                        className="mt-1.5 pr-10"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" title="Add Emoji">
                        <Icon name="smile" className="w-4 h-4" />
                    </button>
                </div>
             </div>

             <div className="md:col-span-2">
                <Label>Preview Text</Label>
                <Input 
                    value={data.previewText} 
                    onChange={e => updateData({ previewText: e.target.value })} 
                    placeholder="Secondary text shown in inbox..."
                    className="mt-1.5"
                />
             </div>

             <div>
                <Label>From Name</Label>
                <Input 
                    value={data.fromName} 
                    onChange={e => updateData({ fromName: e.target.value })} 
                    className="mt-1.5"
                />
             </div>

             <div>
                <Label>From Email <span className="text-red-500">*</span></Label>
                <Input 
                    value={data.fromEmail} 
                    onChange={e => updateData({ fromEmail: e.target.value })} 
                    className="mt-1.5"
                    type="email"
                />
             </div>

             <div>
                <Label>Reply-To Email</Label>
                <Input 
                    value={data.replyTo} 
                    onChange={e => updateData({ replyTo: e.target.value })} 
                    className="mt-1.5"
                    placeholder="Optional"
                />
             </div>

             <div>
                 <Label>Tags</Label>
                 <div className="mt-1.5 relative">
                     <Input 
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={addTag}
                        placeholder="Type and press Enter..."
                     />
                 </div>
                 <div className="flex flex-wrap gap-2 mt-2">
                     {data.tags.map(tag => (
                         <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                             {tag} <button onClick={() => removeTag(tag)}><Icon name="close" className="w-3 h-3"/></button>
                         </Badge>
                     ))}
                 </div>
             </div>
             
             <div className="md:col-span-2 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                    <Label className="text-base">Transactional Email</Label>
                    <p className="text-xs text-gray-500">Use for order updates, password resets, etc. Bypasses unsubscribe lists.</p>
                </div>
                <Switch checked={data.isTransactional} onClick={() => updateData({ isTransactional: !data.isTransactional })} />
             </div>
          </Card>
      </div>

      {/* Inbox Preview Card */}
      <div className="lg:col-span-1 space-y-6">
           <div className="mb-4 hidden lg:block">
                <h3 className="text-lg font-bold opacity-0">Preview</h3>
                <p className="text-gray-500 opacity-0">Spacer</p>
            </div>
          <Card className="bg-gray-100 dark:bg-zinc-900 border-none shadow-none p-4 sticky top-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Inbox Preview</h3>
              
              {/* Mobile Preview Mockup */}
              <div className="bg-white text-black rounded-3xl border-8 border-gray-800 shadow-xl overflow-hidden max-w-[300px] mx-auto">
                  {/* Status Bar */}
                  <div className="bg-black text-white text-[10px] px-4 py-1 flex justify-between items-center">
                      <span>9:41</span>
                      <div className="flex gap-1">
                          <Icon name="wifi" className="w-3 h-3" />
                          <Icon name="battery" className="w-3 h-3" />
                      </div>
                  </div>
                  {/* App Header */}
                  <div className="bg-blue-600 text-white p-3 text-sm font-medium flex items-center gap-3">
                      <Icon name="menu" className="w-4 h-4" />
                      <span>Inbox</span>
                  </div>
                  {/* Email Item */}
                  <div className="p-3 border-b border-gray-100 flex gap-3 items-start bg-blue-50">
                      <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {(data.fromName || "E").charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                              <h4 className="font-bold text-sm truncate">{data.fromName || "Sender Name"}</h4>
                              <span className="text-[10px] text-gray-400">Now</span>
                          </div>
                          <p className="text-sm font-medium truncate">{data.subjectLine || "Subject Line"}</p>
                          <p className="text-xs text-gray-500 truncate">{data.previewText || "Preview text appears here..."}</p>
                      </div>
                  </div>
                  {/* Dummy Items */}
                  <div className="p-3 border-b border-gray-100 flex gap-3 items-start opacity-50">
                      <div className="w-8 h-8 rounded-full bg-gray-300 shrink-0" />
                      <div className="space-y-1 flex-1">
                          <div className="h-3 bg-gray-200 w-24 rounded" />
                          <div className="h-2.5 bg-gray-200 w-full rounded" />
                      </div>
                  </div>
                  <div className="p-3 border-b border-gray-100 flex gap-3 items-start opacity-50">
                      <div className="w-8 h-8 rounded-full bg-gray-300 shrink-0" />
                      <div className="space-y-1 flex-1">
                          <div className="h-3 bg-gray-200 w-20 rounded" />
                          <div className="h-2.5 bg-gray-200 w-3/4 rounded" />
                      </div>
                  </div>
              </div>
          </Card>
      </div>
    </div>
  );
};

// --- STEP 2: TEMPLATE ---
export const WizardStep2Template = ({ data, updateData, onNext }: { data: WizardData, updateData: (d: Partial<WizardData>) => void, onNext: () => void }) => {
    const [filter, setFilter] = useState('All');
    const [importHtml, setImportHtml] = useState('');
    const [showImport, setShowImport] = useState(false);
    const templates = TemplateStore.getAll();
    
    const filteredTemplates = useMemo(() => {
        return templates.filter(t => filter === 'All' || t.category === filter);
    }, [templates, filter]);

    const handleSelect = (id: string) => {
        updateData({ templateId: id });
        const t = templates.find(temp => temp.id === id);
        if (t) {
            try {
                updateData({ emailBlocks: JSON.parse(t.designJson) });
            } catch(e) { console.error("Failed to parse template"); }
        }
        onNext(); 
    };

    const handleScratch = () => {
        updateData({ templateId: 'scratch', emailBlocks: [getDefaultBlock('header'), getDefaultBlock('text')] });
        onNext();
    };

    const handleImportSubmit = () => {
        // Simple mock: Create a single HTML block with the imported content
        const htmlBlock = getDefaultBlock('html');
        htmlBlock.content.html = importHtml;
        updateData({ templateId: 'imported', emailBlocks: [htmlBlock], importHtml });
        onNext();
    };

    if (showImport) {
        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-8">
                <div>
                    <h2 className="text-2xl font-bold">Import HTML</h2>
                    <p className="text-gray-500">Paste your custom HTML code below.</p>
                </div>
                <Card className="p-6">
                    <Label>HTML Code</Label>
                    <Textarea 
                        className="min-h-[400px] font-mono text-xs mt-2 bg-gray-50 dark:bg-zinc-900" 
                        placeholder="<!DOCTYPE html>..." 
                        value={importHtml}
                        onChange={e => setImportHtml(e.target.value)}
                    />
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setShowImport(false)}>Cancel</Button>
                        <Button onClick={handleImportSubmit} disabled={!importHtml.trim()}>Import & Continue</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Choose a Template</h2>
                    <p className="text-gray-500">Start from scratch, import code, or pick a layout.</p>
                </div>
                <div className="flex gap-2">
                    {['All', 'Newsletter', 'Promotional', 'Automated'].map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                filter === cat ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Start from Scratch */}
                <div 
                    onClick={handleScratch}
                    className="group border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all min-h-[280px]"
                >
                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon name="plus" className="w-8 h-8 text-gray-400 group-hover:text-blue-500" />
                    </div>
                    <h3 className="font-bold text-gray-700 dark:text-gray-200">Start from Scratch</h3>
                    <p className="text-xs text-gray-500 mt-1 text-center">Build using drag & drop.</p>
                </div>

                {/* Import HTML */}
                <div 
                    onClick={() => setShowImport(true)}
                    className="group border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all min-h-[280px]"
                >
                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon name="code" className="w-8 h-8 text-gray-400 group-hover:text-purple-500" />
                    </div>
                    <h3 className="font-bold text-gray-700 dark:text-gray-200">Import HTML</h3>
                    <p className="text-xs text-gray-500 mt-1 text-center">Paste your own code.</p>
                </div>

                {filteredTemplates.map(t => (
                    <div 
                        key={t.id}
                        className={cn(
                            "group relative bg-white dark:bg-zinc-900 rounded-xl border overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
                            data.templateId === t.id ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-black" : "border-gray-200 dark:border-zinc-800"
                        )}
                        onClick={() => handleSelect(t.id)}
                    >
                        <div className="h-40 bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
                            <img src={t.thumbnail} alt={t.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-2 left-2">
                                <Badge variant="secondary" className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-[10px] border-none">{t.category}</Badge>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">{t.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">Used {t.usageCount} times</p>
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button size="sm" className="bg-white text-black hover:bg-gray-100">Select Template</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- STEP 3: EDITOR (Embedded) ---
export const WizardStep3Editor = ({ data, updateData }: { data: WizardData, updateData: (d: Partial<WizardData>) => void }) => {
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [activeDragItem, setActiveDragItem] = useState<any>(null);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [canvasBg, setCanvasBg] = useState('#ffffff');

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const handleBlockUpdate = (newBlocks: any[]) => {
        updateData({ emailBlocks: newBlocks });
    };

    // Editor Logic (Simplified duplication of EditorPage logic for brevity)
    const updateBlock = (id: string, path: 'content' | 'styles', key: string, value: any) => {
        const newBlocks = data.emailBlocks.map(b => b.id === id ? { ...b, [path]: { ...b[path], [key]: value } } : b);
        handleBlockUpdate(newBlocks);
    };
    const deleteBlock = (id: string) => {
        handleBlockUpdate(data.emailBlocks.filter(b => b.id !== id));
        if (selectedBlockId === id) setSelectedBlockId(null);
    };
    const duplicateBlock = (id: string) => {
        const block = data.emailBlocks.find(b => b.id === id);
        if (!block) return;
        const newBlock = JSON.parse(JSON.stringify(block));
        newBlock.id = generateId();
        const idx = data.emailBlocks.findIndex(b => b.id === id);
        const newBlocks = [...data.emailBlocks];
        newBlocks.splice(idx + 1, 0, newBlock);
        handleBlockUpdate(newBlocks);
    };
    const moveBlock = (from: number, to: number) => {
        handleBlockUpdate(arrayMove(data.emailBlocks, from, to));
    };

    const handleDragStart = (e: any) => setActiveDragItem(e.active.data.current);
    const handleDragEnd = (e: any) => {
        const { active, over } = e;
        setActiveDragItem(null);
        if (!over) return;
        if (active.data.current?.isTool) {
             const newBlock = getDefaultBlock(active.data.current.type);
             const newBlocks = [...data.emailBlocks];
             if (over.id === 'canvas-droppable') newBlocks.push(newBlock);
             else {
                 const idx = data.emailBlocks.findIndex(b => b.id === over.id);
                 newBlocks.splice(idx !== -1 ? idx + 1 : newBlocks.length, 0, newBlock);
             }
             handleBlockUpdate(newBlocks);
             setSelectedBlockId(newBlock.id);
        } else if (active.id !== over.id) {
            const oldIdx = data.emailBlocks.findIndex(b => b.id === active.id);
            const newIdx = data.emailBlocks.findIndex(b => b.id === over.id);
            moveBlock(oldIdx, newIdx);
        }
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-[calc(100vh-180px)] bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm animate-in zoom-in-95 duration-300">
                <SidebarToolbox onApplyPreset={() => {}} />
                <div className="flex-1 relative flex flex-col">
                    <div className="h-12 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between px-4 bg-gray-50/50 dark:bg-zinc-900/50">
                        <div className="text-xs font-medium text-gray-500">Drag blocks onto the canvas</div>
                        <div className="flex bg-gray-200 dark:bg-zinc-800 rounded p-0.5">
                            <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded ${previewMode === 'desktop' ? 'bg-white dark:bg-zinc-600 shadow' : ''}`}><Icon name="image" className="w-4 h-4"/></button>
                            <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded ${previewMode === 'mobile' ? 'bg-white dark:bg-zinc-600 shadow' : ''}`}><Icon name="phone" className="w-4 h-4"/></button>
                        </div>
                    </div>
                    <EditorCanvas 
                        blocks={data.emailBlocks} 
                        previewMode={previewMode} 
                        canvasBg={canvasBg}
                        selectedBlockId={selectedBlockId}
                        onSelectBlock={setSelectedBlockId}
                        onMoveUp={(i) => moveBlock(i, i - 1)}
                        onMoveDown={(i) => moveBlock(i, i + 1)}
                        onDuplicate={duplicateBlock}
                        onDelete={deleteBlock}
                        activeDragItem={activeDragItem}
                    />
                </div>
                <PropertiesPanel 
                    selectedBlock={data.emailBlocks.find(b => b.id === selectedBlockId) || null} 
                    updateBlock={updateBlock}
                    canvasBg={canvasBg}
                    setCanvasBg={setCanvasBg}
                    onDeselect={() => setSelectedBlockId(null)}
                />
                <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }}>
                    {activeDragItem?.isTool ? <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-xl text-xs font-bold">Add {activeDragItem.label}</div> : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
};

// --- STEP 4: AUDIENCE ---
export const WizardStep4Audience = ({ data, updateData }: { data: WizardData, updateData: (d: Partial<WizardData>) => void }) => {
    const segments = [
        { id: 'all', name: 'All Customers', count: 12450, desc: 'Everyone in your contact list.', risk: 'high' },
        { id: 'vip', name: 'VIP Customers', count: 450, desc: 'Spent > $500 in last 6 months.', risk: 'low' },
        { id: 'new', name: 'New Signups', count: 1200, desc: 'Joined in last 30 days.', risk: 'low' },
        { id: 'abandoned', name: 'Cart Abandoners', count: 560, desc: 'Items in cart > 24 hours.', risk: 'medium' },
    ];

    const selectedSegment = segments.find(s => s.id === data.audienceSegment);

    // Simulated Logic
    const healthStats = useMemo(() => {
        if (!selectedSegment) return null;
        const baseCount = selectedSegment.count;
        // Mock Unsubscribes based on segment risk
        const unsubRate = selectedSegment.risk === 'high' ? 0.05 : selectedSegment.risk === 'medium' ? 0.02 : 0.005;
        const unsubscribed = Math.floor(baseCount * unsubRate);
        const bounced = Math.floor(baseCount * 0.01);
        return { 
            reachable: baseCount - unsubscribed - bounced,
            unsubscribed,
            bounced 
        };
    }, [selectedSegment]);

    return (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
             <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">Who should receive this?</h2>
                <p className="text-gray-500">Select your target audience segment.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {segments.map(seg => (
                    <div 
                        key={seg.id}
                        className={cn(
                            "p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center hover:shadow-md",
                            data.audienceSegment === seg.id 
                                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 ring-1 ring-blue-500" 
                                : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:border-gray-300"
                        )}
                        onClick={() => updateData({ audienceSegment: seg.id })}
                    >
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">{seg.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{seg.desc}</p>
                        </div>
                        <div className="text-right">
                             <Badge variant="secondary" className="bg-white dark:bg-zinc-800">{seg.count.toLocaleString()}</Badge>
                             {seg.risk === 'high' && <p className="text-[10px] text-red-500 mt-1 font-medium">High Churn Risk</p>}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Health Warning */}
            {healthStats && healthStats.unsubscribed > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <Icon name="alertTriangle" className="w-5 h-5 text-orange-600 dark:text-orange-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-orange-800 dark:text-orange-200">Audience Health Check</h4>
                        <p className="text-xs text-orange-700 dark:text-orange-300 mt-1 leading-relaxed">
                            This segment contains <strong>{healthStats.unsubscribed} unsubscribed</strong> and <strong>{healthStats.bounced} bounced</strong> contacts. 
                            They will be automatically suppressed from this campaign.
                        </p>
                        <div className="mt-3 flex gap-4 text-xs font-medium">
                            <span className="text-green-600">Reachable: {healthStats.reachable.toLocaleString()}</span>
                            <span className="text-gray-500">Suppressed: {(healthStats.unsubscribed + healthStats.bounced).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STEP 5: SCHEDULE ---
export const WizardStep5Schedule = ({ data, updateData }: { data: WizardData, updateData: (d: Partial<WizardData>) => void }) => {
    
    // Mock Conflict Detection
    const conflict = useMemo(() => {
        if (data.scheduleType === 'now') return null;
        
        // Mock: If scheduled for "today" (based on string comparison to localized date), show warning
        const today = new Date().toISOString().split('T')[0];
        if (data.sendDate === today) {
            return {
                count: 2,
                campaigns: ["Weekly Newsletter", "Welcome Series A"]
            };
        }
        return null;
    }, [data.sendDate, data.scheduleType]);

    return (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-300 max-w-2xl mx-auto">
             <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">When should we send it?</h2>
                <p className="text-gray-500">Choose the perfect time for your campaign.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                    className={cn(
                        "p-6 rounded-xl border cursor-pointer text-center space-y-4 transition-all hover:shadow-md",
                        data.scheduleType === 'now' 
                            ? "bg-green-50 dark:bg-green-900/20 border-green-500 ring-1 ring-green-500" 
                            : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                    )}
                    onClick={() => updateData({ scheduleType: 'now' })}
                >
                    <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                        <Icon name="send" className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Send Now</h3>
                        <p className="text-sm text-gray-500">Launch immediately after review.</p>
                    </div>
                </div>

                <div 
                    className={cn(
                        "p-6 rounded-xl border cursor-pointer text-center space-y-4 transition-all hover:shadow-md",
                        data.scheduleType === 'later' 
                            ? "bg-purple-50 dark:bg-purple-900/20 border-purple-500 ring-1 ring-purple-500" 
                            : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                    )}
                    onClick={() => updateData({ scheduleType: 'later' })}
                >
                    <div className="w-12 h-12 mx-auto bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <Icon name="clock" className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Schedule for Later</h3>
                        <p className="text-sm text-gray-500">Pick a specific date and time.</p>
                    </div>
                </div>
            </div>

            {data.scheduleType === 'later' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <Card className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input type="date" value={data.sendDate} onChange={e => updateData({ sendDate: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Time</Label>
                                <Input type="time" value={data.sendTime} onChange={e => updateData({ sendTime: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Timezone</Label>
                            <Select value={data.timezone} onValueChange={v => updateData({ timezone: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UTC-5">Eastern Time (US & Canada)</SelectItem>
                                    <SelectItem value="UTC-8">Pacific Time (US & Canada)</SelectItem>
                                    <SelectItem value="UTC+0">GMT (London)</SelectItem>
                                    <SelectItem value="UTC+5:30">IST (India)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>

                    {/* Conflict Warning */}
                    {conflict && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-xl p-4 flex items-start gap-3">
                            <Icon name="alertCircle" className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-200">Potential Schedule Conflict</h4>
                                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                    You have <strong>{conflict.count} other campaigns</strong> scheduled for this date: {conflict.campaigns.join(", ")}.
                                    Consider rescheduling to avoid audience fatigue.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- STEP 6: REVIEW ---
export const WizardStep6Review = ({ data, onSubmit, isSubmitting }: { data: WizardData, onSubmit: () => void, isSubmitting: boolean }) => {
    const [previewTab, setPreviewTab] = useState<'desktop' | 'mobile'>('desktop');
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            {/* Left: Summary */}
            <div className="lg:col-span-1 space-y-6">
                <h2 className="text-2xl font-bold mb-4">Review & Launch</h2>
                
                <Card className="overflow-hidden">
                    <div className="bg-gray-50 dark:bg-zinc-800/50 px-4 py-3 border-b dark:border-zinc-800 font-medium text-sm">Campaign Details</div>
                    <div className="p-4 space-y-3 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Name</span> <span className="font-medium text-right">{data.campaignName}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Subject</span> <span className="font-medium text-right">{data.subjectLine}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">From</span> <span className="font-medium text-right">{data.fromName}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Audience</span> <span className="font-medium text-right">{data.audienceSegment === 'all' ? 'All Customers' : 'Selected Segment'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Type</span> <Badge variant={data.isTransactional ? 'purple' : 'blue'}>{data.isTransactional ? 'Transactional' : 'Marketing'}</Badge></div>
                    </div>
                </Card>

                <Card className="overflow-hidden">
                    <div className="bg-gray-50 dark:bg-zinc-800/50 px-4 py-3 border-b dark:border-zinc-800 font-medium text-sm">Schedule</div>
                    <div className="p-4 space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Send Time</span> 
                            <Badge variant={data.scheduleType === 'now' ? 'green' : 'blue'}>{data.scheduleType === 'now' ? 'Immediately' : `${data.sendDate} @ ${data.sendTime}`}</Badge>
                        </div>
                        {data.scheduleType === 'later' && (
                             <div className="flex justify-between"><span className="text-gray-500">Timezone</span> <span className="font-medium text-right">{data.timezone}</span></div>
                        )}
                    </div>
                </Card>

                <Button className="w-full h-12 text-lg shadow-lg bg-green-600 hover:bg-green-700 text-white" onClick={() => setConfirmOpen(true)} disabled={isSubmitting}>
                    {isSubmitting ? <Icon name="refreshCw" className="w-5 h-5 animate-spin" /> : (data.scheduleType === 'now' ? "Send Now" : "Schedule Campaign")}
                </Button>
            </div>

            {/* Right: Preview */}
            <div className="lg:col-span-2 bg-gray-100 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 flex flex-col overflow-hidden min-h-[600px]">
                <div className="h-12 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-4">
                    <span className="text-xs font-bold uppercase text-gray-500">Final Preview</span>
                    <div className="flex bg-gray-100 dark:bg-zinc-800 rounded p-0.5">
                         <button onClick={() => setPreviewTab('desktop')} className={cn("p-1.5 rounded", previewTab === 'desktop' ? "bg-white dark:bg-zinc-600 shadow" : "text-gray-500")}><Icon name="image" className="w-4 h-4"/></button>
                         <button onClick={() => setPreviewTab('mobile')} className={cn("p-1.5 rounded", previewTab === 'mobile' ? "bg-white dark:bg-zinc-600 shadow" : "text-gray-500")}><Icon name="phone" className="w-4 h-4"/></button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-gray-50/50 dark:bg-zinc-950/50">
                     <div className={cn("bg-white text-black shadow-xl transition-all", previewTab === 'mobile' ? "w-[375px] min-h-[600px] rounded-[30px] border-8 border-gray-800" : "w-[650px] min-h-[600px] rounded-sm")}>
                         <div className="p-4 border-b">
                             <div className="text-xs text-gray-500 mb-1">Subject: <span className="font-bold text-gray-900">{data.subjectLine}</span></div>
                             <div className="text-xs text-gray-400">{data.previewText}</div>
                         </div>
                         <div dangerouslySetInnerHTML={{ __html: generateEmailHtml(data.emailBlocks) }} />
                     </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationDialog 
                isOpen={confirmOpen} 
                onClose={() => setConfirmOpen(false)} 
                onConfirm={() => { setConfirmOpen(false); onSubmit(); }}
                title={data.scheduleType === 'now' ? "Confirm Send?" : "Confirm Schedule?"}
                description={data.scheduleType === 'now' 
                    ? `You are about to send "${data.campaignName}" to approx. 12,000 recipients immediately.` 
                    : `You are scheduling "${data.campaignName}" for ${data.sendDate} at ${data.sendTime}.`
                }
            />
        </div>
    );
};
