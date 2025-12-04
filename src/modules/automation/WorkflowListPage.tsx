
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/shared/Icon";
import { mockWorkflows } from '../../data/mockData';

const WorkflowListPage = () => {
  const navigate = useNavigate();
  
  const stats = [
    { label: "Active Workflows", value: "12", iconName: 'zap' as const, color: "text-green-600" },
    { label: "Total Runs", value: "4,567", iconName: 'trendingUp' as const, color: "text-blue-600" },
    { label: "Time Saved", value: "124h", iconName: 'clock' as const, color: "text-purple-600" },
    { label: "Success Rate", value: "98.5%", iconName: 'checkCircle' as const, color: "text-green-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Workflows</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and monitor your automation workflows</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/automation/workflows/builder')}>
          <Icon name="plus" className="h-4 w-4" />
          Create Workflow
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 ${stat.color}`}>
                  <Icon name={stat.iconName} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockWorkflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{workflow.type}</Badge>
                    <Badge variant={workflow.status === 'Active' ? "green" : "gray"}>{workflow.status}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/automation/workflows/builder')}>Edit</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Trigger</span>
                  <span className="font-medium">{workflow.trigger}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Actions</span>
                  <span className="font-medium">{workflow.actions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total Runs</span>
                  <span className="font-medium">{workflow.runs}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Success Rate</span>
                  <span className="font-medium text-green-600">{workflow.success}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default WorkflowListPage;
