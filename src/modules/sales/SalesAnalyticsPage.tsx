
import React, { useState, useMemo } from 'react';
import { mockSalesActivities, mockSalesTasks } from '../../data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { DatePicker } from "../../components/ui/DatePicker";
import type { DateRange } from "../../components/ui/Calendar";
import type { SalesActivity, SalesTask } from '../../types';
import Performance from './components/analytics/Performance';
import ActivityStream from './components/analytics/ActivityStream';

// --- Data Generators based on Filter ---
const getFilteredData = (range: DateRange | undefined) => {
    // In a real app, we would use the actual dates. 
    // Here we'll just mock a multiplier based on "Last 30 days" approx logic for demo purposes.
    let multiplier = 1;
    if (range?.from) {
        const days = range.to ? Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 3600 * 24)) : 1;
        if (days <= 7) multiplier = 0.2;
        else if (days > 60) multiplier = 3;
    }
    
    return {
        revenue: 5403000 * multiplier,
        winRate: 68 - (multiplier > 1 ? 2 : 0),
        deals: Math.floor(42 * multiplier),
        activities: Math.floor(248 * multiplier),
        revenueChart: [
            { name: "Period 1", revenue: 45000 * multiplier, quota: 40000 * multiplier },
            { name: "Period 2", revenue: 52000 * multiplier, quota: 45000 * multiplier },
            { name: "Period 3", revenue: 48000 * multiplier, quota: 45000 * multiplier },
            { name: "Period 4", revenue: 61000 * multiplier, quota: 50000 * multiplier },
            { name: "Period 5", revenue: 55000 * multiplier, quota: 50000 * multiplier },
            { name: "Period 6", revenue: 67000 * multiplier, quota: 55000 * multiplier },
        ],
        winRateChart: [
            { name: "Period 1", rate: 42 },
            { name: "Period 2", rate: 48 },
            { name: "Period 3", rate: 45 },
            { name: "Period 4", rate: 52 },
            { name: "Period 5", rate: 58 },
            { name: "Period 6", rate: 62 },
        ]
    };
};

// --- Main Page Component ---

const SalesAnalyticsPage = () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(new Date().setDate(new Date().getDate() - 30)),
        to: new Date()
    });
    
    // State
    const [activities, setActivities] = useState<SalesActivity[]>(mockSalesActivities);
    const [tasks, setTasks] = useState<SalesTask[]>(mockSalesTasks);
    const [activeTab, setActiveTab] = useState("performance");

    // Filtered Data
    const metrics = useMemo(() => getFilteredData(dateRange), [dateRange]);

    // Handlers
    const handleAddActivity = (newActivity: SalesActivity) => {
        setActivities([newActivity, ...activities]);
    };

    const handleAddTask = (newTask: SalesTask) => {
        setTasks([newTask, ...tasks]);
    };

    return (
        <div className="space-y-6">
             {/* Top Header */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Sales Analytics</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Track performance, revenue, and team activities.</p>
                </div>
                
                {/* Global Filter */}
                <div className="bg-white dark:bg-gray-800 p-1 rounded-lg border dark:border-gray-700 shadow-sm">
                    <DatePicker 
                        mode="range" 
                        value={dateRange} 
                        onChange={(val) => setDateRange(val)} 
                        className="w-[240px] border-0 shadow-none"
                    />
                </div>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="activity">Activity Stream</TabsTrigger>
                </TabsList>

                {/* --- PERFORMANCE TAB --- */}
                <TabsContent value="performance" className="space-y-6">
                    <Performance metrics={metrics} />
                </TabsContent>

                {/* --- ACTIVITY STREAM TAB --- */}
                <TabsContent value="activity" className="space-y-6">
                    <ActivityStream 
                        activities={activities} 
                        tasks={tasks} 
                        onAddActivity={handleAddActivity} 
                        onAddTask={handleAddTask} 
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SalesAnalyticsPage;
