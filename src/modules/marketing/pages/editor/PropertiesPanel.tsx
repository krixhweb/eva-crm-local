
import React, { useRef, useState } from "react";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Label } from "../../../../components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/Select";
import { Textarea } from "../../../../components/ui/Textarea";
import { Switch } from "../../../../components/ui/Switch";
import { Icon } from "../../../../components/shared/Icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/Tabs";
import { cn } from "../../../../lib/utils";
import type { Block, SocialNetwork, ColumnData } from "./editorTypes";

// --- Constants ---
const FONT_FAMILIES = [
  { label: "System Sans", value: "Inter, sans-serif" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Monospace", value: "Courier New, monospace" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
];

const WEIGHTS = ["300", "400", "500", "600", "700", "800", "900"];

interface PropertiesPanelProps {
  selectedBlock: Block | null;
  updateBlock: (id: string, path: "content" | "styles", key: string, value: any) => void;
  canvasBg: string;
  setCanvasBg: (bg: string) => void;
  onDeselect: () => void;
}

const ColorPicker = ({ value, onChange }: { value?: string, onChange: (val: string) => void }) => (
    <div className="flex items-center gap-2 h-9 w-full">
        <div className="relative w-9 h-9 rounded-md border overflow-hidden shadow-sm shrink-0">
            <input 
                type="color" 
                value={value || '#000000'} 
                onChange={(e) => onChange(e.target.value)} 
                className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
            />
        </div>
        <Input 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            className="font-mono text-xs h-9" 
            placeholder="#000000"
        />
    </div>
);

const SliderControl = ({ label, value, min = 0, max = 100, step = 1, unit = "px", onChange }: any) => (
    <div className="space-y-2">
        <div className="flex justify-between">
            <Label className="text-xs text-gray-500 font-medium">{label}</Label>
            <span className="text-xs font-mono text-gray-400">{value}{unit}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={typeof value === 'string' ? parseInt(value) : value || 0}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
    </div>
);

// Helper for Column Editing in Properties Panel
const ColumnEditor = ({ data, onChange }: { data: ColumnData, onChange: (d: ColumnData) => void }) => {
    return (
        <div className="space-y-5 pb-4">
            {/* Image Section */}
            <div className="space-y-3 bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-lg border dark:border-zinc-700">
                <div className="flex items-center justify-between">
                    <Label className="cursor-pointer text-xs font-bold uppercase text-gray-500">Image</Label>
                    <Switch checked={data.hasImage} onClick={() => onChange({ ...data, hasImage: !data.hasImage })} />
                </div>
                {data.hasImage && (
                    <>
                        <Input 
                            placeholder="Image URL" 
                            value={data.imageSrc} 
                            onChange={e => onChange({ ...data, imageSrc: e.target.value })} 
                            className="text-xs"
                        />
                        <SliderControl label="Width %" value={data.imageWidth || 100} max={100} unit="%" onChange={(v: number) => onChange({ ...data, imageWidth: v })} />
                    </>
                )}
            </div>

            {/* Text Content */}
            <div className="space-y-3">
                <Label className="text-xs font-bold uppercase text-gray-500">Text</Label>
                <Input 
                    placeholder="Heading" 
                    value={data.headerText} 
                    onChange={e => onChange({ ...data, headerText: e.target.value })} 
                    className="font-bold"
                />
                <Textarea 
                    placeholder="Description text..." 
                    value={data.bodyText} 
                    onChange={e => onChange({ ...data, bodyText: e.target.value })}
                    className="min-h-[60px] text-xs"
                />
                 <Input 
                    placeholder="Price Tag (e.g. $49.99)" 
                    value={data.price || ''} 
                    onChange={e => onChange({ ...data, price: e.target.value })}
                    className="text-xs font-mono text-green-600" 
                />
            </div>

            {/* Button Section */}
            <div className="space-y-3 bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-lg border dark:border-zinc-700">
                <div className="flex items-center justify-between">
                    <Label className="cursor-pointer text-xs font-bold uppercase text-gray-500">Button</Label>
                    <Switch checked={data.hasButton} onClick={() => onChange({ ...data, hasButton: !data.hasButton })} />
                </div>
                {data.hasButton && (
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                            <Input 
                                placeholder="Label" 
                                value={data.buttonText} 
                                onChange={e => onChange({ ...data, buttonText: e.target.value })} 
                                className="text-xs"
                            />
                            <Input 
                                placeholder="Link" 
                                value={data.buttonLink} 
                                onChange={e => onChange({ ...data, buttonLink: e.target.value })} 
                                className="text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                             <Label className="text-[10px] text-gray-400">Button Color</Label>
                             <ColorPicker value={data.buttonColor} onChange={(v) => onChange({ ...data, buttonColor: v })} />
                        </div>
                    </div>
                )}
            </div>
            
            {/* Column Style */}
            <div className="space-y-3 border-t pt-4 dark:border-zinc-700">
                 <h4 className="text-[10px] font-bold uppercase text-gray-400">Column Styling</h4>
                 <div className="space-y-2">
                    <Label className="text-xs">Background</Label>
                    <ColorPicker value={data.backgroundColor} onChange={(v) => onChange({ ...data, backgroundColor: v })} />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs">Alignment</Label>
                     <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-md">
                        {['left', 'center', 'right'].map((align: any) => (
                            <button
                                key={align}
                                onClick={() => onChange({ ...data, textAlign: align })}
                                className={cn(
                                    "flex-1 py-1 rounded-sm flex justify-center",
                                    data.textAlign === align ? "bg-white dark:bg-zinc-600 shadow text-blue-600" : "text-gray-500"
                                )}
                            >
                                <Icon name={`align-${align}` as any} className="w-3 h-3" />
                            </button>
                        ))}
                    </div>
                </div>
                <SliderControl label="Inner Padding" value={data.padding} max={60} onChange={(v: number) => onChange({ ...data, padding: v })} />
            </div>
        </div>
    );
};

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBlock,
  updateBlock,
  canvasBg,
  setCanvasBg,
  onDeselect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newSocialPlatform, setNewSocialPlatform] = useState<SocialNetwork['platform']>("facebook");

  // --- No Selection State ---
  if (!selectedBlock) {
    return (
      <div className="w-80 bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 flex flex-col h-full">
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
            <h3 className="text-sm font-bold">Global Settings</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label>Canvas Background</Label>
            <ColorPicker value={canvasBg} onChange={setCanvasBg} />
          </div>
          <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-dashed border-gray-200 dark:border-zinc-700 text-center">
              <p className="text-sm text-gray-500">Select a block on the canvas to edit its properties.</p>
          </div>
        </div>
      </div>
    );
  }

  const s = selectedBlock.styles;
  const c = selectedBlock.content;

  // --- Content Tab Rendering ---
  const renderContentSettings = () => {
      switch (selectedBlock.type) {
          case 'header':
              return (
                  <div className="space-y-4">
                      <div className="space-y-2">
                          <Label>Heading Text</Label>
                          <Input value={c.text} onChange={e => updateBlock(selectedBlock.id, 'content', 'text', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                          <Label>Tag</Label>
                          <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-md">
                              {['h1', 'h2', 'h3'].map(tag => (
                                  <button
                                    key={tag}
                                    onClick={() => updateBlock(selectedBlock.id, 'content', 'tag', tag)}
                                    className={cn(
                                        "flex-1 text-xs font-medium py-1.5 rounded-sm uppercase",
                                        c.tag === tag ? "bg-white dark:bg-zinc-600 shadow text-blue-600" : "text-gray-500"
                                    )}
                                  >
                                      {tag}
                                  </button>
                              ))}
                          </div>
                      </div>
                      <div className="space-y-2">
                          <Label>Alignment</Label>
                          <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-md">
                              {['left', 'center', 'right'].map(align => (
                                  <button
                                    key={align}
                                    onClick={() => updateBlock(selectedBlock.id, 'styles', 'textAlign', align)}
                                    className={cn(
                                        "flex-1 py-1.5 rounded-sm flex justify-center",
                                        s.textAlign === align ? "bg-white dark:bg-zinc-600 shadow text-blue-600" : "text-gray-500"
                                    )}
                                  >
                                      <Icon name={`align-${align}` as any} className="w-4 h-4" />
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>
              );
          case 'text':
              return (
                  <div className="space-y-4">
                      <div className="space-y-2">
                          <Label>Content</Label>
                          <Textarea rows={6} value={c.text} onChange={e => updateBlock(selectedBlock.id, 'content', 'text', e.target.value)} className="font-sans text-sm" />
                          <p className="text-[10px] text-gray-400">Basic HTML tags supported (&lt;b&gt;, &lt;i&gt;, &lt;br&gt;).</p>
                      </div>
                      <div className="space-y-2">
                          <Label>Alignment</Label>
                          <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-md">
                              {['left', 'center', 'right'].map(align => (
                                  <button
                                    key={align}
                                    onClick={() => updateBlock(selectedBlock.id, 'styles', 'textAlign', align)}
                                    className={cn(
                                        "flex-1 py-1.5 rounded-sm flex justify-center",
                                        s.textAlign === align ? "bg-white dark:bg-zinc-600 shadow text-blue-600" : "text-gray-500"
                                    )}
                                  >
                                      <Icon name={`align-${align}` as any} className="w-4 h-4" />
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>
              );
          case 'image':
              return (
                  <div className="space-y-6">
                      <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group">
                          <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                              const file = e.target.files?.[0];
                              if(file) {
                                  const reader = new FileReader();
                                  reader.onload = () => updateBlock(selectedBlock.id, 'content', 'src', reader.result);
                                  reader.readAsDataURL(file);
                              }
                          }}/>
                          <Icon name="upload" className="w-8 h-8 mx-auto text-gray-400 mb-2 group-hover:text-blue-500" />
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Click to upload</p>
                      </div>
                      <div className="space-y-2">
                          <Label>Image URL</Label>
                          <Input value={c.src} onChange={e => updateBlock(selectedBlock.id, 'content', 'src', e.target.value)} placeholder="https://" />
                      </div>
                      <div className="space-y-2">
                          <Label>Alt Text</Label>
                          <Input value={c.alt} onChange={e => updateBlock(selectedBlock.id, 'content', 'alt', e.target.value)} placeholder="Describe image" />
                      </div>
                  </div>
              );
          case 'button':
              return (
                  <div className="space-y-4">
                      <div className="space-y-2">
                          <Label>Button Text</Label>
                          <Input value={c.text} onChange={e => updateBlock(selectedBlock.id, 'content', 'text', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                          <Label>Link URL</Label>
                          <Input value={c.link} onChange={e => updateBlock(selectedBlock.id, 'content', 'link', e.target.value)} placeholder="https://" />
                      </div>
                      <div className="flex items-center justify-between pt-2">
                          <Label className="cursor-pointer" htmlFor="fullWidth">Full Width</Label>
                          <Switch id="fullWidth" checked={s.fullWidth} onClick={() => updateBlock(selectedBlock.id, 'styles', 'fullWidth', !s.fullWidth)} />
                      </div>
                       <div className="space-y-2">
                          <Label>Alignment</Label>
                          <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-md">
                              {['left', 'center', 'right'].map(align => (
                                  <button
                                    key={align}
                                    onClick={() => updateBlock(selectedBlock.id, 'styles', 'textAlign', align)}
                                    className={cn(
                                        "flex-1 py-1.5 rounded-sm flex justify-center",
                                        s.textAlign === align ? "bg-white dark:bg-zinc-600 shadow text-blue-600" : "text-gray-500"
                                    )}
                                  >
                                      <Icon name={`align-${align}` as any} className="w-4 h-4" />
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>
              );
          case 'divider':
               return (
                  <div className="space-y-4">
                      <div className="space-y-2">
                          <Label>Style</Label>
                          <Select value={s.borderStyle} onValueChange={(v) => updateBlock(selectedBlock.id, 'styles', 'borderStyle', v)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="solid">Solid</SelectItem>
                                  <SelectItem value="dashed">Dashed</SelectItem>
                                  <SelectItem value="dotted">Dotted</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="space-y-2">
                          <Label>Color</Label>
                          <ColorPicker value={s.borderColor} onChange={(v) => updateBlock(selectedBlock.id, 'styles', 'borderColor', v)} />
                      </div>
                      <SliderControl label="Thickness" value={s.borderWidth} min={1} max={10} onChange={(v: number) => updateBlock(selectedBlock.id, 'styles', 'borderWidth', v)} />
                      <div className="space-y-2">
                          <Label>Width</Label>
                          <Input value={s.width} onChange={(e) => updateBlock(selectedBlock.id, 'styles', 'width', e.target.value)} placeholder="e.g. 100% or 200px" />
                      </div>
                  </div>
               );
          case 'spacer':
              return (
                  <div className="space-y-4">
                      <SliderControl label="Height" value={s.height} min={10} max={300} onChange={(v: number) => updateBlock(selectedBlock.id, 'styles', 'height', v)} />
                      <div className="space-y-2">
                          <Label>Background</Label>
                          <ColorPicker value={s.backgroundColor} onChange={(v) => updateBlock(selectedBlock.id, 'styles', 'backgroundColor', v)} />
                      </div>
                  </div>
              );
           case 'social':
              return (
                  <div className="space-y-6">
                      <div className="space-y-3">
                          <Label>Add Network</Label>
                          <div className="flex gap-2">
                              <Select value={newSocialPlatform} onValueChange={(v) => setNewSocialPlatform(v as any)}>
                                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                      {['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'website', 'whatsapp'].map(p => (
                                          <SelectItem key={p} value={p}>
                                              <span className="capitalize">{p}</span>
                                          </SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                              <Button size="sm" className="h-9 w-9 p-0" onClick={() => {
                                  const newNet = { id: Math.random().toString(36).substr(2,9), platform: newSocialPlatform, url: 'https://', enabled: true };
                                  updateBlock(selectedBlock.id, 'content', 'socials', [...(c.socials || []), newNet]);
                              }}>
                                  <Icon name="plus" className="w-4 h-4" />
                              </Button>
                          </div>
                      </div>
                      
                      <div className="space-y-3">
                          {c.socials?.map((net: SocialNetwork) => (
                              <div key={net.id} className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 space-y-3">
                                  <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2 capitalize font-medium text-sm">
                                         {net.platform}
                                      </div>
                                      <div className="flex items-center gap-2">
                                          <Switch checked={net.enabled} onClick={() => {
                                              const updated = c.socials!.map(n => n.id === net.id ? { ...n, enabled: !n.enabled } : n);
                                              updateBlock(selectedBlock.id, 'content', 'socials', updated);
                                          }} />
                                          <button className="text-gray-400 hover:text-red-500" onClick={() => {
                                              const updated = c.socials!.filter(n => n.id !== net.id);
                                              updateBlock(selectedBlock.id, 'content', 'socials', updated);
                                          }}>
                                              <Icon name="trash" className="w-4 h-4" />
                                          </button>
                                      </div>
                                  </div>
                                  {net.enabled && (
                                      <Input className="h-8 text-xs" value={net.url} onChange={(e) => {
                                          const updated = c.socials!.map(n => n.id === net.id ? { ...n, url: e.target.value } : n);
                                          updateBlock(selectedBlock.id, 'content', 'socials', updated);
                                      }} />
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
              );
          case 'html':
              return (
                  <div className="space-y-4">
                      <Label>Custom HTML</Label>
                      <Textarea 
                          value={c.html} 
                          onChange={e => updateBlock(selectedBlock.id, 'content', 'html', e.target.value)} 
                          className="font-mono text-xs min-h-[300px] bg-zinc-900 text-green-400 border-zinc-800 p-3" 
                          placeholder="<div>Code here...</div>"
                      />
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-yellow-800">
                          ⚠️ Some email clients strip out complex HTML, CSS, and Scripts. Use inline styles.
                      </div>
                  </div>
              );
          case '2-col':
          case '3-col':
              const columns = c.columns || [];
              return (
                  <Tabs defaultValue="layout">
                       <TabsList className={`w-full grid grid-cols-${columns.length + 1} h-8 mb-4`}>
                           <TabsTrigger value="layout" className="text-[10px]">Layout</TabsTrigger>
                           {columns.map((_, i) => (
                               <TabsTrigger key={i} value={`col${i}`} className="text-[10px]">Col {i+1}</TabsTrigger>
                           ))}
                       </TabsList>
                       
                       <TabsContent value="layout" className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-gray-500">Global Settings</Label>
                                <SliderControl label="Gap" value={s.gap} max={50} onChange={(v: number) => updateBlock(selectedBlock.id, 'styles', 'gap', v)} />
                            </div>
                            <div className="space-y-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-xs text-blue-600 dark:text-blue-400">
                                <p><strong>Mobile Behavior:</strong> Columns will automatically stack vertically on mobile devices for better readability.</p>
                            </div>
                       </TabsContent>

                       {columns.map((col, i) => (
                           <TabsContent key={i} value={`col${i}`}>
                               <ColumnEditor 
                                   data={col} 
                                   onChange={(newData) => {
                                       const newCols = [...columns];
                                       newCols[i] = newData;
                                       updateBlock(selectedBlock.id, 'content', 'columns', newCols);
                                   }} 
                               />
                           </TabsContent>
                       ))}
                  </Tabs>
              );

          default:
              return <div className="text-center text-gray-400 py-10">No specific content options.</div>;
      }
  };

  // --- Styles Tab Rendering ---
  const renderStyleSettings = () => {
      return (
          <div className="space-y-8">
              
              {/* Typography (Text Only) */}
              {['header', 'text', 'button'].includes(selectedBlock.type) && (
                  <div className="space-y-4 border-b border-gray-100 dark:border-zinc-800 pb-6">
                      <h4 className="text-xs font-bold uppercase text-gray-500">Typography</h4>
                      <div className="space-y-2">
                          <Label>Font Family</Label>
                          <Select value={s.fontFamily} onValueChange={v => updateBlock(selectedBlock.id, 'styles', 'fontFamily', v)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                  {FONT_FAMILIES.map(f => <SelectItem key={f.value} value={f.value}><span style={{ fontFamily: f.value }}>{f.label}</span></SelectItem>)}
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label>Size (px)</Label>
                              <Input type="number" value={s.fontSize} onChange={e => updateBlock(selectedBlock.id, 'styles', 'fontSize', parseInt(e.target.value))} />
                          </div>
                           <div className="space-y-2">
                              <Label>Weight</Label>
                              <Select value={s.fontWeight} onValueChange={v => updateBlock(selectedBlock.id, 'styles', 'fontWeight', v)}>
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                      {WEIGHTS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                          </div>
                      </div>
                      <div className="space-y-2">
                          <Label>Text Color</Label>
                          <ColorPicker value={s.color} onChange={v => updateBlock(selectedBlock.id, 'styles', 'color', v)} />
                      </div>
                  </div>
              )}

              {/* Block Appearance */}
              <div className="space-y-4 border-b border-gray-100 dark:border-zinc-800 pb-6">
                   <h4 className="text-xs font-bold uppercase text-gray-500">Appearance</h4>
                   
                   {selectedBlock.type !== 'spacer' && (
                        <div className="space-y-2">
                            <Label>Background Color</Label>
                            <ColorPicker value={s.backgroundColor} onChange={v => updateBlock(selectedBlock.id, 'styles', 'backgroundColor', v)} />
                        </div>
                   )}

                   {['button', 'image'].includes(selectedBlock.type) && (
                       <SliderControl label="Border Radius" value={s.borderRadius} max={50} onChange={(v: number) => updateBlock(selectedBlock.id, 'styles', 'borderRadius', v)} />
                   )}

                   {selectedBlock.type === 'image' && (
                        <SliderControl label="Width (%)" value={parseInt(s.width || '100')} max={100} onChange={(v: number) => updateBlock(selectedBlock.id, 'styles', 'width', `${v}%`)} unit="%" />
                   )}
                   
                   {selectedBlock.type === 'social' && (
                       <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                               <Label>Icon Style</Label>
                               <Select value={s.iconStyle} onValueChange={v => updateBlock(selectedBlock.id, 'styles', 'iconStyle', v)}>
                                   <SelectTrigger><SelectValue /></SelectTrigger>
                                   <SelectContent>
                                       <SelectItem value="circle">Circle</SelectItem>
                                       <SelectItem value="rounded">Rounded</SelectItem>
                                       <SelectItem value="square">Square</SelectItem>
                                       <SelectItem value="outline">Outline</SelectItem>
                                   </SelectContent>
                               </Select>
                           </div>
                           <div className="space-y-2">
                               <Label>Icon Size</Label>
                               <Input type="number" value={s.iconSize} onChange={e => updateBlock(selectedBlock.id, 'styles', 'iconSize', parseInt(e.target.value))} />
                           </div>
                           <div className="col-span-2 space-y-2">
                               <Label>Icon Color</Label>
                               <ColorPicker value={s.color} onChange={v => updateBlock(selectedBlock.id, 'styles', 'color', v)} />
                           </div>
                       </div>
                   )}
              </div>

              {/* Spacing */}
              <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-gray-500">Spacing</h4>
                  <SliderControl label="Padding Top" value={s.paddingTop} max={100} onChange={(v: number) => updateBlock(selectedBlock.id, 'styles', 'paddingTop', v)} />
                  <SliderControl label="Padding Bottom" value={s.paddingBottom} max={100} onChange={(v: number) => updateBlock(selectedBlock.id, 'styles', 'paddingBottom', v)} />
                  <SliderControl label="Padding Left" value={s.paddingLeft} max={100} onChange={(v: number) => updateBlock(selectedBlock.id, 'styles', 'paddingLeft', v)} />
                  <SliderControl label="Padding Right" value={s.paddingRight} max={100} onChange={(v: number) => updateBlock(selectedBlock.id, 'styles', 'paddingRight', v)} />
              </div>

          </div>
      );
  };

  return (
    <div className="w-80 bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 flex flex-col h-full z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="h-14 border-b border-gray-200 dark:border-zinc-800 px-4 flex items-center justify-between shrink-0">
            <span className="font-bold text-sm capitalize">{selectedBlock.type} Block</span>
            <button onClick={onDeselect} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800">
                <Icon name="close" className="w-4 h-4 text-gray-500" />
            </button>
        </div>

        <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 pt-4 pb-2">
                <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="styles">Styles</TabsTrigger>
                </TabsList>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
                <TabsContent value="content" className="mt-0">
                    {renderContentSettings()}
                </TabsContent>
                <TabsContent value="styles" className="mt-0">
                    {renderStyleSettings()}
                </TabsContent>
            </div>
        </Tabs>
    </div>
  );
};

export default PropertiesPanel;
