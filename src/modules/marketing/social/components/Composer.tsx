
import React, { useState, useEffect, useRef } from 'react';
import { SocialAccount, SocialAttachment, LinkMetadata, Platform, PLATFORM_CONFIG } from '../types';
import { SocialService } from '../api/mockService';
import { PostPreview } from './PostPreview';
import { Button } from '../../../../components/ui/Button';
import { Icon } from '../../../../components/shared/Icon';
import { Textarea } from '../../../../components/ui/Textarea';
import { Input } from '../../../../components/ui/Input';
import { Label } from '../../../../components/ui/Label';
import { Switch } from '../../../../components/ui/Switch';
import { useGlassyToasts } from '../../../../components/ui/GlassyToastProvider';
import { cn } from '../../../../lib/utils';

interface ComposerProps {
  onPostCreated: () => void;
}

export const Composer: React.FC<ComposerProps> = ({ onPostCreated }) => {
  const { push } = useGlassyToasts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<SocialAttachment[]>([]);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkPreview, setLinkPreview] = useState<LinkMetadata | null>(null);
  const [isFetchingLink, setIsFetchingLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  
  const [activePreviewPlatform, setActivePreviewPlatform] = useState<Platform | null>(null);

  // Load Accounts
  useEffect(() => {
    SocialService.getAccounts().then(data => {
        setAccounts(data);
        // Select first account by default
        if (data.length > 0) {
            setSelectedAccounts([data[0].id]);
            setActivePreviewPlatform(data[0].provider);
        }
    });
  }, []);

  // Update active preview when accounts change
  useEffect(() => {
      if (selectedAccounts.length > 0) {
          // If current preview is not in selected, switch to first selected
          const currentPreviewAccount = accounts.find(a => a.provider === activePreviewPlatform);
          if (!currentPreviewAccount || !selectedAccounts.includes(currentPreviewAccount.id)) {
              const firstSelected = accounts.find(a => a.id === selectedAccounts[0]);
              if (firstSelected) setActivePreviewPlatform(firstSelected.provider);
          }
      } else {
          setActivePreviewPlatform(null);
      }
  }, [selectedAccounts, accounts, activePreviewPlatform]);

  const toggleAccount = (id: string) => {
    setSelectedAccounts(prev => {
        if (prev.includes(id)) return prev.filter(pid => pid !== id);
        return [...prev, id];
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          const newAtts = Array.from(e.target.files).map((f: File) => ({
              id: Math.random().toString(36).substr(2,9),
              url: URL.createObjectURL(f),
              type: (f.type.startsWith('video') ? 'video' : 'image') as 'video' | 'image',
              file: f,
              size: f.size
          }));
          setAttachments(prev => [...prev, ...newAtts]);
          setLinkPreview(null); // Clear link if media added
      }
  };

  const fetchLink = async () => {
      if (!linkUrl) return;
      setIsFetchingLink(true);
      try {
          const meta = await SocialService.getLinkPreview(linkUrl);
          setLinkPreview(meta);
          setAttachments([]); // Clear media if link added
          setLinkUrl(''); // Clear input
      } catch {
          push({ title: "Error", description: "Could not fetch link preview", variant: "error" });
      } finally {
          setIsFetchingLink(false);
      }
  };

  const handlePublish = async () => {
      if (selectedAccounts.length === 0) return push({ title: "Error", description: "Select at least one account.", variant: "error" });
      
      setIsSubmitting(true);
      const postData = {
          content: text,
          attachments,
          linkPreview,
          accountIds: selectedAccounts,
          platforms: [...new Set(accounts.filter(a => selectedAccounts.includes(a.id)).map(a => a.provider))],
          status: isScheduled ? 'scheduled' : 'published',
          scheduledAt: isScheduled ? scheduleDate : undefined
      };

      await SocialService.createPost(postData as any);
      setIsSubmitting(false);
      push({ title: "Success", description: isScheduled ? "Post scheduled!" : "Post published!", variant: "success" });
      onPostCreated();
  };

  const charCount = text.length;
  const currentPlatformConfig = activePreviewPlatform ? PLATFORM_CONFIG[activePreviewPlatform] : PLATFORM_CONFIG.facebook;
  const isOverLimit = charCount > currentPlatformConfig.charLimit;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-full bg-gray-50 dark:bg-black divide-x dark:divide-zinc-800">
        
        {/* --- COLUMN 1: ACCOUNTS (Left Sidebar) --- */}
        <div className="hidden lg:flex lg:col-span-3 flex-col h-full bg-white dark:bg-zinc-900 overflow-y-auto">
            <div className="p-5 border-b border-gray-100 dark:border-zinc-800">
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Post To</h3>
                <p className="text-xs text-gray-500 mt-1">Select accounts to publish this post.</p>
            </div>
            
            <div className="p-4 space-y-2 flex-1">
                {accounts.map(acc => {
                    const isSelected = selectedAccounts.includes(acc.id);
                    const conf = PLATFORM_CONFIG[acc.provider];
                    return (
                        <div 
                            key={acc.id}
                            onClick={() => toggleAccount(acc.id)}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all",
                                isSelected 
                                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 shadow-sm" 
                                    : "bg-white dark:bg-zinc-900 border-transparent hover:bg-gray-50 dark:hover:bg-zinc-800"
                            )}
                        >
                            <div className="relative">
                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm", conf.bg)}>
                                    <Icon name={conf.icon as any} className="w-5 h-5" />
                                </div>
                                {isSelected && (
                                    <div className="absolute -bottom-1 -right-1 bg-green-600 text-white rounded-full p-0.5 border-2 border-white dark:border-zinc-900">
                                        <Icon name="check" className="w-2 h-2" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={cn("text-sm font-bold truncate", isSelected ? "text-green-900 dark:text-green-100" : "text-gray-700 dark:text-gray-300")}>
                                    {acc.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{acc.username}</p>
                            </div>
                        </div>
                    );
                })}
                
                <Button variant="outline" className="w-full mt-4 border-dashed border-gray-300 text-gray-500 hover:text-green-600 hover:border-green-400">
                    <Icon name="plus" className="w-4 h-4 mr-2" /> Connect New Account
                </Button>
            </div>
            
            <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
                 <div className="flex items-center justify-between text-xs text-gray-500">
                     <span>{selectedAccounts.length} accounts selected</span>
                     <button onClick={() => setSelectedAccounts([])} className="hover:text-red-500">Clear</button>
                 </div>
            </div>
        </div>

        {/* --- COLUMN 2: COMPOSER (Center) --- */}
        <div className="col-span-12 lg:col-span-5 flex flex-col h-full bg-white dark:bg-zinc-900">
             <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                 <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Compose Content</h3>
                 <div className={cn("text-xs font-mono px-2 py-1 rounded", isOverLimit ? "bg-red-100 text-red-600" : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400")}>
                     {charCount} / {currentPlatformConfig.charLimit}
                 </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-5 space-y-6">
                 {/* Text Area */}
                 <div className="relative">
                     <Textarea 
                        placeholder="What do you want to share?" 
                        className="min-h-[200px] text-base border-none focus-visible:ring-0 resize-none p-0 bg-transparent placeholder:text-gray-400"
                        value={text}
                        onChange={e => setText(e.target.value)}
                     />
                     <div className="flex gap-2 mt-2">
                         <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500" title="Emoji"><Icon name="smile" className="w-5 h-5"/></button>
                         <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500" title="Hashtag"><Icon name="hash" className="w-5 h-5"/></button>
                         <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500" title="Location"><Icon name="mapPin" className="w-5 h-5"/></button>
                     </div>
                 </div>
                 
                 {/* Media / Link Area */}
                 <div className="space-y-4">
                     {attachments.length > 0 ? (
                         <div className="grid grid-cols-3 gap-3">
                             {attachments.map(att => (
                                 <div key={att.id} className="relative aspect-square bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden group border dark:border-zinc-700">
                                     <img src={att.url} alt="" className="w-full h-full object-cover" />
                                     <button 
                                        onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))}
                                        className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                     >
                                         <Icon name="close" className="w-3 h-3" />
                                     </button>
                                 </div>
                             ))}
                             <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 hover:border-green-400 hover:text-green-500 transition-all"
                             >
                                 <Icon name="plus" className="w-6 h-6" />
                             </div>
                         </div>
                     ) : linkPreview ? (
                         <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-800 relative group">
                             <button onClick={() => setLinkPreview(null)} className="absolute top-2 right-2 bg-gray-200 dark:bg-zinc-700 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"><Icon name="close" className="w-4 h-4"/></button>
                             {linkPreview.image && <div className="h-40 w-full bg-gray-200"><img src={linkPreview.image} alt="" className="w-full h-full object-cover" /></div>}
                             <div className="p-4">
                                 <p className="text-xs text-gray-500 uppercase font-bold">{linkPreview.domain}</p>
                                 <p className="font-bold text-sm truncate mt-1">{linkPreview.title}</p>
                                 <p className="text-xs text-gray-500 mt-1 line-clamp-2">{linkPreview.description}</p>
                             </div>
                         </div>
                     ) : (
                         <div className="flex flex-col gap-3">
                             <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border border-gray-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                             >
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Icon name="image" className="w-5 h-5"/></div>
                                <div>
                                    <p className="text-sm font-medium">Add Photos / Video</p>
                                    <p className="text-xs text-gray-500">Drag & drop or browse</p>
                                </div>
                                <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,video/*" />
                             </div>
                             
                             {!isFetchingLink ? (
                                 <div className="flex gap-2">
                                     <Input 
                                        placeholder="Enter link URL..." 
                                        className="flex-1 text-sm h-10 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700" 
                                        value={linkUrl} 
                                        onChange={e => setLinkUrl(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && fetchLink()}
                                     />
                                     <Button variant="outline" onClick={fetchLink} disabled={!linkUrl} className="h-10">Add Link</Button>
                                 </div>
                             ) : (
                                 <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2 bg-gray-50 rounded-xl">
                                     <Icon name="refreshCw" className="w-4 h-4 animate-spin" /> Fetching preview...
                                 </div>
                             )}
                         </div>
                     )}
                 </div>

                 <div className="h-px bg-gray-100 dark:bg-zinc-800 my-4"></div>

                 {/* Scheduling */}
                 <div className="space-y-4">
                     <div className="flex items-center justify-between">
                         <Label className="cursor-pointer flex items-center gap-2" htmlFor="schedule-toggle">
                             <Icon name="clock" className="w-4 h-4 text-gray-500" /> Schedule for later
                         </Label>
                         <Switch id="schedule-toggle" checked={isScheduled} onClick={() => setIsScheduled(!isScheduled)} />
                     </div>
                     
                     {isScheduled && (
                         <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 animate-in slide-in-from-top-2">
                             <Label className="mb-2 block text-xs font-bold uppercase text-gray-500">Publish Date & Time</Label>
                             <Input type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="bg-white dark:bg-zinc-900" />
                         </div>
                     )}
                 </div>
             </div>

             {/* Footer Actions */}
             <div className="p-5 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex justify-between items-center sticky bottom-0">
                 <Button variant="ghost" className="text-gray-500">Save Draft</Button>
                 <Button 
                    onClick={handlePublish} 
                    disabled={isSubmitting || selectedAccounts.length === 0 || (!text && attachments.length === 0 && !linkPreview)}
                    className="bg-green-600 hover:bg-green-700 text-white shadow-md px-8"
                 >
                     {isSubmitting ? <Icon name="refreshCw" className="w-4 h-4 animate-spin" /> : (isScheduled ? "Schedule Post" : "Publish Now")}
                 </Button>
             </div>
        </div>

        {/* --- COLUMN 3: PREVIEW (Right Sidebar) --- */}
        <div className="hidden lg:flex lg:col-span-4 flex-col h-full bg-gray-100 dark:bg-zinc-950 border-l border-gray-200 dark:border-zinc-800">
             <div className="p-5 border-b border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
                 <h3 className="font-bold text-sm text-center text-gray-500 uppercase tracking-wider mb-4">Live Preview</h3>
                 
                 {/* Platform Tabs */}
                 <div className="flex justify-center gap-2">
                     {selectedAccounts.length > 0 ? (
                         [...new Set(accounts.filter(a => selectedAccounts.includes(a.id)).map(a => a.provider))].map((provider) => {
                            const p = provider as Platform;
                            return (
                             <button
                                key={p}
                                onClick={() => setActivePreviewPlatform(p)}
                                className={cn(
                                    "p-2 rounded-lg transition-all shadow-sm border",
                                    activePreviewPlatform === p 
                                        ? `bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 ${PLATFORM_CONFIG[p].color}` 
                                        : "bg-gray-200 dark:bg-zinc-800 border-transparent opacity-50 hover:opacity-100"
                                )}
                                title={PLATFORM_CONFIG[p].name}
                             >
                                 <Icon name={PLATFORM_CONFIG[p].icon as any} className="w-5 h-5" />
                             </button>
                            );
                         })
                     ) : (
                         <span className="text-xs text-gray-400">Select accounts to see previews</span>
                     )}
                 </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 flex items-start justify-center">
                 {activePreviewPlatform ? (
                     <div className="w-full max-w-[400px] animate-in zoom-in-95 duration-300">
                         <PostPreview 
                            platform={activePreviewPlatform}
                            text={text}
                            attachments={attachments}
                            linkPreview={linkPreview}
                         />
                     </div>
                 ) : (
                     <div className="text-center text-gray-400 mt-20">
                         <Icon name="eye" className="w-16 h-16 mx-auto mb-4 opacity-10" />
                         <p className="text-sm">No active preview</p>
                     </div>
                 )}
             </div>
        </div>

    </div>
  );
};
