
import React, { useCallback, useRef } from 'react';
import ReactFlow, { 
  ReactFlowProvider, 
  MiniMap, 
  Controls, 
  Background, 
  useReactFlow,
  Node
} from 'reactflow';
import { TriggerNode, ActionNode, ConditionNode, DelayNode } from './CustomNodes';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
};

interface WorkflowCanvasProps {
  nodes: any[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onAddNode: (type: string, position: {x: number, y: number}, label: string) => void;
}

const ReactFlowWrapper = ({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onConnect, 
  onNodeClick,
  onAddNode
}: WorkflowCanvasProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/label');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      onAddNode(type, position, label);
    },
    [project, onAddNode]
  );

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-black/20" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        attributionPosition="bottom-left"
      >
        <MiniMap 
            className="!bg-white dark:!bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md" 
            nodeColor={(n) => {
                if (n.type === 'trigger') return '#EAB308';
                if (n.type === 'action') return '#3B82F6';
                return '#9CA3AF';
            }}
        />
        <Controls className="!bg-white dark:!bg-gray-800 border dark:border-gray-700 shadow-md rounded-lg overflow-hidden [&>button]:border-b dark:[&>button]:border-gray-700 [&>button:last-child]:border-none text-gray-600 dark:text-gray-300" />
        <Background color="#94a3b8" gap={16} size={1} className="opacity-20" />
      </ReactFlow>
    </div>
  );
};

export const WorkflowCanvas = (props: WorkflowCanvasProps) => {
  return (
    <ReactFlowProvider>
        <ReactFlowWrapper {...props} />
    </ReactFlowProvider>
  );
};
