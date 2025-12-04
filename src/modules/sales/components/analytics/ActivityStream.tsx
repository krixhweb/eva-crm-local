
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/Card";
import { Icon } from '../../../../components/shared/Icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/Tabs';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Label } from '../../../../components/ui/Label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../../components/ui/Select';
import { Textarea } from '../../../../components/ui/Textarea';
import { useGlassyToasts } from '../../../../components/ui/GlassyToastProvider';
import type { SalesActivity, SalesTask } from '../../../../types';
import type { RootState } from '../../../../store/store';
import TasksTab from './TasksTab';

// --- Activity Components ---

const ActivityLogForm = ({ onSave }: { onSave: (activity: SalesActivity) => void }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('CALL');
    const [details, setDetails] = useState('');
    const { push } = useGlassyToasts();
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);

    const handleSave = () => {
        if (!title.trim() || !details.trim()) {
            push({ title: "Validation Error", description: "Please fill in all fields.", variant: "error" });
            return;
        }
        const newActivity: SalesActivity = {
            id: `new_${Date.now()}`,
            type: type as any,
            title,
            user: { name: currentUser.name, avatar: currentUser.avatar },
            details,
            timestamp: 'Just now',
            relatedCustomer: { id: 'CUST-001', name: 'Arjun Sharma' }, // Mocked related customer
            createdBy: currentUser.id,
            createdByName: currentUser.name,
            createdAt: new Date().toISOString()
        };
        onSave(newActivity);
        setTitle('');
        setDetails('');
        push({ title: "Activity Logged", description: "Your activity has been saved successfully.", variant: "success" });
    };

    return (
        <Card className="mb-6 border-dashed border-2 shadow-none bg-gray-50/50 dark:bg-gray-800/30">
            <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <Label>Activity Title</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g. Discovery call with client" className="mt-1.5 bg-white dark:bg-gray-900" />
                    </div>
                    <div>
                        <Label>Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="mt-1.5 bg-white dark:bg-gray-900"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CALL">Call</SelectItem>
                                <SelectItem value="EMAIL">Email</SelectItem>
                                <SelectItem value="MEETING">Meeting</SelectItem>
                                <SelectItem value="TASK">Task</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Date</Label>
                        <Input type="date" className="mt-1.5 bg-white dark:bg-gray-900" />
                    </div>
                </div>
                <div>
                    <Label>Notes & Details</Label>
                    <Textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Enter call notes, outcomes, or next steps..." className="mt-1.5 bg-white dark:bg-gray-900 min-h-[80px]" />
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleSave} className="px-6">Log Activity</Button>
                </div>
            </CardContent>
        </Card>
    );
};

const ActivityTimelineItem: React.FC<{ activity: SalesActivity }> = ({ activity }) => {
    const iconMap = {
        'CALL': { icon: 'phone', bg: 'bg-purple-100 text-purple-600', border: 'border-purple-200' },
        'EMAIL': { icon: 'mail', bg: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
        'MEETING': { icon: 'users', bg: 'bg-orange-100 text-orange-600', border: 'border-orange-200' },
        'TASK': { icon: 'check', bg: 'bg-green-100 text-green-600', border: 'border-green-200' },
        'DEAL_WON': { icon: 'dollarSign', bg: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200' },
    };
    const config = iconMap[activity.type] || iconMap['TASK'];

    return (
        <div className="flex gap-4 pb-8 relative last:pb-0 group">
            {/* Line */}
            <div className="absolute left-[19px] top-10 bottom-0 w-px bg-gray-200 dark:bg-gray-800 group-last:hidden"></div>
            
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg} border ${config.border} dark:bg-opacity-20 z-10`}>
                <Icon name={config.icon as any} className="w-5 h-5" />
            </div>
            <div className="flex-1 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{activity.title}</h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{activity.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{activity.details}</p>
                <div className="flex justify-between items-center mt-2">
                    {activity.relatedCustomer && (
                        <div className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 px-2 py-1 rounded w-fit">
                            <Icon name="user" className="w-3 h-3" />
                            {activity.relatedCustomer.name}
                        </div>
                    )}
                    <span className="text-[10px] text-gray-400 italic">
                        Logged by {activity.createdByName || activity.user.name}
                    </span>
                </div>
            </div>
        </div>
    );
};

interface ActivityStreamProps {
    activities: SalesActivity[];
    tasks: SalesTask[];
    onAddActivity: (activity: SalesActivity) => void;
    onAddTask: (task: SalesTask) => void;
}

const ActivityStream: React.FC<ActivityStreamProps> = ({ activities, onAddActivity }) => {
    return (
        <Tabs defaultValue="log">
            <div className="flex justify-between items-center mb-6">
                 <TabsList>
                    <TabsTrigger value="log">Activity Log</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="log" className="mt-0">
                <div className="grid grid-cols-1 gap-6">
                    {/* Activity Log Panel */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Log & History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ActivityLogForm onSave={onAddActivity} />
                            
                            <div className="mt-8">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Recent Timeline</h3>
                                <div className="space-y-1 pl-2">
                                    {activities.map((activity) => (
                                        <ActivityTimelineItem key={activity.id} activity={activity} />
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="tasks" className="mt-0">
                <TasksTab />
            </TabsContent>
        </Tabs>
    );
};

export default ActivityStream;
