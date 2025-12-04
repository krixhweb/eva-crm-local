
import React, { useRef, useState, useEffect } from "react";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "../../../../components/shared/Icon";
import { cn } from "../../../../lib/utils";
import type { Block, ColumnData } from "./editorTypes";

// --- Icons ---
const SocialIcons: Record<string, React.FC<any>> = {
  facebook: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>,
  instagram: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  twitter: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>,
  linkedin: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  youtube: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>,
  website: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  whatsapp: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
};

const SortableBlockCanva: React.FC<{
  block: Block;
  index: number;
  blocksCount: number;
  selected: boolean;
  activeDragItem: any;
  previewMode: "desktop" | "mobile";
  onSelect: (id: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onResize?: (id: string, height: number) => void;
}> = ({ block, index, blocksCount, selected, activeDragItem, previewMode, onSelect, onDelete, onDuplicate, onMoveUp, onMoveDown, onResize }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id, data: block });
  const [hover, setHover] = useState(false);
  const isMobile = previewMode === 'mobile';
  
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    zIndex: isDragging ? 1000 : selected ? 50 : 1,
    position: 'relative',
  };

  // --- Mobile Scaling Factors ---
  const mobileScale = isMobile ? 0.85 : 1; // Scale font size
  const paddingScale = isMobile ? 0.7 : 1; // Scale padding

  // Spacer resizing logic
  const resizingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef<number | null>(null);
  const [liveHeight, setLiveHeight] = useState<number | null>(block.type === 'spacer' ? (block.styles.height || 32) : null);

  useEffect(() => {
      if (block.type === 'spacer') setLiveHeight(block.styles.height || 32);
  }, [block.styles.height, block.type]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (block.type !== 'spacer') return;
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = liveHeight;
    document.body.style.cursor = "ns-resize";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!resizingRef.current) return;
    const delta = e.clientY - startYRef.current;
    const newH = Math.max(10, (startHeightRef.current || 32) + delta);
    setLiveHeight(newH);
  };

  const handleMouseUp = () => {
    if (!resizingRef.current) return;
    resizingRef.current = false;
    if (onResize && liveHeight) onResize(block.id, liveHeight);
    document.body.style.cursor = "";
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const renderContent = () => {
    const s = block.styles;
    const c = block.content;
    
    const commonStyles: React.CSSProperties = {
        paddingTop: s.paddingTop * paddingScale,
        paddingRight: s.paddingRight * paddingScale,
        paddingBottom: s.paddingBottom * paddingScale,
        paddingLeft: s.paddingLeft * paddingScale,
        marginTop: s.marginTop * paddingScale,
        marginBottom: s.marginBottom * paddingScale,
        backgroundColor: s.backgroundColor,
        textAlign: s.textAlign as any,
        fontFamily: s.fontFamily,
        color: s.color,
        lineHeight: s.lineHeight,
        fontSize: s.fontSize ? `${s.fontSize * mobileScale}px` : undefined,
        fontWeight: s.fontWeight,
    };

    // Helper for Column Render (Nested)
    const renderColumn = (colData: ColumnData, index: number) => (
        <div 
            key={index} 
            style={{ 
                padding: colData.padding * paddingScale, 
                backgroundColor: colData.backgroundColor, 
                textAlign: colData.textAlign,
                flex: 1,
                minWidth: 0, 
                borderRadius: colData.borderRadius,
                border: colData.border
            }}
            className="transition-colors"
        >
            {colData.hasImage && colData.imageSrc && (
                <div style={{ marginBottom: 12 * paddingScale }}>
                     <img 
                        src={colData.imageSrc} 
                        alt={colData.imageAlt} 
                        style={{ 
                            width: colData.imageWidth ? `${colData.imageWidth}%` : '100%', 
                            maxWidth: '100%', 
                            height: 'auto', 
                            borderRadius: 4, 
                            objectFit: 'cover',
                            display: 'inline-block' // For center alignment
                        }} 
                     />
                </div>
            )}
            {(colData.headerText || colData.bodyText || colData.price) && (
                <div style={{ marginBottom: colData.hasButton ? 12 * paddingScale : 0 }}>
                    {colData.headerText && <h4 style={{ margin: '0 0 4px', fontSize: `${18 * mobileScale}px`, fontWeight: 'bold', color: '#111' }}>{colData.headerText}</h4>}
                    {colData.price && <div style={{ fontWeight: 'bold', color: '#16a34a', marginBottom: '4px', fontSize: `${16 * mobileScale}px` }}>{colData.price}</div>}
                    {colData.bodyText && <div style={{ fontSize: `${14 * mobileScale}px`, color: '#555', whiteSpace: 'pre-line' }}>{colData.bodyText}</div>}
                </div>
            )}
            {colData.hasButton && (
                <div>
                    <a href={colData.buttonLink} style={{ 
                        display: 'inline-block', 
                        padding: `${10 * paddingScale}px ${20 * paddingScale}px`, 
                        backgroundColor: colData.buttonColor || '#3b82f6', 
                        color: colData.buttonTextColor || '#fff', 
                        borderRadius: 4, 
                        textDecoration: 'none', 
                        fontSize: `${14 * mobileScale}px`, 
                        fontWeight: 600 
                    }}>
                        {colData.buttonText}
                    </a>
                </div>
            )}
        </div>
    );

    switch (block.type) {
      case "header":
        const Tag = c.tag || 'h1';
        return <Tag style={{ margin: 0, ...commonStyles }}>{c.text}</Tag>;
      
      case "text":
        return <div style={commonStyles} dangerouslySetInnerHTML={{ __html: c.text || "" }} />;
      
      case "image":
        return (
            <div style={{ ...commonStyles, lineHeight: 0 }}>
                {c.src ? (
                    <img 
                        src={c.src} 
                        alt={c.alt || "Image"} 
                        style={{ 
                            width: s.width || "100%", 
                            maxWidth: '100%', 
                            display: "inline-block", 
                            borderRadius: s.borderRadius, 
                            objectFit: s.objectFit 
                        }} 
                    />
                ) : (
                    <div className="h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
                        <Icon name="image" className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs font-medium">Upload Image</span>
                    </div>
                )}
            </div>
        );

      case "button":
        return (
            <div style={commonStyles}>
                <a 
                    href={c.link || "#"} 
                    onClick={(e) => e.preventDefault()} 
                    style={{ 
                        display: isMobile || s.fullWidth ? "block" : "inline-block",
                        backgroundColor: s.backgroundColor,
                        color: s.color,
                        borderRadius: s.borderRadius,
                        padding: `${12 * paddingScale}px ${24 * paddingScale}px`,
                        textDecoration: "none",
                        fontWeight: "bold",
                        width: isMobile || s.fullWidth ? "100%" : "auto",
                        boxSizing: "border-box"
                    }}
                >
                    {c.text}
                </a>
            </div>
        );

      case "divider":
        return (
            <div style={{ ...commonStyles, lineHeight: 0 }}>
                <hr style={{ 
                    border: "none",
                    borderTopWidth: s.borderWidth || 1,
                    borderTopStyle: s.borderStyle || "solid" as any,
                    borderTopColor: s.borderColor || "#e5e7eb",
                    width: s.width || "100%",
                    margin: "0 auto"
                }} />
            </div>
        );

      case "spacer":
        return (
            <div style={{ height: (liveHeight ?? 32) * (isMobile ? 0.6 : 1), backgroundColor: s.backgroundColor, transition: 'height 0.1s' }} className="relative group/spacer">
                {selected && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-[10px] bg-gray-800 text-white px-1.5 py-0.5 rounded opacity-0 group-hover/spacer:opacity-100 transition-opacity">
                            {Math.round((liveHeight ?? 32) * (isMobile ? 0.6 : 1))}px
                        </span>
                    </div>
                )}
            </div>
        );

      case "social":
        return (
            <div style={commonStyles}>
                <div style={{ display: "inline-flex", gap: (s.gap ?? 8) * paddingScale, alignItems: "center" }}>
                    {(c.socials || []).filter((x: any) => x.enabled).map((sn: any) => {
                        const IconComp = SocialIcons[sn.platform] || null;
                        const size = (s.iconSize || 32) * (isMobile ? 0.75 : 1);
                        const borderRadius = s.iconStyle === 'circle' ? '50%' : s.iconStyle === 'rounded' ? '4px' : '0px';
                        const bg = s.iconStyle === 'outline' ? 'transparent' : s.color || '#333';
                        const fg = s.iconStyle === 'outline' ? s.color || '#333' : '#fff';
                        const border = s.iconStyle === 'outline' ? `1px solid ${s.color || '#333'}` : 'none';
                        
                        return (
                            <div key={sn.id} style={{ width: size, height: size, backgroundColor: bg, color: fg, borderRadius, border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {IconComp && <IconComp style={{ width: size * 0.6, height: size * 0.6 }} />}
                            </div>
                        );
                    })}
                </div>
            </div>
        );

      case "html":
        return (
            <div style={commonStyles}>
                {c.html ? (
                    <div dangerouslySetInnerHTML={{ __html: c.html }} />
                ) : (
                    <div className="p-4 bg-gray-100 border border-dashed border-gray-300 text-center text-xs font-mono text-gray-500">
                        Empty HTML Block
                    </div>
                )}
            </div>
        );
      
      case "2-col":
        return (
             <div style={{ 
                 ...commonStyles, 
                 display: 'flex', 
                 flexDirection: isMobile ? 'column' : 'row',
                 gap: (s.gap || 16) * paddingScale 
             }}>
                 {c.columns?.slice(0, 2).map((col, i) => renderColumn(col, i))}
             </div>
        );

      case "3-col":
        return (
             <div style={{ 
                 ...commonStyles, 
                 display: 'flex', 
                 flexDirection: isMobile ? 'column' : 'row',
                 gap: (s.gap || 16) * paddingScale
             }}>
                  {c.columns?.slice(0, 3).map((col, i) => renderColumn(col, i))}
             </div>
        );

      default:
        return <div className="p-4 text-red-500">Unknown Block Type</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "relative transition-all duration-200 group mb-1", 
        selected ? "z-20" : "hover:z-10"
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => { e.stopPropagation(); onSelect(block.id); }}
    >
        {/* Selection Indicators */}
        <div className={cn(
            "absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l transition-opacity duration-200",
            selected ? "opacity-100" : "opacity-0"
        )} />

        <div className={cn(
            "absolute inset-0 border-2 rounded pointer-events-none transition-all duration-200",
            selected ? "border-green-500" : hover ? "border-green-500/30" : "border-transparent"
        )} />

        {/* Rendered Block */}
        <div className={cn(
            "bg-transparent transition-transform duration-200 ease-out origin-center",
            hover && !selected && "scale-[1.005]" 
        )}>
            {renderContent()}
        </div>

        {/* Toolbar */}
        {!isMobile && (
            <div className={cn(
                "absolute -top-10 right-0 flex items-center gap-1 px-1.5 py-1 bg-gray-900 text-white rounded-full shadow-xl transform transition-all duration-200 origin-bottom",
                (selected || hover) ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-90 pointer-events-none"
            )}>
                <div {...listeners} className="p-1.5 hover:bg-gray-700 rounded-full cursor-grab active:cursor-grabbing">
                    <Icon name="grid" className="w-4 h-4 text-gray-300" />
                </div>
                <div className="w-px h-4 bg-gray-700 mx-0.5" />
                <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} className="p-1.5 hover:bg-gray-700 rounded-full disabled:opacity-30 disabled:cursor-not-allowed" disabled={index === 0}>
                    <Icon name="arrowUp" className="w-3.5 h-3.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} className="p-1.5 hover:bg-gray-700 rounded-full disabled:opacity-30 disabled:cursor-not-allowed" disabled={index === blocksCount - 1}>
                    <Icon name="arrowDown" className="w-3.5 h-3.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="p-1.5 hover:bg-gray-700 rounded-full">
                    <Icon name="copy" className="w-3.5 h-3.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 hover:bg-red-900/50 text-red-400 rounded-full">
                    <Icon name="trash" className="w-3.5 h-3.5" />
                </button>
            </div>
        )}

        {/* Spacer Handle */}
        {block.type === 'spacer' && selected && !isMobile && (
             <div 
                onMouseDown={handleMouseDown}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-4 bg-white border border-gray-300 rounded-full shadow-sm flex items-center justify-center cursor-ns-resize hover:scale-110 transition-transform z-30"
             >
                 <div className="w-4 h-0.5 bg-gray-400 rounded-full" />
             </div>
        )}

        {/* Drop Indicator */}
        {activeDragItem && (
             <div className={cn(
                 "absolute h-1 bg-blue-500 rounded-full transition-opacity duration-200 left-0 right-0 z-50 pointer-events-none",
                 activeDragItem.id !== block.id ? "opacity-0" : "opacity-100" 
             )} />
        )}
    </div>
  );
};

