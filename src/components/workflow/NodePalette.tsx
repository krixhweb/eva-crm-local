
import React from 'react';
import { Card } from '../ui/Card';
import { Icon } from '../icons/Icon';

const DraggableNode = ({ type, label, icon, color, onDragStart }: any) => (
  <div 
    className="flex items-center gap-3 p-3 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-grab hover:shadow-md transition-all active:cursor-grabbing"
    onDragStart={(event) => onDragStart(event, type, label)}
    draggable
  >
    <div className={`p-2 rounded-md text-white ${color}`}>
      <Icon name={icon} className="w-4 h-4" />
    </div>
    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
  </div>
);

export const NodePalette = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card className="h-full flex flex-col rounded-none border-r dark:border-gray-700 shadow-none">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Components</h2>
        <p className="text-xs text-gray-500">Drag to canvas</p>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Triggers</h3>
          <DraggableNode type="trigger" label="Event Trigger" icon="zap" color="bg-yellow-500" onDragStart={onDragStart} />
        </div>
        
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Logic</h3>
          <DraggableNode type="condition" label="Condition" icon="git-branch" color="bg-purple-500" onDragStart={onDragStart} />
          <DraggableNode type="delay" label="Delay" icon="clock" color="bg-gray-500" onDragStart={onDragStart} />
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Actions</h3>
          <DraggableNode type="action" label="Send Email" icon="mail" color="bg-blue-500" onDragStart={onDragStart} />
          <DraggableNode type="action" label="Send SMS" icon="messageSquare" color="bg-green-500" onDragStart={onDragStart} />
        </div>
      </div>
    </Card>
  );
};
