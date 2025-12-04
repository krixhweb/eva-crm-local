
import React from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Icon } from '../../components/shared/Icon';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/Tabs';

const navItems = [
    { label: 'General', path: '/settings/general', icon: 'settings' },
    { label: 'Integrations', path: '/settings/integrations', icon: 'grid' },
    { label: 'Admin & Security', path: '/settings/admin', icon: 'user' },
    { label: 'APIs & Webhooks', path: '/settings/api', icon: 'code' },
];

export const SettingsLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Match current path to tab value
    const currentTab = navItems.find(item => location.pathname.startsWith(item.path))?.path || '/settings/general';

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="shrink-0">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your application preferences and configurations.</p>
            </div>

            <Tabs value={currentTab} onValueChange={(val) => navigate(val)} className="w-full">
                <TabsList>
                    {navItems.map((item) => (
                        <TabsTrigger key={item.path} value={item.path}>
                            <Icon name={item.icon as any} className="w-4 h-4 mr-2" />
                            {item.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="flex-1 min-w-0 overflow-y-auto py-4">
                <Outlet />
            </div>
        </div>
    );
};
