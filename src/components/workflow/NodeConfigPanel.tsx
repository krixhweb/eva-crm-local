
import React, { useEffect, useState } from 'react';
import { Node } from 'reactflow';
import { Card } from '../ui/Card';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Icon } from '../icons/Icon';

interface NodeConfigPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (id: string, data: any) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ selectedNode, onUpdateNode, onClose, onDelete }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (selectedNode) {
      setFormData({ ...selectedNode.data });
    }
  }, [selectedNode]);

  const handleChange = (key: string, value: any) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);
    // Auto-save on change
    if (selectedNode) {
        onUpdateNode(selectedNode.id, newData);
    }
  };

  if (!selectedNode) return null;

  return (
    <Card className="h-full flex flex-col rounded-none border-l dark:border-gray-700 shadow-xl absolute right-0 top-0 bottom-0 w-80 z-20">
      <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Icon name="settings" className="w-4 h-4 text-gray-500" />
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">Configuration</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><Icon name="close" className="w-4 h-4"/></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Common Fields */}
        <div className="space-y-3">
          <Label>Label Name</Label>
          <Input 
            value={formData.label || ''} 
            onChange={(e) => handleChange('label', e.target.value)} 
          />
        </div>

        {/* Type Specific Fields */}
        {selectedNode.type === 'trigger' && (
          <div className="space-y-3">
            <Label>Trigger Type</Label>
            <Select value={formData.triggerType} onValueChange={(v) => handleChange('triggerType', v)}>
                <SelectTrigger><SelectValue placeholder="Select trigger" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="cart_abandoned">Cart Abandoned</SelectItem>
                    <SelectItem value="order_placed">Order Placed</SelectItem>
                    <SelectItem value="user_signup">User Signup</SelectItem>
                </SelectContent>
            </Select>
          </div>
        )}

        {selectedNode.type === 'action' && (
          <>
            <div className="space-y-3">
                <Label>Action Channel</Label>
                <Select value={formData.actionType} onValueChange={(v) => handleChange('actionType', v)}>
                    <SelectTrigger><SelectValue placeholder="Select channel" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-3">
                <Label>Template ID</Label>
                <Input 
                    value={formData.templateId || ''} 
                    onChange={(e) => handleChange('templateId', e.target.value)} 
                    placeholder="e.g. welcome_email_v1"
                />
            </div>
          </>
        )}

        {selectedNode.type === 'condition' && (
          <div className="space-y-3">
            <Label>Condition Expression</Label>
            <Textarea 
                value={formData.expression || ''} 
                onChange={(e) => handleChange('expression', e.target.value)} 
                placeholder="e.g. event.total > 500"
                className="font-mono text-xs"
            />
            <p className="text-xs text-gray-500">Use JS-like syntax. Available: event.*, user.*</p>
          </div>
        )}

        {selectedNode.type === 'delay' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
                <Label>Amount</Label>
                <Input 
                    type="number"
                    value={formData.delayAmount || ''} 
                    onChange={(e) => handleChange('delayAmount', e.target.value)} 
                />
            </div>
            <div className="space-y-3">
                <Label>Unit</Label>
                <Select value={formData.delayUnit} onValueChange={(v) => handleChange('delayUnit', v)}>
                    <SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <Button variant="destructive" className="w-full" onClick={() => onDelete(selectedNode.id)}>
            Delete Node
        </Button>
      </div>
    </Card>
  );
};