const EditorCanvas: React.FC<{
  blocks: Block[];
  previewMode: "desktop" | "mobile";
  canvasBg?: string;
  selectedBlockId?: string | null;
  onSelectBlock: (id: string | null) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onResizeBlock?: (id: string, height: number) => void;
  activeDragItem?: any;
}> = ({ blocks, previewMode, canvasBg = "#ffffff", selectedBlockId, onSelectBlock, onMoveUp, onMoveDown, onDuplicate, onDelete, onResizeBlock, activeDragItem }) => {
  return (
    <div 
        className="flex-1 bg-gray-100/50 dark:bg-zinc-950/80 overflow-y-auto flex justify-center py-8 relative scroll-smooth"
        onClick={() => onSelectBlock(null)}
    >
      <div
        id="canvas-droppable"
        className={cn(
          "bg-white transition-all duration-500 shadow-2xl flex flex-col min-h-[600px] relative mx-auto",
          previewMode === "mobile" ? "w-[375px] rounded-[40px] border-[12px] border-gray-900 overflow-hidden my-8 ring-4 ring-gray-300 dark:ring-gray-800" : "w-[600px] my-8 rounded-sm"
        )}
        style={{ backgroundColor: canvasBg }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Notch Simulation */}
        {previewMode === 'mobile' && (
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-50 pointer-events-none"></div>
        )}
        
        {/* Mobile Status Bar Area (Visual Only) */}
        {previewMode === 'mobile' && (
            <div className="h-8 bg-gray-100 dark:bg-zinc-900 w-full flex justify-between items-center px-6 text-[10px] font-bold text-gray-500 select-none">
                <span>9:41</span>
                <div className="flex gap-1">
                    <Icon name="search" className="w-3 h-3" />
                    <div className="w-4 h-2.5 border border-gray-400 rounded-sm bg-gray-400" />
                </div>
            </div>
        )}

        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
          <div className={cn("flex-1 flex flex-col min-h-full", previewMode === 'mobile' ? "pb-12" : "pb-20 pt-2")}>
            {blocks.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 m-4 rounded-xl p-12">
                <Icon name="image" className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-sm font-medium text-gray-400">Drag & drop blocks or apply a layout</p>
              </div>
            )}

            {blocks.map((block, i) => (
              <SortableBlockCanva
                key={block.id}
                block={block}
                index={i}
                blocksCount={blocks.length}
                selected={selectedBlockId === block.id}
                activeDragItem={activeDragItem}
                previewMode={previewMode}
                onSelect={onSelectBlock}
                onDelete={() => onDelete(block.id)}
                onDuplicate={() => onDuplicate(block.id)}
                onMoveUp={() => i > 0 && onMoveUp(i)}
                onMoveDown={() => i < blocks.length - 1 && onMoveDown(i)}
                onResize={onResizeBlock}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default EditorCanvas;
