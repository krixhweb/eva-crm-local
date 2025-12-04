
import { Edge, Node } from 'reactflow';

export type NodeType = 'trigger' | 'condition' | 'action' | 'delay';

export interface WorkflowNodeData extends Record<string, any> {
  label?: string;
  triggerType?: string;
  filterOptions?: Record<string, any>;
  expression?: string; // For conditions
  actionType?: 'email' | 'sms' | 'whatsapp' | 'slack';
  templateId?: string;
  delayAmount?: number;
  delayUnit?: 'minutes' | 'hours' | 'days';
  description?: string;
}

// Extending React Flow types for internal usage
export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

export interface Workflow {
  workflow_id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  metadata?: {
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
    isActive?: boolean;
    version?: number;
  };
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  workflow: Workflow;
}
