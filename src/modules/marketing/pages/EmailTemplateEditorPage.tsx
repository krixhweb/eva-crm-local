
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragOverlay, 
  defaultDropAnimationSideEffects, 
  DragStartEvent, 
  DragEndEvent, 
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Icon } from '../../../components/shared/Icon';
import { useGlassyToasts } from '../../../components/ui/GlassyToastProvider';
import type { EmailTemplate } from '../../../types';
import { TemplateStore } from '../../../data/emailMockData';
import { SendTestEmailModal } from '../../../components/modals/SendTestEmailModal';
import { cn } from '../../../lib/utils';
import { generateEmailHtml } from '../../../lib/emailHtmlGenerator';
import { EMAIL_PRESETS } from './editor/emailPresets';
import type { Block, BlockType } from './editor/editorTypes';
import { getDefaultBlock, generateId, getDefaultColumnData } from './editor/editorTypes';

// Imports from sub-components
import EditorCanvas from './editor/EditorCanvas';
import SidebarToolbox from './editor/SidebarToolbox';
import PropertiesPanel from './editor/PropertiesPanel';

const EmailTemplateEditorPage = () => {
    const { templateId } = useParams<{ templateId: string }>();
    const navigate = useNavigate();
    const { push } = useGlassyToasts();

    // State
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [templateName, setTemplateName] = useState('Untitled Template');
    const [category, setCategory] = useState('Newsletter');
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [activeDragItem, setActiveDragItem] = useState<any>(null);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [canvasBg, setCanvasBg] = useState('#ffffff');
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    
    // History Stack (Limit 50)
    const [history, setHistory] = useState<Block[][]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    
    const isHistoryOperation = useRef(false);

    // Initialization
    useEffect(() => {
        if (templateId && templateId !== 'new') {
            const t = TemplateStore.getById(templateId);
            if (t) {
                setTemplateName(t.name);
                setCategory(t.category);
                try {
                    const loaded = JSON.parse(t.designJson);
                    setBlocks(loaded);
                    setHistory([loaded]);
                    setHistoryIndex(0);
                } catch(e) {
                    const def = [getDefaultBlock('header'), getDefaultBlock('text')];
                    setBlocks(def);
                    setHistory([def]);
                    setHistoryIndex(0);
                }
            }
        } else {
            const def = [getDefaultBlock('header'), getDefaultBlock('text')];
            setBlocks(def);
            setHistory([def]);
            setHistoryIndex(0);
        }
    }, [templateId]);

    // --- History Logic ---
    const pushToHistory = useCallback((newBlocks: Block[]) => {
        if (isHistoryOperation.current) return;

        setHistory(prevHistory => {
            const newHistory = prevHistory.slice(0, historyIndex + 1);
            newHistory.push(newBlocks);
            if (newHistory.length > 50) newHistory.shift(); // Limit stack size
            return newHistory;
        });
        setHistoryIndex(prev => Math.min(prev + 1, 49));
    }, [historyIndex]);

    const updateBlocks = (newBlocks: Block[]) => {
        setBlocks(newBlocks);
        pushToHistory(newBlocks);
    };

    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            isHistoryOperation.current = true;
            const prevIndex = historyIndex - 1;
            setBlocks(history[prevIndex]);
            setHistoryIndex(prevIndex);
            // Select the first block of the previous state if available
            setSelectedBlockId(history[prevIndex][0]?.id || null);
            setTimeout(() => { isHistoryOperation.current = false; }, 0);
        }
    }, [history, historyIndex]);

    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            isHistoryOperation.current = true;
            const nextIndex = historyIndex + 1;
            setBlocks(history[nextIndex]);
            setHistoryIndex(nextIndex);
            setSelectedBlockId(history[nextIndex][0]?.id || null);
            setTimeout(() => { isHistoryOperation.current = false; }, 0);
        }
    }, [history, historyIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                if (e.shiftKey) {
                    e.preventDefault();
                    handleRedo();
                } else {
                    e.preventDefault();
                    handleUndo();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo]);


    // --- Block Manipulation ---
    const updateBlock = (id: string, path: 'content' | 'styles', key: string, value: any) => {
        const newBlocks = blocks.map(b => 
            b.id === id ? { ...b, [path]: { ...b[path], [key]: value } } : b
        );
        updateBlocks(newBlocks);
    };

    const deleteBlock = (id: string) => {
        const newBlocks = blocks.filter(b => b.id !== id);
        updateBlocks(newBlocks);
        if (selectedBlockId === id) setSelectedBlockId(null);
    };

    const duplicateBlock = (id: string) => {
        const blockToDup = blocks.find(b => b.id === id);
        if (!blockToDup) return;

        const newBlock = JSON.parse(JSON.stringify(blockToDup));
        newBlock.id = generateId();
        
        const idx = blocks.findIndex(b => b.id === id);
        const newBlocks = [...blocks];
        newBlocks.splice(idx + 1, 0, newBlock);
        updateBlocks(newBlocks);
        setSelectedBlockId(newBlock.id);
    };

    const moveBlock = (fromIndex: number, toIndex: number) => {
        const newBlocks = arrayMove(blocks, fromIndex, toIndex);
        updateBlocks(newBlocks);
    };

    // --- PRESET HANDLER (CENTRALIZED) ---
    const applyPreset = (presetId: string) => {
        // 1. Confirm replacement
        if (blocks.length > 0) {
            if (!window.confirm("This will replace your current design with the selected layout. Continue?")) {
                return;
            }
        }

        // 2. Find Preset
        const preset = EMAIL_PRESETS.find(p => p.id === presetId);
        if (!preset) {
            console.warn(`Preset not found: ${presetId}`);
            return;
        }

        // 3. Generate New Blocks with Unique IDs
        const newBlocks: Block[] = preset.blocks.map(def => {
            // Start with a fresh default block of the requested type
            const baseBlock = getDefaultBlock(def.type);
            
            // Merge specific preset content/styles
            // We deep copy content to avoid reference issues
            let content = { ...baseBlock.content, ...def.content };
            let styles = { ...baseBlock.styles, ...def.styles };

            // Special handling for column content to ensure defaults are present
            if ((def.type === '2-col' || def.type === '3-col') && def.content && def.content.columns) {
                const baseCols = baseBlock.content.columns || [];
                const presetCols = def.content.columns || [];
                
                content.columns = presetCols.map((pc, idx) => ({
                    ...baseCols[idx] || getDefaultColumnData(), 
                    ...pc
                }));
            }

            // Ensure ID is absolutely unique for this new instance
            baseBlock.id = generateId();

            return {
                ...baseBlock,
                content: content,
                styles: styles
            };
        });

        // 4. Update State via history-aware function
        updateBlocks(newBlocks);
        
        // 5. Reset Selection to first block
        if (newBlocks.length > 0) {
             setSelectedBlockId(newBlocks[0].id);
        } else {
             setSelectedBlockId(null);
        }
        
        // 6. Scroll Canvas to Top
        setTimeout(() => {
            const canvas = document.getElementById('canvas-droppable');
            if (canvas) {
                canvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Also reset scroll of the container
                const container = canvas.parentElement;
                if (container) container.scrollTop = 0;
            }
        }, 100);

        push({ title: "Layout Applied", description: `${preset.name} template loaded successfully.`, variant: "success" });
    };

    const handleSave = async () => {
        if (!templateName.trim()) return push({ title: "Error", description: "Name required", variant: "error" });
        setSaving(true);
        
        const htmlContent = generateEmailHtml(blocks, canvasBg);

        await new Promise(r => setTimeout(r, 600));
        const newTemplate: EmailTemplate = {
            id: templateId === 'new' || !templateId ? `TMP-${Date.now()}` : templateId,
            name: templateName,
            category,
            thumbnail: "https://placehold.co/600x400",
            contentHtml: htmlContent,
            designJson: JSON.stringify(blocks),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'Current User',
            usageCount: 0,
        };
        if (!templateId || templateId === 'new') TemplateStore.add(newTemplate);
        else TemplateStore.update(newTemplate);
        setSaving(false);
        push({ title: "Saved", variant: "success" });
        if(!templateId || templateId === 'new') navigate(`/marketing/channel/email/templates/${newTemplate.id}/edit`);
    };

    const handleExport = () => {
         const htmlContent = generateEmailHtml(blocks, canvasBg);
         const blob = new Blob([htmlContent], { type: "text/html" });
         const url = URL.createObjectURL(blob);
         const a = document.createElement("a");
         a.href = url;
         a.download = `${templateName.replace(/\s+/g, '_')}.html`;
         document.body.appendChild(a);
         a.click();
         document.body.removeChild(a);
         URL.revokeObjectURL(url);
         push({ title: "Exported", description: "HTML file downloaded.", variant: "success" });
    };

    // --- DnD Logic ---
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => setActiveDragItem(event.active.data.current);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragItem(null);
        if (!over) return;

        if (active.data.current?.isTool) {
             const type = active.data.current.type as BlockType;
             const newBlock = getDefaultBlock(type);
             const newBlocks = [...blocks];
             
             if (over.id === 'canvas-droppable') {
                 newBlocks.push(newBlock);
             } else {
                 const idx = blocks.findIndex(b => b.id === over.id);
                 if (idx !== -1) newBlocks.splice(idx + 1, 0, newBlock);
                 else newBlocks.push(newBlock);
             }
             updateBlocks(newBlocks);
             setSelectedBlockId(newBlock.id);
        } else if (active.id !== over.id) {
            const oldIndex = blocks.findIndex(b => b.id === active.id);
            const newIndex = blocks.findIndex(b => b.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1) moveBlock(oldIndex, newIndex);
        }
    };

    const selectedBlock = blocks.find(b => b.id === selectedBlockId) || null;

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex flex-col h-screen bg-gray-50 dark:bg-black overflow-hidden">
                {/* Top Bar */}
                <header className="h-14 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 flex items-center justify-between shrink-0 z-30">
                     <div className="flex items-center gap-4">
                         <Button variant="ghost" size="icon" onClick={() => navigate('/marketing/channel/email')} className="text-gray-500 h-8 w-8">
                             <Icon name="arrowLeft" className="w-4 h-4" />
                         </Button>
                         <div className="h-6 w-px bg-gray-200 dark:bg-zinc-700"></div>
                         <div className="flex items-center gap-2">
                             <Input value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="h-8 bg-transparent border-none font-bold text-sm w-48 focus-visible:ring-0" />
                         </div>
                     </div>
                     <div className="flex items-center gap-2">
                         <div className="flex items-center bg-gray-100 dark:bg-zinc-800 p-0.5 rounded-lg mr-2">
                             <button onClick={() => setPreviewMode('desktop')} className={cn("p-1.5 rounded-md transition-all", previewMode === 'desktop' ? "bg-white dark:bg-zinc-600 shadow text-gray-900" : "text-gray-400 hover:text-gray-600")}><Icon name="image" className="w-4 h-4"/></button>
                             <button onClick={() => setPreviewMode('mobile')} className={cn("p-1.5 rounded-md transition-all", previewMode === 'mobile' ? "bg-white dark:bg-zinc-600 shadow text-gray-900" : "text-gray-400 hover:text-gray-600")}><Icon name="phone" className="w-4 h-4"/></button>
                         </div>
                         <div className="flex items-center gap-1 mr-2">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500" onClick={handleUndo} disabled={historyIndex <= 0}><Icon name="chevronLeft" className="w-4 h-4"/></Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500" onClick={handleRedo} disabled={historyIndex >= history.length - 1}><Icon name="chevronRight" className="w-4 h-4"/></Button>
                         </div>
                         <Button variant="outline" size="sm" onClick={handleExport} className="h-8 text-xs">
                             <Icon name="download" className="w-3 h-3 mr-2" /> Export
                         </Button>
                         <Button variant="outline" size="sm" onClick={() => setIsTestModalOpen(true)} className="h-8 text-xs">
                             <Icon name="send" className="w-3 h-3 mr-2" /> Test
                         </Button>
                         <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700 text-white shadow-sm h-8 text-xs">
                             {saving ? <Icon name="refreshCw" className="w-3 h-3 animate-spin" /> : "Save Template"}
                         </Button>
                     </div>
                </header>

                {/* Panels */}
                <div className="flex-1 flex overflow-hidden relative">
                    <SidebarToolbox onApplyPreset={applyPreset} />
                    
                    <EditorCanvas 
                        blocks={blocks} 
                        previewMode={previewMode} 
                        canvasBg={canvasBg}
                        selectedBlockId={selectedBlockId}
                        onSelectBlock={setSelectedBlockId}
                        onMoveUp={(idx) => idx > 0 && moveBlock(idx, idx - 1)}
                        onMoveDown={(idx) => idx < blocks.length - 1 && moveBlock(idx, idx + 1)}
                        onDuplicate={duplicateBlock}
                        onDelete={deleteBlock}
                        onResizeBlock={(id, h) => updateBlock(id, 'styles', 'height', h)}
                        activeDragItem={activeDragItem}
                    />

                    <PropertiesPanel 
                        selectedBlock={selectedBlock} 
                        updateBlock={updateBlock}
                        canvasBg={canvasBg}
                        setCanvasBg={setCanvasBg}
                        onDeselect={() => setSelectedBlockId(null)}
                    />
                </div>

                <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }}>
                    {activeDragItem?.isTool ? (
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 text-xs font-bold cursor-grabbing transform scale-105 ring-2 ring-white">
                             <Icon name="plus" className="w-3 h-3" /> Add {activeDragItem.label}
                        </div>
                    ) : null}
                </DragOverlay>

                <SendTestEmailModal isOpen={isTestModalOpen} onClose={() => setIsTestModalOpen(false)} templateName={templateName} />
            </div>
        </DndContext>
    );
};

export default EmailTemplateEditorPage;
