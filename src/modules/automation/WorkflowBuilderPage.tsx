
import React, { useState } from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { WorkflowCanvas } from '../../components/workflow/WorkflowCanvas';
import { NodePalette } from '../../components/workflow/NodePalette';
import { NodeConfigPanel } from '../../components/workflow/NodeConfigPanel';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/shared/Icon';
import { Node } from 'reactflow';
import { useNavigate } from 'react-router-dom';

const WorkflowBuilderPage = () => {
  const navigate = useNavigate();
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeData,
    setNodes,
    undo,
    redo,
    canUndo,
    canRedo,
    saveWorkflow,
    name,
    setName
  } = useWorkflow();

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onNodeClick = (_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const onDeleteNode = (id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setSelectedNode(null);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-white dark:bg-black">
      {/* Toolbar */}
      <div className="h-16 border-b dark:border-gray-800 px-4 flex items-center justify-between bg-white dark:bg-black z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/automation/workflows')}>
            <Icon name="arrowLeft" className="w-4 h-4" />
          </Button>
          <div>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="h-8 text-lg font-bold border-none shadow-none hover:bg-gray-100 dark:hover:bg-gray-800 px-2 -ml-2 bg-transparent w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md p-1 mr-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={undo} 
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            >
              <Icon name="chevronLeft" className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={redo} 
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
            >
              <Icon name="chevronRight" className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={saveWorkflow}>
            <Icon name="download" className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Publish Workflow
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Palette */}
        <div className="w-64 border-r dark:border-gray-800 bg-white dark:bg-black z-10">
          <NodePalette />
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 relative">
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onAddNode={addNode}
          />
        </div>

        {/* Right Sidebar - Config */}
        {selectedNode && (
          <NodeConfigPanel 
            selectedNode={selectedNode} 
            onUpdateNode={updateNodeData} 
            onClose={() => setSelectedNode(null)}
            onDelete={onDeleteNode}
          />
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilderPage;
