
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Icon } from "../../../components/shared/Icon";
import { formatCurrency } from '../../../lib/utils';
import type { Campaign } from '../../../types';

interface CampaignCardViewProps {
    campaigns: Campaign[];
}

const STATUS_COLORS: Record<string, "green" | "blue" | "gray" | "yellow" | "red" | "default"> = {
  'Active': 'green',
  'Scheduled': 'blue',
  'Planned': 'blue',
  'Completed': 'gray',
  'Paused': 'yellow',
  'On Hold': 'yellow',
  'Cancelled': 'red'
};

export const CampaignCardView: React.FC<CampaignCardViewProps> = ({ campaigns }) => {
    const navigate = useNavigate();
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {campaigns.map((campaign) => (
            <Card 
                key={campaign.id} 
                className="overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl cursor-pointer"
                onClick={() => navigate(`/marketing/campaigns/${campaign.id}`)}
            >
              
              {/* Card Image & Overlays */}
              <div className="relative h-40 overflow-hidden">
                <img 
                    src={campaign.image} 
                    alt={campaign.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />
                
                <div className="absolute top-3 right-3">
                    <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 hover:bg-white/30">
                        {campaign.type}
                    </Badge>
                </div>

                <div className="absolute top-3 left-3">
                    <Badge variant={STATUS_COLORS[campaign.status] || 'default'} className="shadow-sm border-none">
                        {campaign.status}
                    </Badge>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-bold text-lg truncate leading-tight mb-1 group-hover:text-green-400 transition-colors">{campaign.name}</h3>
                    <div className="flex items-center justify-between text-xs opacity-80">
                        <div className="flex items-center gap-1.5">
                            <Icon name="calendar" className="w-3 h-3" />
                            <span>{new Date(campaign.startDate).toLocaleDateString()}</span>
                        </div>
                        <span className="font-mono opacity-60">{campaign.id}</span>
                    </div>
                </div>
              </div>
              
              {/* Card Metrics */}
              <CardContent className="p-0">
                <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-zinc-800 border-b border-gray-100 dark:border-zinc-800">
                    <div className="p-3 text-center">
                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">Spend</p>
                        <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{formatCurrency(campaign.metrics.spend)}</p>
                    </div>
                    <div className="p-3 text-center">
                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">Revenue</p>
                        <p className="font-bold text-green-600 text-sm">{formatCurrency(campaign.metrics.revenue)}</p>
                    </div>
                     <div className="p-3 text-center bg-gray-50/50 dark:bg-zinc-800/30">
                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">ROI</p>
                        <p className={`font-bold text-sm ${campaign.metrics.roi >= 100 ? 'text-blue-600' : 'text-yellow-600'}`}>{campaign.metrics.roi}%</p>
                    </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-[10px] text-gray-600 dark:text-gray-300 font-bold border border-gray-200 dark:border-zinc-600">
                            {campaign.owner.avatar}
                        </div>
                        <span className="text-xs text-gray-500 truncate max-w-[80px]">{campaign.owner.name}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-blue-600" onClick={(e) => { e.stopPropagation(); navigate(`/marketing/campaigns/${campaign.id}/analytics`) }}><Icon name="analytics" className="w-4 h-4"/></Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs px-3 hover:border-green-500 hover:text-green-600 transition-colors">Details</Button>
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
    );
};
