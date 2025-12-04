
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { SocialPostsList } from "./social/components/SocialPostsList";
import { SocialCalendar } from "./social/components/SocialCalendar";
import { SocialMediaLibrary } from "./social/components/SocialMediaLibrary";
import { SocialAnalytics } from "./social/components/SocialAnalytics";
import { AccountManager } from "./social/components/AccountManager";
import { SocialDashboard } from "./social/components/SocialDashboard";

const SocialPublisherPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <div className="h-full flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Social Publisher</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage, schedule, and analyze your social media content.</p>
                </div>
            </div>

            {/* Main Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <div className="shrink-0 mb-6">
                    <TabsList>
                        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                        <TabsTrigger value="posts">Posts</TabsTrigger>
                        <TabsTrigger value="calendar">Calendar</TabsTrigger>
                        <TabsTrigger value="media">Media Library</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="accounts">Accounts</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden h-full">
                    <TabsContent value="dashboard" className="mt-0 h-full overflow-y-auto pb-10">
                        <SocialDashboard />
                    </TabsContent>
                    <TabsContent value="posts" className="mt-0 h-full overflow-y-auto pb-10">
                        <SocialPostsList />
                    </TabsContent>
                    <TabsContent value="calendar" className="mt-0 h-full overflow-y-auto pb-10">
                        <SocialCalendar />
                    </TabsContent>
                    <TabsContent value="media" className="mt-0 h-full overflow-y-auto pb-10">
                        <SocialMediaLibrary />
                    </TabsContent>
                    <TabsContent value="analytics" className="mt-0 h-full overflow-y-auto pb-10">
                        <SocialAnalytics />
                    </TabsContent>
                    <TabsContent value="accounts" className="mt-0 h-full overflow-y-auto pb-10">
                        <AccountManager />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default SocialPublisherPage;
