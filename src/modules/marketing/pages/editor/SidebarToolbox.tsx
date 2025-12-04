
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '../../../../lib/utils';
import { Icon } from '../../../../components/shared/Icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/Tabs';
import type { BlockType } from './editorTypes';
import { EMAIL_PRESETS, EmailPreset } from './emailPresets';

const TOOLBOX_ITEMS: { type: BlockType; label: string; icon: string }[] = [
  { type: 'header', label: 'Header', icon: 'type' },
  { type: 'text', label: 'Text', icon: 'fileText' },
  { type: 'image', label: 'Image', icon: 'image' },
  { type: 'button', label: 'Button', icon: 'mousePointer' },
  { type: 'social', label: 'Social', icon: 'share' },
  { type: 'divider', label: 'Divider', icon: 'minus' },
  { type: 'spacer', label: 'Spacer', icon: 'maximize' },
  { type: 'html', label: 'HTML', icon: 'code' },
  { type: '2-col', label: '2 Columns', icon: 'grid' },
  { type: '3-col', label: '3 Columns', icon: 'list' },
];

const DraggableTool: React.FC<{ type: BlockType; label: string; icon: string }> = ({ type, label, icon }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `tool-${type}`,
    data: { type, isTool: true, label }
  });
  
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  
  return (
    <div 
        ref={setNodeRef} 
        style={style} 
        {...listeners} 
        {...attributes} 
        className={cn(
            "flex flex-col items-center justify-center p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl cursor-grab hover:shadow-md hover:border-blue-500 hover:text-blue-500 transition-all active:cursor-grabbing h-20 select-none group",
            isDragging && "opacity-50 z-50 ring-2 ring-blue-500"
        )}
    >
      <Icon name={icon as any} className="w-5 h-5 text-gray-500 dark:text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{label}</span>
    </div>
  );
};

const PresetCard: React.FC<{ preset: EmailPreset; onClick: () => void }> = ({ preset, onClick }) => {
    return (
        <button 
            type="button"
            onClick={onClick}
            className="w-full flex flex-col text-left p-3 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-blue-500 hover:shadow-md bg-white dark:bg-zinc-800 transition-all group relative overflow-hidden"
        >
            <div className="flex items-center justify-between w-full mb-2">
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600">{preset.name}</span>
            </div>
            
            {/* Mini Layout Preview */}
            <div className="w-full h-12 bg-gray-50 dark:bg-zinc-900 rounded border border-gray-100 dark:border-zinc-700 mb-2 p-1.5 flex flex-col gap-1 overflow-hidden opacity-70 group-hover:opacity-100 pointer-events-none">
                {preset.blocks.slice(0, 3).map((b, i) => (
                    <div 
                        key={i} 
                        className={cn(
                            "w-full rounded-sm bg-gray-200 dark:bg-zinc-700",
                            b.type === 'header' ? "h-1.5 w-3/4 mb-0.5" :
                            b.type === 'image' ? "h-4 w-full" :
                            b.type === '2-col' ? "h-4 w-full grid grid-cols-2 gap-1" :
                            "h-1 w-full"
                        )}
                    >
                         {b.type === '2-col' && (
                             <>
                                <div className="bg-gray-300 dark:bg-zinc-600 h-full w-full rounded-sm" />
                                <div className="bg-gray-300 dark:bg-zinc-600 h-full w-full rounded-sm" />
                             </>
                         )}
                    </div>
                ))}
            </div>

            <span className="text-[10px] text-gray-500 leading-tight line-clamp-2">{preset.description}</span>
            
            <div className="absolute top-0 right-0 px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-700 rounded-bl-md text-[9px] text-gray-500 font-medium">
                {preset.category}
            </div>
        </button>
    );
};

interface SidebarToolboxProps {
    onApplyPreset: (presetId: string) => void;
}

const SidebarToolbox: React.FC<SidebarToolboxProps> = ({ onApplyPreset }) => {
    return (
        <div className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
                <div className="px-4 pt-4">
                    <TabsList className="w-full grid grid-cols-2 h-8 p-0.5 bg-gray-100 dark:bg-zinc-800 rounded-lg">
                        <TabsTrigger value="blocks" className="text-[10px] h-full rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700">Blocks</TabsTrigger>
                        <TabsTrigger value="layouts" className="text-[10px] h-full rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700">Layouts</TabsTrigger>
                    </TabsList>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                    <TabsContent value="blocks" className="mt-0 space-y-6">
                        <div>
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Content</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {TOOLBOX_ITEMS.slice(0, 5).map(item => (
                                    <DraggableTool key={item.type} type={item.type} label={item.label} icon={item.icon} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Structure</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {TOOLBOX_ITEMS.slice(5).map(item => (
                                    <DraggableTool key={item.type} type={item.type} label={item.label} icon={item.icon} />
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="layouts" className="mt-0 space-y-4">
                            <div className="grid grid-cols-1 gap-3">
                                {EMAIL_PRESETS.map(preset => (
                                    <PresetCard 
                                        key={preset.id} 
                                        preset={preset} 
                                        onClick={() => onApplyPreset(preset.id)} 
                                    />
                                ))}
                            </div>
                            
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 text-[10px] text-blue-700 dark:text-blue-300 mt-4 leading-relaxed">
                                <Icon name="info" className="w-3 h-3 inline mr-1 -mt-0.5" />
                                <strong>Tip:</strong> Applying a layout will replace all content.
                            </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default SidebarToolbox;
