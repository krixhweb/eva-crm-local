
import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '../ui/Drawer';
import type { Activity, ActivityDetailsCart, ActivityDetailsEmail, ActivityDetailsLogin, ActivityDetailsOrder, ActivityDetailsPageView, ActivityDetailsProfile, ActivityDetailsTicket } from '../../types';

interface ActivityPreviewModalProps {
  activity: Activity;
  onClose: () => void;
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-200 dark:border-gray-800 last:border-b-0">
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="text-sm text-gray-900 dark:text-gray-100 col-span-2 break-words">{value}</dd>
    </div>
);

const renderActivityDetails = (activity: Activity) => {
    if (typeof activity.details === 'string') {
        return <p>{activity.details}</p>;
    }

    switch (activity.type) {
        case 'Order': {
            const details = activity.details as ActivityDetailsOrder;
            return (
                <dl>
                    <DetailRow label="Order ID" value={details.orderId} />
                    <DetailRow label="Total Value" value={details.value} />
                    <DetailRow label="Items" value={details.items} />
                    <DetailRow label="Status" value={details.status} />
                </dl>
            );
        }
        case 'Ticket': {
            const details = activity.details as ActivityDetailsTicket;
             return (
                <dl>
                    <DetailRow label="Ticket ID" value={details.ticketId} />
                    <DetailRow label="Subject" value={details.subject} />
                    <DetailRow label="Status" value={details.status} />
                </dl>
            );
        }
        case 'Profile': {
            const details = activity.details as ActivityDetailsProfile;
            return (
                <dl>
                    <DetailRow label="Field Updated" value="Email Address" />
                    <DetailRow label="From" value={details.from} />
                    <DetailRow label="To" value={details.to} />
                </dl>
            );
        }
        case 'Cart': {
            const details = activity.details as ActivityDetailsCart;
            return (
                <dl>
                    <DetailRow label="Action" value="Abandoned" />
                    <DetailRow label="Cart Value" value={details.value} />
                    <DetailRow label="Items" value={details.items} />
                </dl>
            );
        }
        case 'Email': {
            const details = activity.details as ActivityDetailsEmail;
            return (
                <dl>
                    <DetailRow label="Email Subject" value={details.subject} />
                    <DetailRow label="Campaign" value={details.campaign} />
                </dl>
            );
        }
        case 'Login': {
            const details = activity.details as ActivityDetailsLogin;
            return (
                <dl>
                    <DetailRow label="IP Address" value={details.ipAddress} />
                    <DetailRow label="Device" value={details.device} />
                    <DetailRow label="Location" value={details.location} />
                </dl>
            );
        }
        case 'PageView': {
            const details = activity.details as ActivityDetailsPageView;
            return (
                <dl>
                    <DetailRow label="Product Name" value={details.productName} />
                    <DetailRow label="Product ID" value={details.productId} />
                    <DetailRow label="URL" value={<a href="#" className="text-blue-500 hover:underline">{details.url}</a>} />
                </dl>
            );
        }
        default:
            return <p>No details available for this activity type.</p>;
    }
}

const ActivityPreviewModal: React.FC<ActivityPreviewModalProps> = ({ activity, onClose }) => {
    return (
        <Drawer open={true} onOpenChange={onClose}>
            <DrawerContent className="w-full md:w-[900px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl" resizable>
                <DrawerHeader className="border-b px-6 py-4 bg-white dark:bg-zinc-900">
                    <DrawerTitle>{activity.title}</DrawerTitle>
                    <DrawerDescription>{activity.timestamp}</DrawerDescription>
                </DrawerHeader>
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-zinc-950/50">
                    {renderActivityDetails(activity)}
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default ActivityPreviewModal;
