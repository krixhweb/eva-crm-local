
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../../components/ui/Table';
import { Icon } from '../../../../components/shared/Icon';
import { Badge } from '../../../../components/ui/Badge';
import { Input } from '../../../../components/ui/Input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../../components/ui/Select';
import { Textarea } from '../../../../components/ui/Textarea';
import { useGlassyToasts } from '../../../../components/ui/GlassyToastProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/Tabs';
import { Label } from '../../../../components/ui/Label';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../../../components/ui/DropdownMenu';
import { DatePicker } from '../../../../components/ui/DatePicker';
import { Checkbox } from '../../../../components/ui/Checkbox';
import { cn } from '../../../../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import type { SalesActivity, SalesTask, LeadFormData } from '../../../../types';
import { mockSalesActivities, mockSalesTasks } from '../../../../data/mockData';
import CreateLeadModal from '../../../../components/modals/CreateLeadModal';

// --- SHARED STATE FOR TIMELINE SYNC ---
// In a real app, this would be a Redux slice or Context
let timelineEventsStore = [
    { id: '1', date: 'Today, 10:00 AM', title: 'Campaign Status Updated', desc: 'Status changed from Planned to Active', user: 'Priya Patel', type: 'System', icon: 'refreshCw', color: 'bg-blue-100 text-blue-600' },
    { id: '2', date: 'Yesterday, 4:30 PM', title: 'Creative Assets Uploaded', desc: '3 new banner images added to Files.', user: 'Design Team', type: 'User', icon: 'image', color: 'bg-purple-100 text-purple-600' },
    { id: '3', date: 'Jul 20, 2024', title: 'Budget Approved', desc: 'Budget of ₹50,000 approved by Finance.', user: 'System', type: 'System', icon: 'checkCircle', color: 'bg-green-100 text-green-600' },
    { id: '4', date: 'Jul 18, 2024', title: 'Note Added', desc: 'discussed target audience strategy.', user: 'Priya Patel', type: 'Note', icon: 'fileText', color: 'bg-yellow-100 text-yellow-600' },
    { id: '5', date: 'Jul 18, 2024', title: 'Campaign Created', desc: 'Campaign initialized in draft mode.', user: 'Priya Patel', type: 'User', icon: 'plus', color: 'bg-gray-100 text-gray-600' },
];

const listeners: Array<() => void> = [];

const subscribe = (listener: () => void) => {
    listeners.push(listener);
    return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
    };
};

const emitChange = () => {
    listeners.forEach(l => l());
};

const addTimelineEvent = (event: any) => {
    timelineEventsStore = [event, ...timelineEventsStore];
    emitChange();
};

const removeTimelineEvent = (activityId: string) => {
    // Remove by ID or by reference ID (e.g. timeline_t_...)
    timelineEventsStore = timelineEventsStore.filter(e => e.id !== activityId && e.id !== `timeline_${activityId}`);
    emitChange();
};


