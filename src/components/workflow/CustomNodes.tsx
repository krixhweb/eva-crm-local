
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Icon } from '../icons/Icon';
import { cn } from '../../lib/utils';

// --- Base Node Shell ---
const BaseNode = ({ 
  children, 
  selected, 
  icon, 
  title, 
  colorClass,
  handles = ['top', 'bottom']
}: any) => {
  return (
    <div className={cn(
      "w-64 bg-white dark:bg-gray-800 rounded-lg border-2 shadow-sm transition-all duration-200",
      selected ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200 dark:border-gray-700",
      "hover:border-gray-300 dark:hover:border-gray-600"
    )}>
      {handles.includes('top') && (
        <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-gray-400 hover:!bg-blue-500 transition-colors" />
      )}
      
      <div className="p-3">
        <div className="flex items-center gap-3 mb-2">
          <div className={cn("p-2 rounded-md text-white shadow-sm", colorClass)}>
            <Icon name={icon} className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{title}</h3>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {children}
        </div>
      </div>

      {handles.includes('bottom') && (
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-gray-400 hover:!bg-blue-500 transition-colors" />
      )}
    </div>
  );
};

// --- Trigger Node ---
export const TriggerNode = memo(({ data, selected }: NodeProps) => {
  return (
    <BaseNode 
      selected={selected} 
      icon="zap" 
      title={data.label || "Trigger"} 
      colorClass="bg-yellow-500"
      handles={['bottom']} // Triggers only have outputs
    >
      <p>Type: {data.triggerType || 'Not configured'}</p>
    </BaseNode>
  );
});

// --- Action Node ---
export const ActionNode = memo(({ data, selected }: NodeProps) => {
  const actionName = data.actionType ? data.actionType.charAt(0).toUpperCase() + data.actionType.slice(1) : 'Select Action';
  return (
    <BaseNode 
      selected={selected} 
      icon="mail" 
      title={data.label || "Action"} 
      colorClass="bg-blue-500"
    >
      <p>{actionName}</p>
      {data.templateId && <p className="truncate opacity-70">Template: {data.templateId}</p>}
    </BaseNode>
  );
});

// --- Condition Node ---
export const ConditionNode = memo(({ data, selected }: NodeProps) => {
  return (
    <BaseNode 
      selected={selected} 
      icon="git-branch" // Using existing icon shim, assuming 'git-branch' maps to something or fallback
      title={data.label || "Condition"} 
      colorClass="bg-purple-500"
    >
      <p className="font-mono text-[10px] bg-gray-100 dark:bg-gray-900 p-1 rounded mt-1 truncate">
        {data.expression || "If..."}
      </p>
    </BaseNode>
  );
});

// --- Delay Node ---
export const DelayNode = memo(({ data, selected }: NodeProps) => {
  return (
    <BaseNode 
      selected={selected} 
      icon="clock" 
      title="Delay" 
      colorClass="bg-gray-500"
    >
      <p>{data.delayAmount ? `${data.delayAmount} ${data.delayUnit}` : 'Wait...'}</p>
    </BaseNode>
  );
});
