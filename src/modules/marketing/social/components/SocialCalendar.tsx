
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Icon } from '../../../../components/shared/Icon';
import { SocialPost, PLATFORM_CONFIG, Platform } from '../types';
import { SocialService } from '../api/mockService';
import { cn } from '../../../../lib/utils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const SocialCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<SocialPost[]>([]);

  useEffect(() => {
    SocialService.getPosts().then(setPosts);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const handlePrevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));

  const getPostsForDay = (day: number) => {
      return posts.filter(p => {
          const d = p.scheduledAt || p.publishedAt || p.createdAt;
          const date = new Date(d);
          return date.getDate() === day && date.getMonth() === currentDate.getMonth() && date.getFullYear() === year;
      });
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Calendar Controls */}
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{monthName} {year}</h2>
                <div className="flex bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-1 shadow-sm">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded text-gray-600 dark:text-gray-300"><Icon name="chevronLeft" className="w-5 h-5"/></button>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded text-gray-600 dark:text-gray-300"><Icon name="chevronRight" className="w-5 h-5"/></button>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline">Day</Button>
                <Button variant="outline">Week</Button>
                <Button variant="default" className="bg-green-600 text-white">Month</Button>
            </div>
        </div>

        {/* Calendar Grid */}
        <Card className="flex-1 flex flex-col shadow-sm border-gray-200 dark:border-zinc-800 overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
                {DAYS.map(day => (
                    <div key={day} className="py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 flex-1 bg-white dark:bg-zinc-950">
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="border-b border-r border-gray-100 dark:border-zinc-800/50 bg-gray-50/30 dark:bg-zinc-900/20" />
                ))}
                
                {Array.from({ length: days }).map((_, i) => {
                    const day = i + 1;
                    const dayPosts = getPostsForDay(day);
                    const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();

                    return (
                        <div key={day} className={cn("min-h-[120px] border-b border-r border-gray-100 dark:border-zinc-800/50 p-2 relative hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors group")}>
                            <div className="flex justify-between items-start">
                                <span className={cn("text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full", isToday ? "bg-green-600 text-white" : "text-gray-700 dark:text-gray-300")}>
                                    {day}
                                </span>
                                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded text-gray-400">
                                    <Icon name="plus" className="w-3 h-3" />
                                </button>
                            </div>

                            <div className="mt-2 space-y-1.5">
                                {dayPosts.map(post => (
                                    <div key={post.id} className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-1.5 rounded shadow-sm text-xs cursor-pointer hover:border-blue-400 transition-all">
                                        <div className="flex -space-x-1">
                                            {post.platforms.map(p => (
                                                <div key={p} className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white ${PLATFORM_CONFIG[p].bg}`}>
                                                    <Icon name={PLATFORM_CONFIG[p].icon as any} className="w-2.5 h-2.5" />
                                                </div>
                                            ))}
                                        </div>
                                        <span className={cn("truncate font-medium", post.status === 'published' ? "text-gray-500 line-through" : "text-gray-800 dark:text-gray-200")}>
                                            {post.content.substring(0, 15) || 'Post'}...
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    </div>
  );
};
