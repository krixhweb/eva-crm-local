
import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  useNodesState, 
  useEdgesState, 
  addEdge as rfAddEdge, 
  Connection, 
  Edge,
  Node
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { Workflow, WorkflowNode, WorkflowEdge } from '../types/workflow';
import { useToast } from './use-toast';
import { workflowApi } from '../lib/workflowUtils';

const AUTOSAVE_INTERVAL = 10000; // 10 seconds

export function useWorkflow(initialWorkflow?: Workflow) {
  const { toast } = useToast();
  const [workflowId, setWorkflowId] = useState<string>(initialWorkflow?.workflow_id || uuidv4());
  const [name, setName] = useState<string>(initialWorkflow?.name || 'Untitled Workflow');
  
  // React Flow State
  const [nodes, setNodes, onNodesChange] = useNodesState(initialWorkflow?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialWorkflow?.edges || []);
  
  // History Stack for Undo/Redo
  const [history, setHistory] = useState<{nodes: Node[], edges: Edge[]}[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoOperation = useRef(false);

  // Record state to history
  const takeSnapshot = useCallback(() => {
    if (isUndoRedoOperation.current) return;
    
    setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push({ nodes, edges });
        return newHistory.slice(-20); // Limit to 20 steps
    });
    setHistoryIndex(prev => Math.min(prev + 1, 19));
  }, [nodes, edges, historyIndex]);

  // Debounced snapshotting could be added here if needed, 
  // currently using manual triggers or specific actions to simple mock it.
  // For true production, we'd use a more robust effect watching nodes/edges.

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoOperation.current = true;
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(prev => prev - 1);
      setTimeout(() => { isUndoRedoOperation.current = false; }, 50);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoOperation.current = true;
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(prev => prev + 1);
      setTimeout(() => { isUndoRedoOperation.current = false; }, 50);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const onConnect = useCallback((params: Connection) => {
    takeSnapshot();
    setEdges((eds) => rfAddEdge({ ...params, type: 'smoothstep', animated: true }, eds));
  }, [setEdges, takeSnapshot]);

  const addNode = useCallback((type: string, position: {x: number, y: number}, data?: any) => {
    takeSnapshot();
    const newNode: WorkflowNode = {
      id: `node_${uuidv4().slice(0, 8)}`,
      type,
      position,
      data: data || { label: 'New Node' },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes, takeSnapshot]);

  const updateNodeData = useCallback((id: string, data: any) => {
    takeSnapshot();
    setNodes((nds) => nds.map((node) => {
      if (node.id === id) {
        return { ...node, data: { ...node.data, ...data } };
      }
      return node;
    }));
  }, [setNodes, takeSnapshot]);

  const saveWorkflow = useCallback(async () => {
    const workflow: Workflow = {
      workflow_id: workflowId,
      name,
      nodes,
      edges,
      metadata: { updatedAt: new Date().toISOString() }
    };
    const success = await workflowApi.save(workflow);
    if (success) {
      toast({ title: "Saved", description: "Workflow saved successfully." });
    } else {
      toast({ title: "Error", description: "Failed to save workflow.", variant: "destructive" });
    }
  }, [workflowId, name, nodes, edges, toast]);

  // Autosave effect
  useEffect(() => {
    const interval = setInterval(() => {
        // Only autosave if there are nodes
        if (nodes.length > 0) {
            saveWorkflow().then(() => console.log('Autosaved'));
        }
    }, AUTOSAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [saveWorkflow, nodes]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeData,
    setNodes,
    setEdges,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    saveWorkflow,
    setName,
    name,
    workflowId
  };
}
