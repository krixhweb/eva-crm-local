
import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { useGlassyToasts } from '../ui/GlassyToastProvider';
import { Icon } from '../shared/Icon';
import { cn } from '../../lib/utils';

interface SendTestEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateName?: string;
    templateId?: string;
}

const FROM_ADDRESSES = [
    "marketing@evastore.com",
    "support@evastore.com",
    "newsletter@evastore.com",
    "notifications@evastore.com"
];

const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const SendTestEmailModal: React.FC<SendTestEmailModalProps> = ({ isOpen, onClose, templateName, templateId }) => {
    const { push } = useGlassyToasts();
    
    // State
    const [recipients, setRecipients] = useState('');
    const [fromAddress, setFromAddress] = useState(FROM_ADDRESSES[0]);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Reset state on open
    useEffect(() => {
        if (isOpen) {
            setRecipients('');
            setFromAddress(FROM_ADDRESSES[0]);
            setMessage('');
            setStatus('idle');
            setErrorMessage(null);
        }
    }, [isOpen]);

    const validateRecipients = (input: string): boolean => {
        if (!input.trim()) return false;
        const emails = input.split(',').map(e => e.trim()).filter(e => e !== '');
        if (emails.length === 0) return false;
        
        for (const email of emails) {
            if (!isValidEmail(email)) {
                return false;
            }
        }
        return true;
    };

    const handleSend = async () => {
        const emails = recipients.split(',').map(e => e.trim()).filter(e => e);
        
        // Validate
        if (!validateRecipients(recipients)) {
            setErrorMessage("Please enter valid email addresses separated by commas.");
            return;
        }
        setErrorMessage(null);
        setStatus('sending');

        // Mock API Call
        try {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // 10% chance of failure for demo purposes
                    if (Math.random() < 0.1) reject(new Error("Network timeout"));
                    else resolve(true);
                }, 1500);
            });

            // Success
            setStatus('success');
            const deliveredTime = new Date().toLocaleTimeString();
            
            // Mock Event Tracking
            console.log(`[Analytics] test_email_sent`, {
                templateId: templateId || 'unknown',
                templateName: templateName || 'unknown',
                recipientCount: emails.length,
                fromAddress,
                timestamp: new Date().toISOString()
            });

            push({ 
                title: "Test Sent Successfully", 
                description: `Delivered to ${emails.length} recipient(s) at ${deliveredTime}.`, 
                variant: "success" 
            });
            
            setTimeout(() => {
                onClose();
            }, 1000);

        } catch (error) {
            setStatus('error');
            setErrorMessage("Failed to send test email. Please try again.");
            push({ 
                title: "Send Failed", 
                description: "There was an error sending the test email.", 
                variant: "error" 
            });
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DrawerContent className="w-full md:w-[500px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl" resizable showCloseButton={true}>
                <DrawerHeader className="border-b px-6 py-4 bg-white dark:bg-zinc-900 shrink-0">
                    <DrawerTitle className="flex items-center gap-2">
                        <Icon name="send" className="w-5 h-5 text-blue-600" />
                        Send Test Email
                    </DrawerTitle>
                    <DrawerDescription>
                        Preview "{templateName || 'Template'}" in your inbox before sending.
                    </DrawerDescription>
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-zinc-950/50">
                    
                    {/* From Address */}
                    <div className="space-y-2">
                        <Label>From Address</Label>
                        <Select value={fromAddress} onValueChange={setFromAddress} disabled={status === 'sending'}>
                            <SelectTrigger className="bg-white dark:bg-zinc-900">
                                <SelectValue placeholder="Select sender" />
                            </SelectTrigger>
                            <SelectContent>
                                {FROM_ADDRESSES.map(addr => (
                                    <SelectItem key={addr} value={addr}>{addr}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Recipients */}
                    <div className="space-y-2">
                        <Label>Recipients <span className="text-red-500">*</span></Label>
                        <Input 
                            placeholder="email1@example.com, email2@example.com" 
                            value={recipients} 
                            onChange={(e) => {
                                setRecipients(e.target.value);
                                if (errorMessage) setErrorMessage(null);
                            }} 
                            className={cn(
                                "bg-white dark:bg-zinc-900",
                                errorMessage && "border-red-500 focus-visible:ring-red-500"
                            )}
                            disabled={status === 'sending'}
                        />
                        <p className="text-xs text-gray-500">Separate multiple emails with commas.</p>
                        {errorMessage && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{errorMessage}</p>}
                    </div>

                    {/* Optional Message */}
                    <div className="space-y-2">
                        <Label>Personal Note (Optional)</Label>
                        <Textarea 
                            placeholder="Add a note for the recipients (e.g., 'Check the header formatting')..." 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[100px] bg-white dark:bg-zinc-900 resize-none"
                            disabled={status === 'sending'}
                        />
                    </div>

                </div>

                <DrawerFooter className="border-t px-6 py-4 flex justify-end gap-3 bg-white dark:bg-zinc-900 shrink-0">
                    <Button variant="outline" onClick={onClose} disabled={status === 'sending'}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSend} 
                        disabled={!recipients || status === 'sending'} 
                        className="bg-blue-600 hover:bg-blue-700 text-white w-32 shadow-sm transition-all"
                    >
                        {status === 'sending' ? (
                            <><Icon name="refreshCw" className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                        ) : status === 'success' ? (
                            <><Icon name="check" className="w-4 h-4 mr-2" /> Sent</>
                        ) : (
                            <><Icon name="send" className="w-4 h-4 mr-2" /> Send Test</>
                        )}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
