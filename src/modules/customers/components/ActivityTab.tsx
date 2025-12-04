
import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Icon } from '../../../components/shared/Icon';
import type { Activity, ActivityDetailsCart, ActivityDetailsEmail, ActivityDetailsLogin, ActivityDetailsOrder, ActivityDetailsPageView, ActivityDetailsProfile, ActivityDetailsTicket } from '../../../types';
import ActivityPreviewModal from '../../../components/modals/ActivityPreviewModal';
import { mockActivities } from '../../../data/mockData';

const formatActivityDetails = (activity: Activity): string => {
    if (typeof activity.details === 'string') {
        return activity.details;
    }
    switch (activity.type) {
        case 'Order': {
            const details = activity.details as ActivityDetailsOrder;
            return `Order #${details.orderId} with ${details.items} item(s) for ${details.value}.`;
        }
        case 'Ticket': {
            const details = activity.details as ActivityDetailsTicket;
            return `Ticket #${details.ticketId}: "${details.subject}"`;
        }
        case 'Profile': {
            const details = activity.details as ActivityDetailsProfile;
            return `Changed email from ${details.from} to ${details.to}.`;
        }
        case 'Cart': {
            const details = activity.details as ActivityDetailsCart;
            return `Abandoned cart with ${details.items} item(s) worth ${details.value}.`;
        }
        case 'Email': {
            const details = activity.details as ActivityDetailsEmail;
            return `Email: "${details.subject}"`;
        }
        case 'Login': {
            const details = activity.details as ActivityDetailsLogin;
            return `From ${details.device} in ${details.location}.`;
        }
        case 'PageView': {
            const details = activity.details as ActivityDetailsPageView;
            return `Viewed: "${details.productName}"`;
        }
        default:
            return '';
    }
};


const ActivityTab: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const iconName = (type: string): keyof typeof Icon.icons => {
    switch (type) {
      case 'Order': return 'shoppingCart';
      case 'Ticket': return 'ticket';
      case 'Profile': return 'user';
      case 'Cart': return 'alertTriangle';
      case 'Email': return 'mail';
      case 'Login': return 'activity';
      case 'PageView': return 'fileText';
      default: return 'zap';
    }
  }

  return (
    <>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Activity Timeline</h3>
        <div className="relative">
          {mockActivities.map((activity, index) => (
            <div key={activity.id} className="relative flex items-center gap-4 pb-8">
              {/* Vertical line connecting the dots */}
              {index < mockActivities.length - 1 && (
                <div className="absolute left-5 top-5 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
              )}

              {/* Icon */}
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex-shrink-0 flex items-center justify-center z-10 ring-8 ring-white dark:ring-gray-800">
                <Icon name={iconName(activity.type)} className="w-5 h-5 text-green-500" />
              </div>

              {/* Card Content */}
              <div className="flex-grow">
                <button onClick={() => setSelectedActivity(activity)} className="w-full text-left">
                  <Card className="p-4 hover:shadow-md hover:border-green-500 dark:hover:border-green-500 transition-all duration-200 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{activity.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatActivityDetails(activity)}</p>
                      </div>
                      <p className="text-xs text-gray-400 whitespace-nowrap">{activity.timestamp}</p>
                    </div>
                  </Card>
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      {selectedActivity && (
        <ActivityPreviewModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </>
  );
};

export default ActivityTab;
