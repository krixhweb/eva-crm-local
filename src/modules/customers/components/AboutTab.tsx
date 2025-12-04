
import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { Customer, Note } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Icon } from '../../../components/shared/Icon';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import type { RootState } from '../../../store/store';

interface AboutTabProps {
  customer: Customer;
  onUpdateCustomer: (customer: Customer) => void;
}

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const TicketItem: React.FC<{ticket: Customer['tickets'][0]}> = ({ ticket }) => {
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Open': return 'blue';
            case 'Pending': return 'yellow';
            case 'Solved': return 'green';
            case 'Closed': return 'gray';
            default: return 'gray';
        }
    }
    return (
        <div className="flex justify-between items-start py-3">
            <div>
                <p className="font-medium text-sm">{ticket.subject}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">#{ticket.id} - Last updated {ticket.lastUpdate}</p>
            </div>
            <Badge variant={getStatusColor(ticket.status) as any}>{ticket.status}</Badge>
        </div>
    )
};

const NoteItem: React.FC<{note: Note}> = ({ note }) => (
    <div className="py-3">
        <p className="text-sm text-gray-700 dark:text-gray-300">{note.content}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{note.author} on {note.date}</p>
        {note.attachments && note.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
                {note.attachments.map(att => (
                    <a href={att.url} key={att.name} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                        <Icon name="paperclip" className="w-3 h-3"/> {att.name}
                    </a>
                ))}
            </div>
        )}
    </div>
);

const AboutTab: React.FC<AboutTabProps> = ({ customer, onUpdateCustomer }) => {
  const [notesView, setNotesView] = useState('new'); // 'new' or 'history'
  const [noteText, setNoteText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  const solvedTickets = customer.tickets.filter(t => t.status === 'Solved').length;
  const pendingTickets = customer.tickets.filter(t => t.status === 'Pending' || t.status === 'Open').length;
  
  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalFiles = attachedFiles.length + newFiles.length;

    if (totalFiles > MAX_FILES) {
      setError(`You can only attach up to ${MAX_FILES} files.`);
      return;
    }

    const oversizedFiles = newFiles.filter((file: File) => file.size > MAX_FILE_SIZE_BYTES);
    if (oversizedFiles.length > 0) {
      setError(`One or more files are larger than the ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }

    const uniqueNewFiles = newFiles.filter(
      (newFile: File) => !attachedFiles.some(existingFile => existingFile.name === newFile.name)
    );

    setAttachedFiles(prev => [...prev, ...uniqueNewFiles]);
    
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };
  
  const handleRemoveFile = (fileName: string) => {
    setAttachedFiles(prev => prev.filter(file => file.name !== fileName));
  };
  
  const handleSaveNote = () => {
    if (!noteText.trim()) return;

    const newNote: Note = {
      id: `note_${Date.now()}`,
      content: noteText,
      date: new Date().toLocaleDateString('en-CA'),
      author: currentUser.name, 
      attachments: attachedFiles.map(file => ({
        name: file.name,
        url: '#' // Placeholder URL for mock data
      })),
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      createdAt: new Date().toISOString()
    };

    const updatedCustomer: Customer = {
      ...customer,
      notes: [...customer.notes, newNote],
      updatedBy: currentUser.id,
      updatedByName: currentUser.name,
      updatedAt: new Date().toISOString()
    };

    onUpdateCustomer(updatedCustomer);
    setNoteText('');
    setAttachedFiles([]);
    setError(null);
    setNotesView('history');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Contact Profile</h3>
            <button className="text-sm text-blue-500 hover:underline flex items-center gap-1"><Icon name="edit" className="w-3.5 h-3.5"/> Edit</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div><strong className="text-gray-500 dark:text-gray-400 font-medium block mb-1">Primary Email</strong> {customer.email}</div>
            <div><strong className="text-gray-500 dark:text-gray-400 font-medium block mb-1">Mobile Phone</strong> {customer.phone}</div>
            <div><strong className="text-gray-500 dark:text-gray-400 font-medium block mb-1">Company</strong> {customer.company?.name ?? 'Individual'}</div>
            <div><strong className="text-gray-500 dark:text-gray-400 font-medium block mb-1">Address</strong> {`${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.postalCode}`}</div>
          </div>
          {customer.updatedByName && (
              <div className="mt-4 pt-4 border-t dark:border-gray-700 text-xs text-gray-400">
                  Last updated by {customer.updatedByName} on {new Date(customer.updatedAt!).toLocaleDateString()}
              </div>
          )}
        </Card>
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Account Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong className="text-gray-500 dark:text-gray-400 font-medium block mb-1">Customer ID</strong> {customer.id}</div>
            <div><strong className="text-gray-500 dark:text-gray-400 font-medium block mb-1">Account Status</strong> <Badge variant={customer.status === 'Active' ? 'green' : 'gray'}>{customer.status}</Badge></div>
            <div><strong className="text-gray-500 dark:text-gray-400 font-medium block mb-1">Customer Segment</strong> {customer.segment}</div>
          </div>
        </Card>
      </div>
      
      {/* Right Column */}
      <div className="space-y-6">
        <Card className="p-6">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Ticket History</h3>
                <span className="text-sm font-semibold">{solvedTickets} Solved / {pendingTickets} Pending</span>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {customer.tickets.length > 0 ? (
                    customer.tickets.map(ticket => <TicketItem key={ticket.id} ticket={ticket} />)
                ) : (
                    <p className="text-sm text-center text-gray-500 py-4">No tickets found.</p>
                )}
            </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Notes</h3>
            <div className="flex p-0.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                <button onClick={() => setNotesView('new')} className={`px-2 py-0.5 text-xs font-semibold rounded-md transition ${notesView === 'new' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}>New</button>
                <button onClick={() => setNotesView('history')} className={`px-2 py-0.5 text-xs font-semibold rounded-md transition ${notesView === 'history' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}>History ({customer.notes.length})</button>
            </div>
          </div>
          {notesView === 'new' ? (
             <div>
                <textarea 
                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-green-500 focus:border-green-500"
                    rows={4}
                    placeholder="Add a note..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                ></textarea>
                {attachedFiles.length > 0 && (
                    <div className="mt-2 space-y-2">
                        {attachedFiles.map(file => (
                            <div key={file.name} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md text-sm">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <Icon name="fileText" className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <div className="truncate">
                                        <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleRemoveFile(file.name)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 flex-shrink-0">
                                    <Icon name="close" className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                 {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                <div className="flex items-center justify-between mt-2">
                    <Button variant="outline" size="sm" className="p-2 h-auto" onClick={handleAttachClick}>
                        <Icon name="paperclip" className="w-4 h-4" />
                    </Button>
                    <input 
                        type="file" 
                        multiple 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden"
                        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                     />
                    <Button size="sm" onClick={handleSaveNote} disabled={!noteText.trim()}>Save Note</Button>
                </div>
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700 -mx-6 px-6">
                {customer.notes.length > 0 ? (
                    customer.notes.slice().reverse().map(note => <NoteItem key={note.id} note={note}/>)
                ) : (
                    <p className="text-sm text-center text-gray-500 py-4">No notes history.</p>
                )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AboutTab;