// --- 1. TIMELINE COMPONENT ---
export const CampaignTimeline = () => {
    const [events, setEvents] = useState(timelineEventsStore);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        return subscribe(() => setEvents([...timelineEventsStore]));
    }, []);
    
    const filteredEvents = filter === 'All' ? events : events.filter(e => e.type === filter);

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Activity History</h3>
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[150px] h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Activity</SelectItem>
                        <SelectItem value="Note">Notes</SelectItem>
                        <SelectItem value="System">System Logs</SelectItem>
                        <SelectItem value="User">User Actions</SelectItem>
                        <SelectItem value="Activity">Sales Activities</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="relative pl-4 border-l border-gray-200 dark:border-zinc-800 space-y-8">
                {filteredEvents.map((e) => (
                    <div key={e.id} className="relative pl-6">
                        <div className={`absolute -left-[25px] top-0 h-10 w-10 rounded-full border-4 border-gray-50 dark:border-zinc-900 flex items-center justify-center ${e.color}`}>
                            <Icon name={e.icon as any} className="w-5 h-5" />
                        </div>
                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{e.title}</h4>
                                <span className="text-xs text-gray-400">{e.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{e.desc}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">{e.type}</Badge>
                                <p className="text-xs text-gray-400">by {e.user}</p>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredEvents.length === 0 && <p className="text-gray-500 text-sm pl-6">No activities found for this filter.</p>}
            </div>
        </div>
    );
};


// --- 2. LEADS COMPONENT ---
export const CampaignLeads = ({ campaignId }: { campaignId: string }) => {
    const { push } = useGlassyToasts();
    const [leads, setLeads] = useState([
        { id: 'L-101', name: 'Rahul Verma', company: 'TechStart', status: 'New', email: 'rahul@techstart.io', date: 'Jul 25, 2024' },
        { id: 'L-102', name: 'Sneha Gupta', company: 'Creative Inc', status: 'Qualified', email: 'sneha@creative.com', date: 'Jul 24, 2024' },
        { id: 'L-103', name: 'Amit Shah', company: 'Global Sol', status: 'Contacted', email: 'amit@globalsol.com', date: 'Jul 22, 2024' },
    ]);
    const [search, setSearch] = useState('');
    const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);

    const handleCreateLead = (data: LeadFormData) => {
        const newLead = { 
            id: `L-${Date.now()}`, 
            name: data.templateType === 'company' ? data.companyName : `${data.firstName} ${data.lastName}`, 
            company: data.templateType === 'company' ? data.companyName : 'Individual', 
            status: 'New', 
            email: data.email || 'N/A', 
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
        };
        setLeads([newLead, ...leads]);
        setIsCreateLeadOpen(false);
        push({ title: "Lead Added", description: `${newLead.name} has been associated with this campaign.`, variant: "success" });
    };

    const filteredLeads = leads.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.company.toLowerCase().includes(search.toLowerCase()));

    return (
        <>
            <Card className="animate-in fade-in">
                <CardHeader>
                    <CardTitle>Associated Leads ({leads.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                        <div className="relative w-full md:w-72">
                             <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                             <Input placeholder="Search leads..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700 text-white" onClick={() => setIsCreateLeadOpen(true)}>
                            <Icon name="plus" className="w-4 h-4" /> Add Lead
                        </Button>
                    </div>

                    <div className="rounded-md border dark:border-zinc-800 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 dark:bg-zinc-800/50">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-right">Date Added</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLeads.map(lead => (
                                    <TableRow key={lead.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <TableCell className="font-medium text-blue-600">{lead.name}</TableCell>
                                        <TableCell>{lead.company}</TableCell>
                                        <TableCell>
                                            <Badge variant={lead.status === 'New' ? 'blue' : lead.status === 'Qualified' ? 'green' : 'gray'}>
                                                {lead.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{lead.email}</TableCell>
                                        <TableCell className="text-right text-gray-500">{lead.date}</TableCell>
                                    </TableRow>
                                ))}
                                {filteredLeads.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-gray-500">No leads match your search.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {isCreateLeadOpen && (
                <CreateLeadModal 
                    isOpen={isCreateLeadOpen} 
                    onClose={() => setIsCreateLeadOpen(false)} 
                    onCreate={handleCreateLead} 
                />
            )}
        </>
    );
};

// --- 3. CAMPAIGN ACTIVITIES & TASKS ---

