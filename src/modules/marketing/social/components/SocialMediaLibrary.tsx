
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Icon } from '../../../../components/shared/Icon';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Tabs, TabsList, TabsTrigger } from '../../../../components/ui/Tabs';

export const SocialMediaLibrary = () => {
  const [filter, setFilter] = useState('all');
  
  const mockMedia = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      url: `https://picsum.photos/seed/${i + 50}/300/300`,
      name: `Campaign_Asset_${i + 1}.jpg`,
      type: i % 3 === 0 ? 'video' : 'image',
      date: '2 days ago',
      size: '1.2 MB'
  }));

  const filteredMedia = mockMedia.filter(m => filter === 'all' || m.type === filter);

  return (
    <div className="space-y-6">
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-zinc-800">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <h2 className="text-lg font-bold">Media Library</h2>
                        <Tabs value={filter} onValueChange={setFilter}>
                            <TabsList className="h-9 bg-gray-100 dark:bg-zinc-800 p-1">
                                <TabsTrigger value="all" className="text-xs h-7">All</TabsTrigger>
                                <TabsTrigger value="image" className="text-xs h-7">Images</TabsTrigger>
                                <TabsTrigger value="video" className="text-xs h-7">Videos</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input placeholder="Search assets..." className="pl-9 h-9" />
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                            <Icon name="upload" className="w-4 h-4 mr-2"/> Upload
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {filteredMedia.map(item => (
                        <div key={item.id} className="group relative flex flex-col gap-2">
                            <div className="aspect-square bg-gray-100 dark:bg-zinc-800 rounded-xl overflow-hidden cursor-pointer border border-gray-200 dark:border-zinc-700 relative shadow-sm hover:shadow-md transition-all group-hover:border-blue-400">
                                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                {item.type === 'video' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                            <Icon name="play" className="w-5 h-5 text-black ml-0.5" />
                                        </div>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button className="p-2 bg-white rounded-full text-gray-900 hover:scale-110 transition-transform shadow-lg"><Icon name="eye" className="w-4 h-4" /></button>
                                    <button className="p-2 bg-white rounded-full text-red-600 hover:scale-110 transition-transform shadow-lg"><Icon name="trash" className="w-4 h-4" /></button>
                                </div>
                                <div className="absolute top-2 right-2">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
                                <p className="text-[10px] text-gray-500">{item.size} • {item.date}</p>
                            </div>
                        </div>
                    ))}
                    
                    {/* Upload Placeholder */}
                    <div className="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-700 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 transition-all cursor-pointer">
                        <Icon name="plus" className="w-8 h-8 mb-2" />
                        <span className="text-xs font-medium">Add New</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};
