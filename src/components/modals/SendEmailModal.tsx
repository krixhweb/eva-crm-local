
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';

interface SendEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: () => void;
    documentId: string;
    customerName: string;
}

const SendEmailModal: React.FC<SendEmailModalProps> = ({ isOpen, onClose, onSend, documentId, customerName }) => {
    const isQuote = documentId.startsWith('QT');
    const documentType = isQuote ? 'Quote' : 'Invoice';

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="w-full md:w-[600px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl" resizable>
                <DrawerHeader className="border-b px-6 py-4 bg-white dark:bg-zinc-900">
                    <DrawerTitle>Send {documentType} {documentId}</DrawerTitle>
                    <DrawerDescription>To: {customerName}</DrawerDescription>
                </DrawerHeader>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-zinc-950/50">
                    <div className="space-y-2">
                        <Label>Subject</Label>
                        <Input defaultValue={`${documentType} ${documentId} from Your Company`} />
                    </div>
                    <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea rows={12} defaultValue={`Hi ${customerName},\n\nPlease find your ${documentType.toLowerCase()} attached.\n\nBest regards,\nYour Company`} />
                    </div>
                </div>

                <DrawerFooter className="flex-row justify-end gap-2 border-t px-6 py-4 bg-white dark:bg-zinc-900">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={onSend}>Send</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default SendEmailModal;
