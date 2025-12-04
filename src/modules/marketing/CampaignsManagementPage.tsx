
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { CampaignDashboard } from './components/CampaignDashboard';
import { CampaignManager } from './components/CampaignManager';
import { CreateCampaignDrawer } from './components/CreateCampaignDrawer';

const CampaignsManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreateOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Campaign Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track performance and manage multi-channel marketing campaigns.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Overview Dashboard</TabsTrigger>
          <TabsTrigger value="manager">Campaign Manager</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <CampaignDashboard />
        </TabsContent>

        <TabsContent value="manager">
          <CampaignManager onCreate={() => setCreateOpen(true)} />
        </TabsContent>
      </Tabs>

      <CreateCampaignDrawer open={isCreateOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
};

export default CampaignsManagementPage;