const ActivityTimelineItem: React.FC<{ activity: SalesActivity, onDelete: (id: string) => void, onEdit: (activity: SalesActivity) => void }> = ({ activity, onDelete, onEdit }) => {
    const iconMap: any = {
        'CALL': { icon: 'phone', bg: 'bg-purple-100 text-purple-600', border: 'border-purple-200' },
        'EMAIL': { icon: 'mail', bg: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
        'MEETING': { icon: 'users', bg: 'bg-orange-100 text-orange-600', border: 'border-orange-200' },
        'TASK': { icon: 'check', bg: 'bg-green-100 text-green-600', border: 'border-green-200' },
        'DEAL_WON': { icon: 'dollarSign', bg: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200' },
        'NOTE': { icon: 'fileText', bg: 'bg-yellow-100 text-yellow-600', border: 'border-yellow-200' },
    };
    const config = iconMap[activity.type] || iconMap['TASK'];

    return (
        <div className="flex gap-4 pb-8 relative last:pb-0 group">
            {/* Line */}
            <div className="absolute left-[19px] top-10 bottom-0 w-px bg-gray-200 dark:bg-gray-800 group-last:hidden"></div>
            
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg} border ${config.border} dark:bg-opacity-20 z-10`}>
                <Icon name={config.icon as any} className="w-5 h-5" />
            </div>
            <div className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 hover:shadow-sm transition-shadow group-hover:border-gray-300 dark:group-hover:border-zinc-700 relative">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{activity.title}</h4>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 whitespace-nowrap">{activity.timestamp}</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
                                    <Icon name="moreVertical" className="w-3.5 h-3.5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onEdit(activity)}>Edit Activity</DropdownMenuItem>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => onDelete(activity.id)}>Delete Activity</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{activity.details}</p>
                <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-2">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{activity.type}</Badge>
                    </div>
                    <span className="text-[10px] text-gray-400 italic">
                        Logged by {activity.createdByName || 'System'}
                    </span>
                </div>
            </div>
        </div>
    );
};

const TaskItem = React.memo(({ task, onToggle, onDelete }: { task: SalesTask, onToggle: (id: string, status: 'Open' | 'Completed') => void, onDelete: (id: string) => void }) => {
    const isCompleted = task.status === 'Completed';
    const isOverdue = !isCompleted && task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));
    
    const getPriorityColor = (p: string) => {
        if (p === 'High') return 'text-red-700 bg-red-50 border-red-200 dark:bg-red-900/30';
        if (p === 'Medium') return 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-900/30';
        return 'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-900/30';
    };
    const getPriorityBorder = (p: string) => {
        if (p === 'High') return 'border-l-red-500';
        if (p === 'Medium') return 'border-l-amber-500';
        return 'border-l-blue-500';
    };

    return (
        <motion.div 
            {...({ layout: "position" } as any)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "group relative flex items-start gap-4 p-4 rounded-xl border mb-3 transition-all duration-200 ease-in-out hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800",
                isCompleted ? "opacity-60 bg-gray-50 dark:bg-zinc-950" : `border-l-[4px] ${getPriorityBorder(task.priority)}`
            )}
        >
            <div className="pt-1">
                <Checkbox checked={isCompleted} onCheckedChange={(checked) => onToggle(task.id, checked ? 'Completed' : 'Open')} className={cn("transition-colors", isCompleted ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" : "")} />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex justify-between items-start">
                    <h4 className={cn("text-sm font-semibold truncate pr-2 transition-all", isCompleted ? "text-gray-500 line-through" : "text-gray-900 dark:text-gray-100")}>{task.title}</h4>
                    <Badge className={cn("text-[10px] px-2 py-0.5 border", getPriorityColor(task.priority))}>{task.priority}</Badge>
                </div>
                {task.description && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{task.description}</p>}
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs">
                    <div className={cn("flex items-center gap-1.5 font-medium", isOverdue ? "text-red-500" : isCompleted ? "text-green-600" : "text-gray-500 dark:text-gray-400")}>
                        <Icon name={isOverdue ? "alertCircle" : "calendar"} className="w-3.5 h-3.5" />
                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date'}</span>
                    </div>
                    <div className="ml-auto flex items-center text-[10px] text-gray-400 gap-2">
                        <Icon name="user" className="w-3 h-3" /> {task.assignee}
                    </div>
                </div>
            </div>
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <Icon name="moreVertical" className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Task</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onClick={() => onDelete(task.id)}>Delete Task</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </motion.div>
    );
});

export const CampaignActivities = () => {
    const { push } = useGlassyToasts();
    
    // State for Activities
    const [activities, setActivities] = useState<SalesActivity[]>(mockSalesActivities.slice(0, 3));
    const [logTitle, setLogTitle] = useState('');
    const [logType, setLogType] = useState('CALL');
    const [logDate, setLogDate] = useState<Date | null>(new Date());
    const [logDetails, setLogDetails] = useState('');
    const [editingActivityId, setEditingActivityId] = useState<string | null>(null);

    // State for Tasks
    const [tasks, setTasks] = useState<SalesTask[]>(mockSalesTasks.slice(0, 3));
    const [filterTaskStatus, setFilterTaskStatus] = useState('All');
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskDate, setNewTaskDate] = useState<Date | null>(new Date());
    const [newTaskPriority, setNewTaskPriority] = useState('Medium');
    const [newTaskAssignee, setNewTaskAssignee] = useState('Me');

    // --- Activity Handlers ---

    const handleLogActivity = () => {
        if (!logTitle.trim() || !logDetails.trim()) {
            push({ title: "Validation Error", description: "Title and details are required.", variant: "error" });
            return;
        }

        if (editingActivityId) {
            // Update
            setActivities(prev => prev.map(a => a.id === editingActivityId ? { 
                ...a, 
                title: logTitle, 
                type: logType as any, 
                details: logDetails, 
                timestamp: 'Just now (Edited)' 
            } : a));
            
            // Sync update to timeline
            addTimelineEvent({
                id: `timeline_update_${Date.now()}`,
                date: 'Just now',
                title: `${logType.charAt(0) + logType.slice(1).toLowerCase()} Updated`,
                desc: `Updated: ${logTitle}`,
                user: 'Current User',
                type: 'Activity',
                icon: 'edit2',
                color: 'bg-blue-100 text-blue-600'
            });

            push({ title: "Activity Updated", description: "Changes saved.", variant: "success" });
            setEditingActivityId(null);
        } else {
            // Create
            const newActivity: SalesActivity = {
                id: `new_${Date.now()}`,
                title: logTitle,
                type: logType as any,
                details: logDetails,
                timestamp: 'Just now',
                user: { name: 'Current User', avatar: 'CU' },
                createdByName: 'Current User',
                createdAt: new Date().toISOString()
            };
            setActivities([newActivity, ...activities]);
            
            // Sync with Timeline
            addTimelineEvent({
                id: `timeline_${Date.now()}`,
                date: 'Just now',
                title: `${logType.charAt(0) + logType.slice(1).toLowerCase()} Logged`,
                desc: logTitle,
                user: 'Current User',
                type: 'Activity',
                icon: 'activity',
                color: 'bg-indigo-100 text-indigo-600'
            });

            push({ title: "Activity Logged", description: "Activity added to campaign history.", variant: "success" });
        }

        // Reset Form
        setLogTitle('');
        setLogDetails('');
        setLogType('CALL');
        setLogDate(new Date());
    };

    const handleEditActivity = (activity: SalesActivity) => {
        setLogTitle(activity.title);
        setLogType(activity.type);
        setLogDetails(activity.details);
        setEditingActivityId(activity.id);
        // Scroll to top of form
        const form = document.getElementById('activity-log-form');
        if (form) form.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeleteActivity = (id: string) => {
        setActivities(prev => prev.filter(a => a.id !== id));
        // Remove from timeline if linked (mock logic - assumes timeline events share IDs or handled via generic clear)
        removeTimelineEvent(id); 
        push({ title: "Activity Deleted", variant: "info" });
    };

    // --- Task Handlers ---

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;
        const newTask: SalesTask = {
            id: `t_${Date.now()}`,
            title: newTaskTitle,
            description: newTaskDescription,
            status: 'Open',
            priority: newTaskPriority as any,
            dueDate: newTaskDate ? newTaskDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            assignee: newTaskAssignee,
            createdByName: 'Current User',
            createdAt: new Date().toISOString()
        };
        setTasks([newTask, ...tasks]);
        
        // Sync with Timeline
        addTimelineEvent({
            id: `timeline_t_${Date.now()}`,
            date: 'Just now',
            title: 'New Task Created',
            desc: `Task: ${newTaskTitle}`,
            user: 'Current User',
            type: 'System',
            icon: 'checkSquare',
            color: 'bg-green-100 text-green-600'
        });

        setNewTaskTitle('');
        setNewTaskDescription('');
        setIsAddTaskOpen(false);
        push({ title: "Task Added", description: "Task created successfully.", variant: "success" });
    };

    const handleToggleTask = (id: string, status: 'Open' | 'Completed') => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
        if (status === 'Completed') {
            push({ title: "Task Completed", description: "Great job!", variant: "success" });
             // Sync with Timeline
            const task = tasks.find(t => t.id === id);
            if (task) {
                addTimelineEvent({
                    id: `timeline_tc_${Date.now()}`,
                    date: 'Just now',
                    title: 'Task Completed',
                    desc: task.title,
                    user: 'Current User',
                    type: 'System',
                    icon: 'check',
                    color: 'bg-teal-100 text-teal-600'
                });
            }
        }
    };

    const handleDeleteTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
        removeTimelineEvent(id);
        push({ title: "Task Deleted", variant: "info" });
    };

    // Filter Tasks
    const filteredTasks = tasks.filter(t => filterTaskStatus === 'All' || (filterTaskStatus === 'Completed' ? t.status === 'Completed' : t.status !== 'Completed'));
    const sortedTasks = [...filteredTasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    return (
        <Tabs defaultValue="log" className="animate-in fade-in">
            <div className="flex justify-between items-center mb-6">
                 <TabsList className="w-full justify-start border-b dark:border-zinc-800 rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger 
                        value="log" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:text-green-600 px-6 py-2"
                    >
                        Activity Log
                    </TabsTrigger>
                    <TabsTrigger 
                        value="tasks" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:text-green-600 px-6 py-2"
                    >
                        Tasks
                    </TabsTrigger>
                </TabsList>
            </div>

            {/* --- TAB 1: ACTIVITY LOG --- */}
            <TabsContent value="log" className="mt-0">
                <div className="grid grid-cols-1 gap-8">
                    {/* Activity Form */}
                    <div id="activity-log-form">
                        <div className="bg-gray-50/50 dark:bg-zinc-900/30 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    {editingActivityId ? "Edit Activity" : "Log New Activity"}
                                </h4>
                                {editingActivityId && (
                                    <Button variant="ghost" size="sm" onClick={() => { setEditingActivityId(null); setLogTitle(''); setLogDetails(''); }} className="h-6 text-xs">Cancel Edit</Button>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-2 space-y-1.5">
                                        <Label>Title</Label>
                                        <Input value={logTitle} onChange={e => setLogTitle(e.target.value)} placeholder="E.g. Strategy Meeting" className="bg-white dark:bg-zinc-950" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Type</Label>
                                        <Select value={logType} onValueChange={setLogType}>
                                            <SelectTrigger className="bg-white dark:bg-zinc-950"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="CALL">Call</SelectItem>
                                                <SelectItem value="MEETING">Meeting</SelectItem>
                                                <SelectItem value="EMAIL">Email</SelectItem>
                                                <SelectItem value="NOTE">Note</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Date</Label>
                                        <DatePicker value={logDate} onChange={setLogDate} className="bg-white dark:bg-zinc-950 w-full" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Details</Label>
                                    <Textarea value={logDetails} onChange={e => setLogDetails(e.target.value)} placeholder="Enter details..." className="bg-white dark:bg-zinc-950 min-h-[80px]" />
                                </div>
                                <div className="flex justify-end">
                                    <Button onClick={handleLogActivity} className="px-6 bg-green-600 hover:bg-green-700 text-white">
                                        {editingActivityId ? "Update Activity" : "Log Activity"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Recent Timeline</h3>
                        <div className="space-y-1 pl-2">
                            {activities.map((activity) => (
                                <ActivityTimelineItem 
                                    key={activity.id} 
                                    activity={activity} 
                                    onDelete={handleDeleteActivity} 
                                    onEdit={handleEditActivity}
                                />
                            ))}
                            {activities.length === 0 && <p className="text-gray-500 text-sm text-center py-8">No activities logged yet.</p>}
                        </div>
                    </div>
                </div>
            </TabsContent>

            {/* --- TAB 2: TASKS --- */}
            <TabsContent value="tasks" className="mt-0">
                <div className="space-y-6">
                    {/* Task Toolbar */}
                    <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex items-center gap-4">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Tasks</h3>
                            <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-lg p-1">
                                {['All', 'Open', 'Completed'].map(s => (
                                    <button 
                                        key={s}
                                        onClick={() => setFilterTaskStatus(s)}
                                        className={cn(
                                            "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                            filterTaskStatus === s ? "bg-white dark:bg-zinc-600 shadow text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700"
                                        )}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Button onClick={() => setIsAddTaskOpen(!isAddTaskOpen)} variant={isAddTaskOpen ? 'outline' : 'default'} className={isAddTaskOpen ? "" : "bg-green-600 hover:bg-green-700 text-white"}>
                            <Icon name={isAddTaskOpen ? "close" : "plus"} className="w-4 h-4 mr-2" /> {isAddTaskOpen ? "Cancel" : "Add Task"}
                        </Button>
                    </div>

                    {/* Add Task Form (Inline) */}
                    {isAddTaskOpen && (
                        <Card className="border-green-500/20 shadow-md animate-in fade-in slide-in-from-top-2">
                            <CardContent className="p-4 space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-green-600">New Task Details</h4>
                                <div className="space-y-3">
                                    <Input autoFocus placeholder="What needs to be done?" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} className="font-medium" />
                                    <Textarea 
                                        placeholder="Details or description (optional)..." 
                                        value={newTaskDescription} 
                                        onChange={(e) => setNewTaskDescription(e.target.value)} 
                                        className="min-h-[60px] text-sm resize-none bg-gray-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800"
                                    />
                                    <div className="flex gap-4 flex-wrap md:flex-nowrap">
                                        <div className="flex-1 min-w-[140px]">
                                            <Label className="text-xs mb-1 block">Due Date</Label>
                                            <DatePicker value={newTaskDate} onChange={setNewTaskDate} className="h-9 w-full" />
                                        </div>
                                        <div className="flex-1 min-w-[140px]">
                                            <Label className="text-xs mb-1 block">Priority</Label>
                                            <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                                                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="High">High</SelectItem>
                                                    <SelectItem value="Medium">Medium</SelectItem>
                                                    <SelectItem value="Low">Low</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex-1 min-w-[140px]">
                                            <Label className="text-xs mb-1 block">Assignee</Label>
                                            <Select value={newTaskAssignee} onValueChange={setNewTaskAssignee}>
                                                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Me">Me</SelectItem>
                                                    <SelectItem value="Team">Team</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button size="sm" onClick={handleAddTask} disabled={!newTaskTitle.trim()}>Save Task</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Task List */}
                    <div className="space-y-2">
                        {sortedTasks.map(task => (
                            <TaskItem 
                                key={task.id} 
                                task={task} 
                                onToggle={handleToggleTask} 
                                onDelete={handleDeleteTask} 
                            />
                        ))}
                        {sortedTasks.length === 0 && (
                            <div className="text-center py-12 bg-gray-50/50 dark:bg-zinc-900/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-800">
                                <Icon name="checkCircle" className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500 text-sm font-medium">No tasks found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
};

// --- 5. CAMPAIGN NOTES (Existing - Kept for completeness) ---
export const CampaignNotes = () => {
    const { push } = useGlassyToasts();
    const [notes, setNotes] = useState([
        { id: 1, text: 'Discussed the Q3 budget allocation.', author: 'John Doe', time: '2 hours ago', avatar: 'JD' },
    ]);
    const [input, setInput] = useState('');

    const handleSave = () => {
        if (!input.trim()) return;
        setNotes([{ id: Date.now(), text: input, author: 'Current User', time: 'Just now', avatar: 'CU' }, ...notes]);
        setInput('');
        push({ title: "Note Added", variant: "success" });
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <div className="p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                        <Icon name="edit2" className="w-4 h-4" /> Write a note...
                    </div>
                    <textarea 
                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
                        rows={3}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end mt-2">
                         <Button size="sm" onClick={handleSave} disabled={!input.trim()}>Save Note</Button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {notes.map(note => (
                    <div key={note.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">{note.avatar}</div>
                                <div>
                                    <span className="text-sm font-semibold block leading-none">{note.author}</span>
                                    <span className="text-[10px] text-gray-400">{note.time}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 pl-10">{note.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 6. CAMPAIGN FILES (Existing - Kept for completeness) ---
export const CampaignFiles = () => {
    const { push } = useGlassyToasts();
    return (
        <Card className="animate-in fade-in">
            <CardHeader><CardTitle>Attachments</CardTitle></CardHeader>
            <CardContent>
                <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900" onClick={() => push({ title: "Upload", description: "File upload dialog would open here.", variant: "info" })}>
                    <Icon name="paperclip" className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload files</p>
                </div>
            </CardContent>
        </Card>
    );
};
