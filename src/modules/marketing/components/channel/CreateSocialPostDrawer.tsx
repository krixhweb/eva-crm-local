
import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '../../../../components/ui/Drawer';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Label } from '../../../../components/ui/Label';
import { Textarea } from '../../../../components/ui/Textarea';
import { Checkbox } from '../../../../components/ui/Checkbox';
import { Icon } from '../../../../components/shared/Icon';
import { useGlassyToasts } from '../../../../components/ui/GlassyToastProvider';

interface CreateSocialPostDrawerProps {
    open: boolean;
    onClose: () => void;
}

export const CreateSocialPostDrawer: React.FC<CreateSocialPostDrawerProps> = ({ open, onClose }) => {
    const { push } = useGlassyToasts();
    const [platforms, setPlatforms] = useState({ fb: true, ig: true, tw: false, li: false });
    const [content, setContent] = useState('');

    const handlePost = () => {
        push({ title: "Post Scheduled", description: "Your social media post has been scheduled.", variant: "success" });
        onClose();
    };

    return (
        <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
            <DrawerContent className="w-full md:w-[600px] p-0 rounded-l-3xl border-l" showCloseButton={true}>
                <DrawerHeader className="border-b px-6 py-4">
                    <DrawerTitle>Create Social Post</DrawerTitle>
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-zinc-950/50">
                    
                    {/* Platform Selector */}
                    <div className="space-y-3">
                        <Label>Select Platforms</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 p-3 border rounded-lg bg-white dark:bg-zinc-900">
                                <Checkbox id="fb" checked={platforms.fb} onCheckedChange={(c) => setPlatforms({...platforms, fb: !!c})} />
                                <Label htmlFor="fb" className="flex items-center gap-2 cursor-pointer"><Icon name="facebook" className="w-4 h-4 text-blue-600" /> Facebook</Label>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-lg bg-white dark:bg-zinc-900">
                                <Checkbox id="ig" checked={platforms.ig} onCheckedChange={(c) => setPlatforms({...platforms, ig: !!c})} />
                                <Label htmlFor="ig" className="flex items-center gap-2 cursor-pointer"><Icon name="instagram" className="w-4 h-4 text-pink-600" /> Instagram</Label>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-lg bg-white dark:bg-zinc-900">
                                <Checkbox id="tw" checked={platforms.tw} onCheckedChange={(c) => setPlatforms({...platforms, tw: !!c})} />
                                <Label htmlFor="tw" className="flex items-center gap-2 cursor-pointer"><Icon name="twitter" className="w-4 h-4 text-sky-500" /> Twitter</Label>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-lg bg-white dark:bg-zinc-900">
                                <Checkbox id="li" checked={platforms.li} onCheckedChange={(c) => setPlatforms({...platforms, li: !!c})} />
                                <Label htmlFor="li" className="flex items-center gap-2 cursor-pointer"><Icon name="linkedin" className="w-4 h-4 text-blue-800" /> LinkedIn</Label>
                            </div>
                        </div>
                    </div>

                    {/* Media Upload */}
                    <div className="space-y-2">
                        <Label>Media</Label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl h-32 flex flex-col items-center justify-center text-gray-500 hover:bg-white dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                            <Icon name="image" className="w-8 h-8 mb-2 text-gray-400" />
                            <span className="text-xs">Drag photos or videos here</span>
                        </div>
                    </div>

                    {/* Caption */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Caption</Label>
                            <span className="text-xs text-gray-400">{content.length} / 2200</span>
                        </div>
                        <Textarea 
                            placeholder="Write your caption here... #hashtags" 
                            className="min-h-[150px]" 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setContent(content + " #Sale")}>#Sale</Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setContent(content + " #NewArrival")}>#NewArrival</Button>
                        </div>
                    </div>

                    {/* Scheduling */}
                    <div className="space-y-2">
                        <Label>Schedule</Label>
                        <div className="flex gap-3">
                            <Input type="date" className="flex-1" />
                            <Input type="time" className="w-32" />
                        </div>
                    </div>
                </div>

                <DrawerFooter className="border-t px-6 py-4 bg-white dark:bg-zinc-900 flex-row justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Save Draft</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handlePost}>Schedule Post</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
