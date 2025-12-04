
import React from 'react';
import { Icon } from '../shared/Icon';
import { cn } from '../../lib/utils';

interface TimelineItem {
    status: string;
    date: string;
    location: string;
}

interface TimelineProps {
    items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
    return (
        <div className="space-y-4">
            {items.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === items.length - 1;
                const isCompleted = isFirst || item.status === "Delivered"; // Customize logic if needed

                return (
                    <div key={index} className="relative flex items-start gap-4 pl-8">
                        {/* Dot and Line */}
                        <div className="absolute left-0 top-1 flex flex-col items-center">
                            <div className={cn(
                                "flex h-6 w-6 items-center justify-center rounded-full",
                                isFirst ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                            )}>
                                {isCompleted ? <Icon name="check" className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-gray-400" />}
                            </div>
                            {!isLast && <div className="w-px flex-grow bg-gray-200 dark:bg-gray-700" />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-0.5">
                            <p className={cn(
                                "font-semibold",
                                isFirst ? "text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-400"
                            )}>
                                {item.status}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.location}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.date}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Timeline;
