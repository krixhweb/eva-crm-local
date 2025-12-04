import React from 'react';
import { Card } from './Card';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="p-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400">This feature is coming soon.</p>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
