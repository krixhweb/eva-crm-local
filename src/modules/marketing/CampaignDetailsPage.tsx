
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/shared/Icon';
import { mockCampaigns } from '../../data/mockData';
import type { Campaign } from '../../types';
import { CampaignOverview } from './components/campaignDetails/CampaignOverview';
import { CampaignAnalytics } from './components/campaignDetails/CampaignAnalytics';
import { 
  CampaignLeads, 
  CampaignTimeline, 
  CampaignActivities, 
  CampaignNotes, 
  CampaignFiles 
} from './components/campaignDetails/CampaignRelated';
import { Badge } from '../../components/ui/Badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/DropdownMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Card, CardContent } from '../../components/ui/Card';
import { formatCurrency } from '../../lib/utils';
import { CreateCampaignDrawer } from './components/CreateCampaignDrawer';
import { useGlassyToasts } from '../../components/ui/GlassyToastProvider';

const CampaignDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { push } = useGlassyToasts();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Lifted state to allow updates
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  // Simulate fetching data
  useEffect(() => {
    const found = mockCampaigns.find(c => c.id === id);
    if (found) {
      setCampaign(found);
    }
  }, [id]);

  if (!campaign) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Campaign Not Found</h2>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/marketing/campaigns')}>
            Back to Campaigns
          </Button>
        </div>
      </div>
    );
  }

  const handleEditSave = (updatedData: any) => {
      // In real app, this would be an API call
      const updatedCampaign = { ...campaign, ...updatedData };
      setCampaign(updatedCampaign);
      push({ title: "Campaign Updated", description: "Changes have been saved successfully.", variant: "success" });
      setIsEditDrawerOpen(false);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/marketing/campaigns')} className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
            <Icon name="arrowLeft" className="w-4 h-4 mr-2" /> Back to Campaigns
          </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-5">
            <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 shrink-0">
                <Icon name="megaphone" className="w-8 h-8" />
            </div>
            <div>
                <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{campaign.name}</h1>
                    <Badge variant={campaign.status === 'Active' ? 'green' : 'default'}>{campaign.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1 flex-wrap">
                    <span className="flex items-center gap-1"><Icon name="tag" className="w-3 h-3"/> {campaign.type}</span>
                    <span className="flex items-center gap-1"><Icon name="calendar" className="w-3 h-3"/> {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Icon name="user" className="w-3 h-3"/> Owner: {campaign.owner.name}</span>
                </div>
            </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto justify-end">
            <Button variant="outline" className="hidden sm:flex">
                <Icon name="share" className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button onClick={() => setIsEditDrawerOpen(true)}>
                <Icon name="edit" className="w-4 h-4 mr-2" /> Edit Campaign
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Icon name="moreVertical" className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-red-600 focus:text-red-600">Delete Campaign</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
              <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Spend</p>
                          <h3 className="text-2xl font-bold mt-1">{formatCurrency(campaign.metrics.spend)}</h3>
                      </div>
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg"><Icon name="creditCard" className="w-5 h-5" /></div>
                  </div>
              </CardContent>
          </Card>
          <Card>
              <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Revenue</p>
                          <h3 className="text-2xl font-bold mt-1 text-green-600">{formatCurrency(campaign.metrics.revenue)}</h3>
                      </div>
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg"><Icon name="dollarSign" className="w-5 h-5" /></div>
                  </div>
              </CardContent>
          </Card>
          <Card>
              <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">ROI</p>
                          <h3 className="text-2xl font-bold mt-1 text-purple-600">{campaign.metrics.roi}%</h3>
                      </div>
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg"><Icon name="trendingUp" className="w-5 h-5" /></div>
                  </div>
              </CardContent>
          </Card>
          <Card>
              <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Conversions</p>
                          <h3 className="text-2xl font-bold mt-1">{campaign.metrics.conversions}</h3>
                      </div>
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg"><Icon name="target" className="w-5 h-5" /></div>
                  </div>
              </CardContent>
          </Card>
      </div>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
              {['Overview', 'Analytics', 'Leads', 'Activities', 'Timeline', 'Files'].map(tab => (
                  <TabsTrigger 
                    key={tab} 
                    value={tab.toLowerCase()} 
                  >
                      {tab}
                  </TabsTrigger>
              ))}
          </TabsList>

          <div className="mt-6">
              <TabsContent value="overview">
                  <CampaignOverview campaign={campaign} onEdit={() => setIsEditDrawerOpen(true)} />
              </TabsContent>
              <TabsContent value="analytics">
                  <CampaignAnalytics campaign={campaign} />
              </TabsContent>
              <TabsContent value="leads">
                  <CampaignLeads campaignId={campaign.id} />
              </TabsContent>
              <TabsContent value="activities">
                  <CampaignActivities />
              </TabsContent>
              <TabsContent value="timeline">
                  <CampaignTimeline />
              </TabsContent>
              <TabsContent value="files">
                  <CampaignFiles />
              </TabsContent>
          </div>
      </Tabs>
      
      {/* Edit Drawer */}
      <CreateCampaignDrawer 
        open={isEditDrawerOpen} 
        onClose={() => setIsEditDrawerOpen(false)} 
        campaignToEdit={campaign} 
        onSave={handleEditSave}
      />
    </div>
  );
};

export default CampaignDetailsPage;
