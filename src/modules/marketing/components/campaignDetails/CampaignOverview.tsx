
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Icon } from '../../../../components/shared/Icon';
import { Button } from '../../../../components/ui/Button';
import { formatCurrency } from '../../../../lib/utils';
import type { Campaign } from '../../../../types';

interface CampaignOverviewProps {
  campaign: Campaign;
  onEdit?: () => void;
}

const DetailRow = ({ label, value, icon }: { label: string; value: React.ReactNode; icon?: string }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-zinc-800 last:border-0">
     {icon && <div className="mt-0.5 text-gray-400"><Icon name={icon} className="w-4 h-4" /></div>}
     <div className="flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium tracking-wide mb-0.5">{label}</p>
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{value || '—'}</div>
     </div>
  </div>
);

export const CampaignOverview: React.FC<CampaignOverviewProps> = ({ campaign, onEdit }) => {
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  
  // Dynamic metric labels based on type
  const getResponseLabel = () => {
    if (campaign.type === 'Email Campaign') return 'Opens';
    if (campaign.type === 'Webinar') return 'Registrations';
    if (campaign.type === 'Advertisement') return 'Conversions';
    return 'Responses';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Detailed Information */}
      <Card>
          <CardHeader className="border-b border-gray-100 dark:border-zinc-800 flex flex-row items-center justify-between py-4">
              <CardTitle className="text-base">Detailed Information</CardTitle>
              {onEdit && (
                  <Button variant="outline" size="sm" onClick={onEdit} className="h-8 text-xs">
                      <Icon name="edit" className="w-3 h-3 mr-1.5" /> Edit Details
                  </Button>
              )}
          </CardHeader>
          <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  <div className="space-y-1">
                      <DetailRow label="Campaign Name" value={campaign.name} icon="fileText" />
                      <DetailRow label="Campaign Type" value={campaign.type} icon="tag" />
                      <DetailRow label="Status" value={campaign.status} icon="activity" />
                      <DetailRow label="Start Date" value={new Date(campaign.startDate).toLocaleDateString()} icon="calendar" />
                      <DetailRow label="End Date" value={new Date(campaign.endDate).toLocaleDateString()} icon="calendar" />
                  </div>
                  <div className="space-y-1">
                      <DetailRow label="Expected Revenue" value={formatCurrency(campaign.metrics.revenue * 1.1)} icon="trendingUp" />
                      <DetailRow label="Budgeted Cost" value={formatCurrency(campaign.metrics.spend * 1.2)} icon="creditCard" />
                      <DetailRow label="Actual Cost" value={formatCurrency(campaign.metrics.spend)} icon="dollarSign" />
                      <DetailRow label={`Expected ${getResponseLabel()}`} value={Math.round(campaign.metrics.conversions * 1.1).toLocaleString()} icon="users" />
                      <DetailRow label="Target Audience" value="Tech professionals aged 25-45 in metro cities." icon="target" />
                  </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                     <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</h4>
                  </div>
                  <div className="relative">
                      <p className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${!isDescExpanded ? 'line-clamp-3' : ''}`}>
                          This campaign targets high-intent users who have visited the pricing page but did not convert. 
                          Utilizing retargeting ads across social media and personalized email follow-ups to drive conversions.
                          Creative focus is on the "Summer Sale" discount and limited-time offer urgency.
                          Additional context: We are A/B testing two different creatives for the first week.
                      </p>
                      <button 
                        onClick={() => setIsDescExpanded(!isDescExpanded)}
                        className="text-xs text-blue-600 hover:underline mt-1 font-medium focus:outline-none"
                      >
                        {isDescExpanded ? 'Show less' : 'Read more'}
                      </button>
                  </div>
              </div>
          </CardContent>
      </Card>

    </div>
  );
};
