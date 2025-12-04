
import React, { useState, useMemo, useCallback, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader } from "../../../../components/ui/Card";
import { Icon } from '../../../../components/shared/Icon';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Label } from '../../../../components/ui/Label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
import { Badge } from '../../../../components/ui/Badge';
import { Textarea } from '../../../../components/ui/Textarea';
import { useGlassyToasts } from '../../../../components/ui/GlassyToastProvider';
import type { SalesTask } from '../../../../types';
import { cn } from '../../../../lib/utils';
import type { RootState } from '../../../../store/store';
import { motion, AnimatePresence } from 'framer-motion';
import { slideUp, staggerContainer } from '../../../../lib/motion';

// --- Types & Interfaces ---

interface TaskFilters {
    search: string;
    priority: string;
    status: string;
    assignee: string;
}

interface AddTaskFormHandle { 
    openForm: (date?: string) => void; 
}

interface AddTaskFormProps {
    onSave: (task: SalesTask) => void;
}

interface TaskItemProps {
    task: SalesTask;
    onToggle: (id: string, status: 'Open' | 'Completed') => void;
    onDelete: (id: string) => void;
}

interface MiniCalendarViewProps {
    tasks: SalesTask[];
    selectedDate: string | null;
    onSelectDate: (date: string | null) => void;
    onQuickAdd: () => void;
}

// --- Constants & Helpers ---

const MOCK_TASKS: SalesTask[] = [
    { id: 't1', title: 'Follow up with John Doe', description: 'Call about the new proposal terms and negotiate pricing.', dueDate: new Date().toISOString().split('T')[0], priority: 'High', status: 'Open', assignee: 'Priya Patel', relatedLead: 'John Doe', tags: ['Call', 'Urgent'], isOverdue: false, createdByName: 'System', createdAt: new Date().toISOString() },
    { id: 't2', title: 'Prepare Q3 Presentation', description: 'Gather metrics from marketing and sales teams.', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], priority: 'Medium', status: 'Open', assignee: 'Rohan Kumar', relatedLead: 'Acme Corp', tags: ['Presentation'], isOverdue: false, createdByName: 'System', createdAt: new Date().toISOString() },
    { id: 't3', title: 'Email campaign review', description: 'Check draft for summer sale before approval.', dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], priority: 'Low', status: 'Overdue', assignee: 'Ananya Singh', relatedLead: 'Marketing', tags: ['Email'], isOverdue: true, createdByName: 'System', createdAt: new Date().toISOString() },
    { id: 't4', title: 'Client meeting: TechStart', description: 'Discuss contract renewal options.', dueDate: new Date().toISOString().split('T')[0], priority: 'High', status: 'Completed', assignee: 'Priya Patel', relatedLead: 'TechStart', tags: ['Meeting'], isOverdue: false, createdByName: 'System', createdAt: new Date().toISOString(), completedBy: 'u_002', completedByName: 'Priya Patel', completedAt: new Date().toISOString() },
    { id: 't5', title: 'Update CRM records', description: 'Clean up old leads from Q1.', dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], priority: 'Low', status: 'Open', assignee: 'Rohan Kumar', tags: ['Admin'], isOverdue: false, createdByName: 'System', createdAt: new Date().toISOString() },
];

const PRIORITIES = ['All', 'High', 'Medium', 'Low'];
const STATUSES = ['All', 'Open', 'Completed', 'Overdue'];

const getTodayStr = () => new Date().toISOString().split('T')[0];

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'High': return 'text-red-700 bg-red-50 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
        case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
        case 'Low': return 'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
        default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
};

const getPriorityBorder = (priority: string) => {
    switch (priority) {
        case 'High': return 'border-l-red-500';
        case 'Medium': return 'border-l-amber-500';
        case 'Low': return 'border-l-blue-500';
        default: return 'border-l-gray-300';
    }
};

const formatTaskDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = new Date(today.setDate(today.getDate() + 1)).toDateString() === date.toDateString();
    
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const useTaskManager = () => {
    const [tasks, setTasks] = useState<SalesTask[]>(MOCK_TASKS);
    const { push } = useGlassyToasts();
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    
    const createTask = useCallback((task: SalesTask) => {
        const taskWithMeta = { ...task, createdBy: currentUser.id, createdByName: currentUser.name, createdAt: new Date().toISOString() };
        setTasks(prev => [taskWithMeta, ...prev]);
        push({ title: "Success", description: "Task created successfully.", variant: "success" });
    }, [push, currentUser]);

    const updateTaskStatus = useCallback((id: string, status: 'Open' | 'Completed') => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                const isCompleting = status === 'Completed';
                return { ...t, status, updatedBy: currentUser.id, updatedByName: currentUser.name, updatedAt: new Date().toISOString(), completedBy: isCompleting ? currentUser.id : undefined, completedByName: isCompleting ? currentUser.name : undefined, completedAt: isCompleting ? new Date().toISOString() : undefined };
            }
            return t;
        }));
    }, [currentUser]);

    const deleteTask = useCallback((id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
        push({ title: "Deleted", description: "Task removed.", variant: "info" });
    }, [push]);

    return { tasks, createTask, updateTaskStatus, deleteTask };
};

