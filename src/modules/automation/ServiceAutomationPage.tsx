
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/shared/Icon";
import type { ServiceAutomation } from '../../types';
import { mockServiceAutomations } from '../../data/mockData';

const ServiceAutomationPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Service Automation</h1>
        <p className="text-gray-500 dark:text-gray-400">Pre-built support workflows to improve efficiency</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockServiceAutomations.map((automation) => (
          <Card key={automation.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-lg bg-green-100/50 dark:bg-green-900/20 text-green-600">
                    <Icon name={automation.iconName as keyof typeof Icon.icons} className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{automation.name}</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{automation.description}</p>
                  </div>
                </div>
                <Button key={automation.id} variant="ghost" size="icon" className={automation.status === 'Active' ? 'text-green-600' : 'text-gray-500'}>
                  <Icon name={automation.status === 'Active' ? 'pause' : 'play'} className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={automation.status === "Active" ? "green" : "gray"}>{automation.status}</Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">Trigger: {automation.trigger}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Runs</p>
                  <p className="text-2xl font-bold">{automation.runs}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Time Saved</p>
                  <p className="text-2xl font-bold text-green-600">{automation.saved}h</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Success</p>
                  <p className="text-2xl font-bold text-green-600">{automation.success}%</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">View Details</Button>
                <Button variant="outline" size="sm" className="flex-1">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default ServiceAutomationPage;
