
import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from '../../../../components/ui/Drawer';
import { Button } from '../../../../components/ui/Button';
import { Icon } from '../../../../components/shared/Icon';
import type { EmailTemplate } from '../../../../types';
import { cn } from '../../../../lib/utils';

interface TemplatePreviewModalProps {
    template: EmailTemplate | null;
    open: boolean;
    onClose: () => void;
    onUseTemplate: (template: EmailTemplate) => void;
    onEditTemplate: (template: EmailTemplate) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({ 
    template, 
    open, 
    onClose,
    onUseTemplate,
    onEditTemplate
}) => {
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

    if (!template) return null;

    // Mock renderer - in real app would reuse the renderer from editor
    const renderContent = () => {
        try {
            const blocks = JSON.parse(template.designJson);
            if (!Array.isArray(blocks)) return <div className="p-8 text-center text-gray-500">Invalid template data</div>;
            
            return (
                <div className="bg-white min-h-full shadow-sm">
                     {blocks.map((block: any) => (
                        <div key={block.id} style={{ 
                            padding: `${block.styles.paddingTop}px ${block.styles.paddingRight}px ${block.styles.paddingBottom}px ${block.styles.paddingLeft}px`, 
                            textAlign: block.styles.textAlign,
                            backgroundColor: block.styles.backgroundColor 
                        }}>
                            {block.type === 'header' && <h2 style={{ fontSize: block.styles.fontSize, fontWeight: block.styles.fontWeight, color: block.styles.color }}>{block.content.text}</h2>}
                            {block.type === 'text' && <div style={{ fontSize: block.styles.fontSize, color: block.styles.color }} dangerouslySetInnerHTML={{__html: block.content.text}} />}
                            {block.type === 'image' && <img src={block.content.src} alt={block.content.alt} style={{ maxWidth: '100%', width: block.styles.width, borderRadius: block.styles.borderRadius }} />}
                            {block.type === 'button' && (
                                <a href={block.content.link} style={{ 
                                    display: 'inline-block', 
                                    backgroundColor: block.styles.backgroundColor, 
                                    color: block.styles.color, 
                                    padding: '12px 24px', 
                                    borderRadius: block.styles.borderRadius,
                                    textDecoration: 'none',
                                    fontWeight: 'bold'
                                }}>
                                    {block.content.text}
                                </a>
                            )}
                             {block.type === 'divider' && <hr style={{ borderTop: `${block.styles.borderWidth}px ${block.styles.borderStyle} ${block.styles.borderColor}`, margin: 0 }} />}
                        </div>
                    ))}
                </div>
            );
        } catch (e) {
            // Fallback for legacy HTML content
            return <div dangerouslySetInnerHTML={{ __html: template.contentHtml }} />;
        }
    };

    return (
        <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
            <DrawerContent className="w-full md:w-[900px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl" resizable showCloseButton={true}>
                <DrawerHeader className="border-b px-6 py-4 bg-white dark:bg-zinc-900 shrink-0 flex justify-between items-center">
                    <div>
                        <DrawerTitle>{template.name}</DrawerTitle>
                        <DrawerDescription>
                            Category: {template.category} • Used {template.usageCount} times
                        </DrawerDescription>
                    </div>
                    <div className="flex bg-gray-100 dark:bg-zinc-800 p-0.5 rounded-lg">
                        <button onClick={() => setViewMode('desktop')} className={cn("p-1.5 rounded transition-colors", viewMode === 'desktop' ? "bg-white dark:bg-zinc-600 shadow text-blue-600" : "text-gray-500")}><Icon name="image" className="w-4 h-4" /></button>
                        <button onClick={() => setViewMode('mobile')} className={cn("p-1.5 rounded transition-colors", viewMode === 'mobile' ? "bg-white dark:bg-zinc-600 shadow text-blue-600" : "text-gray-500")}><Icon name="phone" className="w-4 h-4" /></button>
                    </div>
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-zinc-950 flex justify-center p-8">
                    <div className={cn(
                        "transition-all duration-300 bg-white shadow-xl overflow-hidden",
                        viewMode === 'mobile' ? "w-[375px] min-h-[667px] rounded-[30px] border-8 border-gray-800" : "w-[600px] min-h-[800px]"
                    )}>
                        {viewMode === 'mobile' && <div className="h-6 bg-gray-800 w-32 mx-auto rounded-b-xl" />}
                        <div className="h-full overflow-auto">
                             {renderContent()}
                        </div>
                    </div>
                </div>

                <DrawerFooter className="border-t px-6 py-4 bg-white dark:bg-zinc-900 shrink-0 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                        Last updated: {new Date(template.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => onEditTemplate(template)}>
                            <Icon name="edit" className="w-4 h-4 mr-2" /> Edit Template
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onUseTemplate(template)}>
                            Use Template <Icon name="arrowRight" className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