// --- Components ---

const TaskItem = React.memo<TaskItemProps>(({ task, onToggle, onDelete }) => {
    const isCompleted = task.status === 'Completed';
    const isOverdue = !isCompleted && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));
    
    return (
        <motion.div 
            {...({ layout: "position" } as any)}
            variants={slideUp}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className={cn(
                "group relative flex items-start gap-4 p-4 rounded-xl border mb-3 transition-all duration-200 ease-in-out hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-700",
                isCompleted ? "opacity-60 bg-gray-50 dark:bg-gray-900/50" : `border-l-[4px] ${getPriorityBorder(task.priority)}`
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
                        <span>{formatTaskDate(task.dueDate)}</span>
                    </div>
                    {task.relatedLead && <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md"><Icon name="user" className="w-3 h-3" /><span>{task.relatedLead}</span></div>}
                    {task.tags && task.tags.length > 0 && <div className="flex items-center gap-1.5 text-gray-500"><Icon name="tag" className="w-3 h-3" /><span>{task.tags.join(', ')}</span></div>}
                    <div className="ml-auto flex items-center text-[10px] text-gray-400 gap-2">
                        {isCompleted && task.completedByName ? <span title={`Completed on ${new Date(task.completedAt!).toLocaleString()}`}>Done by {task.completedByName}</span> : task.createdByName && <span title={`Created on ${new Date(task.createdAt!).toLocaleString()}`}>By {task.createdByName}</span>}
                    </div>
                </div>
            </div>
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDelete(task.id)}>
                    <Icon name="close" className="h-4 w-4" />
                </Button>
            </div>
        </motion.div>
    );
});
TaskItem.displayName = "TaskItem";

const AddTaskForm = forwardRef<AddTaskFormHandle, AddTaskFormProps>(({ onSave }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [priority, setPriority] = useState<string>('Medium');
    const [tags, setTags] = useState('');
    const { push } = useGlassyToasts();
    const todayStr = getTodayStr();

    useImperativeHandle(ref, () => ({
        openForm: (prefillDate?: string) => {
            const today = getTodayStr();
            setDate(prefillDate && prefillDate < today ? today : (prefillDate || today));
            setIsOpen(true);
        }
    }));

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') setIsOpen(false);
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, title, date]);

    const handleSubmit = () => {
        if (!title.trim()) return;
        if (date && date < todayStr) {
            push({ title: "Invalid Date", description: "Tasks cannot be assigned to past dates.", variant: "error" });
            return;
        }
        onSave({
            id: `t-${Date.now()}`,
            title,
            description,
            dueDate: date || todayStr,
            priority: priority as any,
            status: 'Open',
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            assignee: 'Me'
        });
        setTitle(''); setDescription(''); setTags(''); setTime(''); setIsOpen(false);
    };

    if (!isOpen) return (
        <Button onClick={() => setIsOpen(true)} variant="outline" className="w-full mb-6 h-12 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 hover:border-green-500 hover:text-green-600 transition-all bg-gray-50/50 dark:bg-gray-800/50">
            <Icon name="plus" className="h-4 w-4 mr-2" /> Quick Add Task
        </Button>
    );

    return (
        <Card className="mb-6 border-green-500/20 shadow-md animate-in fade-in zoom-in-95 duration-200">
            <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-green-600">New Task</h4>
                    <div className="flex gap-1 items-center">
                        <span className="text-[10px] text-gray-400 mr-2 hidden sm:inline-block">Esc to cancel • ⌘+Enter to save</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsOpen(false)}>
                            <Icon name="close" className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
                <div className="space-y-3">
                    <Input autoFocus placeholder="What needs to be done?" value={title} onChange={(e) => setTitle(e.target.value)} className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none px-0 focus-visible:ring-0 focus-visible:border-green-500 text-base font-medium bg-transparent" />
                    <Textarea 
                        placeholder="Details or description (optional)..." 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        className="min-h-[60px] text-sm resize-none bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-gray-700"
                    />
                    <div className="flex flex-wrap gap-3">
                        <div className="flex-1 min-w-[140px]">
                            <Label className="text-xs text-gray-500 mb-1 block">Due Date</Label>
                            <div className="flex gap-2">
                                <Input type="date" min={todayStr} value={date} onChange={(e) => setDate(e.target.value)} className="h-8 text-xs flex-1" />
                                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-8 text-xs w-20" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-[120px]">
                            <Label className="text-xs text-gray-500 mb-1 block">Priority</Label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="High">High Priority</SelectItem>
                                    <SelectItem value="Medium">Medium Priority</SelectItem>
                                    <SelectItem value="Low">Low Priority</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full">
                            <Label className="text-xs text-gray-500 mb-1 block">Tags</Label>
                            <div className="relative">
                                <Icon name="tag" className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-400" />
                                <Input placeholder="Call, Urgent, Follow-up..." value={tags} onChange={(e) => setTags(e.target.value)} className="h-8 text-xs pl-7" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end pt-2">
                    <Button size="sm" onClick={handleSubmit} disabled={!title.trim()}>Save Task</Button>
                </div>
            </CardContent>
        </Card>
    );
});
AddTaskForm.displayName = "AddTaskForm";

