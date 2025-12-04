
import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Icon } from '../../../components/shared/Icon';
import { mockCommunications } from '../../../data/mockData';

const CommunicationsTab: React.FC = () => {
  const getIcon = (channel: string): keyof typeof Icon.icons => {
    switch(channel) {
      case 'Email': return 'mail';
      case 'SMS': return 'messageSquare';
      case 'Phone': return 'phone';
      case 'Chat': return 'messageCircle';
      default: return 'zap';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-4">
        {mockCommunications.map(comm => (
          <Card key={comm.id} className="p-4">
            <div className="flex items-start gap-4">
              <Icon name={getIcon(comm.channel)} className="w-5 h-5 mt-1 text-gray-500"/>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{comm.subject}</p>
                  <p className="text-xs text-gray-400">{comm.timestamp}</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{comm.preview}</p>
                <div className="text-xs mt-2">{comm.direction === 'Sent' ? 'Sent by Admin' : 'Received from Customer'}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="lg:col-span-1">
        <Card className="p-4 sticky top-6">
          <h3 className="text-lg font-semibold mb-4">Quick Send</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition">
              <Icon name="mail" className="w-4 h-4"/> Send Email
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition">
              <Icon name="messageSquare" className="w-4 h-4"/> Send SMS
            </button>
             <button className="w-full flex items-center justify-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 transition">
              <Icon name="phone" className="w-4 h-4"/> Schedule Call
            </button>
             <button className="w-full flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition">
              <Icon name="fileText" className="w-4 h-4"/> Log Communication
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CommunicationsTab;
