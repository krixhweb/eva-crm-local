
import { Workflow } from "../types/workflow";

// Safe evaluator for condition nodes
// NOTE: In production, use a proper parser like jsep or a rule engine.
export const evaluateCondition = (expression: string, context: Record<string, any>): boolean => {
  try {
    // Whitelist-based variable replacement or simple logic check
    // This is a mock implementation for the previewer
    const safeExpression = expression.replace(/event\./g, 'context.');
    
    // Function constructor is still risky if input is uncontrolled, 
    // but acceptable for this frontend-only demo where we control inputs.
    // eslint-disable-next-line
    const func = new Function('context', `return ${safeExpression};`);
    return !!func(context);
  } catch (e) {
    console.error("Evaluation error:", e);
    return false;
  }
};

// Mock API Client
export const workflowApi = {
  save: async (workflow: Workflow): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency
    try {
      const key = `workflow_${workflow.workflow_id}`;
      localStorage.setItem(key, JSON.stringify(workflow));
      
      // Update index
      const indexKey = 'workflows_index';
      const indexStr = localStorage.getItem(indexKey);
      const index = indexStr ? JSON.parse(indexStr) : [];
      if (!index.includes(workflow.workflow_id)) {
        index.push(workflow.workflow_id);
        localStorage.setItem(indexKey, JSON.stringify(index));
      }
      return true;
    } catch (e) {
      console.error("Save failed", e);
      return false;
    }
  },

  load: async (id: string): Promise<Workflow | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const data = localStorage.getItem(`workflow_${id}`);
    return data ? JSON.parse(data) : null;
  },

  list: async (): Promise<any[]> => {
    const indexStr = localStorage.getItem('workflows_index');
    const index: string[] = indexStr ? JSON.parse(indexStr) : [];
    return index.map(id => {
        const w = localStorage.getItem(`workflow_${id}`);
        return w ? JSON.parse(w) : null;
    }).filter(Boolean);
  }
};