const MiniCalendarView = React.memo<MiniCalendarViewProps>(({ tasks, selectedDate, onSelectDate, onQuickAdd }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const todayStr = getTodayStr();
    
    const calendarData = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { year, month, daysInMonth, firstDay };
    }, [viewDate]);

    const getDayStats = useCallback((day: number) => {
        const dateStr = `${calendarData.year}-${String(calendarData.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayTasks = tasks.filter(t => t.dueDate === dateStr);
        if (dayTasks.length === 0) return null;
        return {
            total: dayTasks.length,
            overdue: dayTasks.filter(t => t.isOverdue && t.status !== 'Completed').length,
            completed: dayTasks.filter(t => t.status === 'Completed').length,
            open: dayTasks.filter(t => t.status === 'Open' && !t.isOverdue).length,
            hasOverdue: dayTasks.some(t => t.isOverdue && t.status !== 'Completed'),
            hasCompleted: dayTasks.some(t => t.status === 'Completed'),
        };
    }, [tasks, calendarData]);

    const handleDateClick = (day: number) => {
        const dateStr = `${calendarData.year}-${String(calendarData.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (selectedDate === dateStr) onSelectDate(null);
        else onSelectDate(dateStr);
    };

    const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const today = new Date();
    const isPastDate = selectedDate ? selectedDate < todayStr : false;

    return (
        <div className="sticky top-6 space-y-6">
            <Card className="shadow-sm border-none bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 overflow-visible">
                <CardHeader className="p-4 pb-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{monthName}</span>
                        <div className="flex gap-1">
                            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500">
                                <Icon name="chevronLeft" className="w-4 h-4" />
                            </button>
                            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500">
                                <Icon name="chevronRight" className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-[10px] font-medium text-gray-400 uppercase">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: calendarData.firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                        {Array.from({ length: calendarData.daysInMonth }, (_, i) => {
                            const day = i + 1;
                            const stats = getDayStats(day);
                            const isToday = day === today.getDate() && calendarData.month === today.getMonth() && calendarData.year === today.getFullYear();
                            const currentDateStr = `${calendarData.year}-${String(calendarData.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isSelected = selectedDate === currentDateStr;
                            
                            return (
                                <div key={day} onClick={() => handleDateClick(day)} className={cn("group relative aspect-square flex flex-col items-center justify-center rounded-lg text-xs cursor-pointer transition-all duration-200", isSelected ? "bg-blue-600 text-white shadow-md scale-105 z-10" : "hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-inner", isToday && !isSelected ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-bold border border-blue-200 dark:border-blue-800" : "text-gray-700 dark:text-gray-300")}>
                                    <span>{day}</span>
                                    <div className="flex gap-0.5 mt-0.5 h-1.5 justify-center w-full px-1">
                                        {stats?.hasOverdue && <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isSelected ? "bg-red-200" : "bg-red-500")} />}
                                        {stats?.open ? <div className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-blue-200" : "bg-blue-400")} /> : null}
                                        {stats?.hasCompleted && <div className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-green-200" : "bg-green-500")} />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
                {selectedDate && !isPastDate && (
                    <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2">
                        <Button size="sm" variant="default" className="w-full text-xs h-8 bg-blue-600 hover:bg-blue-700" onClick={onQuickAdd}>
                            <Icon name="plus" className="w-3 h-3 mr-1.5" /> Add Task for {new Date(selectedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                        </Button>
                    </div>
                )}
                {selectedDate && isPastDate && (
                    <div className="px-4 pb-4 text-center animate-in fade-in">
                        <p className="text-[10px] text-gray-400 italic">Cannot assign tasks to past dates.</p>
                    </div>
                )}
            </Card>
        </div>
    );
});
MiniCalendarView.displayName = "MiniCalendarView";

const TasksTab: React.FC = () => {
    const { tasks, createTask, updateTaskStatus, deleteTask } = useTaskManager();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [filters, setFilters] = useState<TaskFilters>({ search: '', priority: 'All', status: 'All', assignee: 'All' });
    const addTaskFormRef = useRef<AddTaskFormHandle>(null);
    const todayStr = getTodayStr();

    const filteredTasks = useMemo(() => {
        return tasks.filter(t => {
            const matchesSearch = !filters.search || t.title.toLowerCase().includes(filters.search.toLowerCase()) || t.relatedLead?.toLowerCase().includes(filters.search.toLowerCase());
            const matchesPriority = filters.priority === 'All' || t.priority === filters.priority;
            const matchesAssignee = filters.assignee === 'All' || t.assignee === filters.assignee;
            
            let matchesStatus = true;
            if (filters.status === 'Open') matchesStatus = t.status === 'Open' && !t.isOverdue;
            else if (filters.status === 'Completed') matchesStatus = t.status === 'Completed';
            else if (filters.status === 'Overdue') matchesStatus = t.isOverdue && t.status !== 'Completed';
            
            const matchesDate = !selectedDate || t.dueDate === selectedDate;
            
            return matchesSearch && matchesPriority && matchesStatus && matchesAssignee && matchesDate;
        }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }, [tasks, filters, selectedDate]);

    const upcomingTasks = filteredTasks.filter(t => t.status !== 'Completed');
    const completedTasks = filteredTasks.filter(t => t.status === 'Completed');
    
    const handleQuickAddForDate = () => {
        if (addTaskFormRef.current && selectedDate) {
            if (selectedDate < todayStr) return;
            addTaskFormRef.current.openForm(selectedDate);
        }
    };

    const isPastDate = selectedDate ? selectedDate < todayStr : false;
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-4 items-center transition-all duration-200">
                    <div className="relative flex-1 w-full">
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                            placeholder="Search tasks by title or lead..." 
                            value={filters.search} 
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))} 
                            className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500/20 transition-shadow" 
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Select value={filters.status} onValueChange={(v) => setFilters(p => ({...p, status: v as any}))}>
                            <SelectTrigger className="w-full md:w-[130px] bg-gray-50 dark:bg-gray-900"><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={filters.priority} onValueChange={(v) => setFilters(p => ({...p, priority: v as any}))}>
                            <SelectTrigger className="w-full md:w-[130px] bg-gray-50 dark:bg-gray-900"><SelectValue placeholder="Priority" /></SelectTrigger>
                            <SelectContent>{PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>

                <motion.div 
                    {...({
                        variants: staggerContainer,
                        initial: "hidden",
                        animate: "show"
                    } as any)}
                    className="space-y-8"
                >
                    <AddTaskForm ref={addTaskFormRef} onSave={createTask} />
                    
                    <div>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                                <Icon name="list" className="w-4 h-4" />
                                {selectedDate ? `Tasks for ${new Date(selectedDate).toLocaleDateString()}` : `Upcoming (${upcomingTasks.length})`}
                            </h3>
                            {selectedDate && (
                                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium animate-in fade-in">
                                    <span>Filtered by Date</span>
                                    <button onClick={() => setSelectedDate(null)} className="hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full p-0.5">
                                        <Icon name="close" className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-1">
                            <AnimatePresence mode="popLayout">
                                {upcomingTasks.length === 0 && selectedDate ? (
                                    <motion.div 
                                        {...({ initial: { opacity: 0 }, animate: { opacity: 1 } } as any)} 
                                        className="text-center py-12 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700"
                                    >
                                        <Icon name="checkCircle" className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500 text-sm font-medium">No tasks found for this date.</p>
                                        {!isPastDate && <Button variant="link" className="text-blue-600 h-auto p-0 mt-1 text-xs" onClick={handleQuickAddForDate}>+ Add task for {new Date(selectedDate).toLocaleDateString()}</Button>}
                                    </motion.div>
                                ) : (
                                    upcomingTasks.map(task => <TaskItem key={task.id} task={task} onToggle={updateTaskStatus} onDelete={deleteTask} />)
                                )}
                                {upcomingTasks.length === 0 && !selectedDate && (
                                    <motion.div 
                                        {...({ initial: { opacity: 0 }, animate: { opacity: 1 } } as any)}
                                        className="text-center py-12 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700"
                                    >
                                        <Icon name="checkCircle" className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500 text-sm font-medium">No upcoming tasks.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {completedTasks.length > 0 && (
                        <div className="pt-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Completed ({completedTasks.length})</h3>
                            <div className="space-y-1 opacity-75 hover:opacity-100 transition-opacity duration-200">
                                <AnimatePresence mode="popLayout">
                                    {completedTasks.map(task => <TaskItem key={task.id} task={task} onToggle={updateTaskStatus} onDelete={deleteTask} />)}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
            
            <div className="space-y-6">
                <MiniCalendarView tasks={tasks} selectedDate={selectedDate} onSelectDate={setSelectedDate} onQuickAdd={handleQuickAddForDate} />
            </div>
        </div>
    );
};

export default TasksTab;
