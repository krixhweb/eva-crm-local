
import React, { useState, useEffect, useRef } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from '../../../components/ui/Drawer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Textarea } from '../../../components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';
import { Icon } from '../../../components/shared/Icon';
import { DatePicker } from '../../../components/ui/DatePicker';
import { mockTeamMembers } from '../../../data/mockData';
import { cn } from '../../../lib/utils';
import { useGlassyToasts } from '../../../components/ui/GlassyToastProvider';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import type { Campaign } from '../../../types';

interface CreateCampaignDrawerProps {
  open: boolean;
  onClose: () => void;
  campaignToEdit?: Campaign | null;
  onSave?: (campaignData: any) => void;
}

// --- Constants ---
const CAMPAIGN_TYPES = [
  "Advertisement",
  "Webinar",
  "Conference / Event",
  "Public Relations (PR)",
  "Referral Program"
];

const CAMPAIGN_STATUSES = ["Planned", "Active", "Completed", "Cancelled", "On Hold"];
const BUDGET_TYPES = ["Daily Budget", "Lifetime Budget", "Manual Schedule"];

// Updated Creative Formats
const CREATIVE_FORMATS = [
  "Image",
  "Video",
  "Carousel (Multiple Images)",
  "Document / PDF",
  "No Creative Needed"
];

// --- Types ---
interface CreativeAsset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  file?: File;
}

interface CampaignFormData {
  // Step 1: Identity & Planning
  owner: string;
  campaignName: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  expectedResponse: string;
  numSent: string;
  audience: string;

  // Step 2: Budget & Costing
  budgetType: string;
  budgetStartDate: string;
  budgetEndDate: string;
  budgetedCost: string; // Estimated Total Cost
  actualCost: string;
  expectedRevenue: string;

  // Step 3: Creative
  creativeFormat: string; // Renamed from creativeType
  adCopy: string;
  creativeAssets: CreativeAsset[]; // Changed from string | null
  description: string;
}

interface CampaignDraft {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  data: CampaignFormData;
}

const INITIAL_DATA: CampaignFormData = {
  owner: '',
  campaignName: '',
  type: 'Advertisement',
  status: 'Planned',
  startDate: '',
  endDate: '',
  expectedResponse: '',
  numSent: '',
  audience: '',

  budgetType: 'Daily Budget',
  budgetStartDate: '',
  budgetEndDate: '',
  budgetedCost: '',
  actualCost: '',
  expectedRevenue: '',

  creativeFormat: 'Image',
  adCopy: '',
  creativeAssets: [],
  description: ''
};

// --- Helper: Dynamic Field Config ---
const getExpectedResponseConfig = (type: string) => {
  switch (type) {
    case "Advertisement": return { label: "Expected Conversions", placeholder: "Eg. 20 conversions" };
    case "Webinar": return { label: "Expected Registrations", placeholder: "Eg. 150 registrations" };
    case "Conference / Event": return { label: "Expected Attendees", placeholder: "Eg. 200 attendees" };
    case "Public Relations (PR)": return { label: "Expected Reach / Mentions", placeholder: "Eg. 5 media mentions" };
    case "Referral Program": return { label: "Expected Referrals", placeholder: "Eg. 25 referrals" };
    default: return { label: "Expected Response", placeholder: "Eg. 100" };
  }
};

// --- Helper Components ---
const InputWrapper = ({ label, required, error, children, className, helpText }: { label: string, required?: boolean, error?: string, children?: React.ReactNode, className?: string, helpText?: string }) => (
  <div className={cn("space-y-1.5", className)}>
    <Label className={cn("text-sm font-medium text-gray-700 dark:text-gray-300", error && "text-red-500")}>
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    {children}
    {error && <p className="text-[11px] text-red-500 font-medium animate-in slide-in-from-top-1">{error}</p>}
    {!error && helpText && <p className="text-[11px] text-gray-400">{helpText}</p>}
  </div>
);

// --- STEP 1: Campaign Information ---
const Step1Content = ({ formData, handleChange, handleBlur, errors }: any) => {
  const responseConfig = getExpectedResponseConfig(formData.type);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
            <Icon name="fileText" className="w-4 h-4 text-green-500" /> Identity & Planning
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Left Column */}
            <div className="space-y-6">
                <InputWrapper label="Campaign Owner" required error={errors.owner}>
                    <Select value={formData.owner} onValueChange={v => handleChange('owner', v)}>
                    <SelectTrigger className={cn("h-11", errors.owner && "border-red-500 ring-red-500/20")}>
                        <SelectValue placeholder="Select Owner">
                        {formData.owner && (mockTeamMembers.find(m => m.id === formData.owner)?.name || formData.owner)}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <div className="px-2 py-1.5 text-xs text-gray-500 border-b dark:border-zinc-800 mb-1">
                        {mockTeamMembers.length} results found
                        </div>
                        {mockTeamMembers.map(m => (
                        <SelectItem key={m.id} value={m.id}>
                            <div className="flex items-center gap-3 py-1">
                            <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
                                {m.avatar}
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">{m.name}</span>
                                <span className="text-[10px] text-gray-500">{m.email}</span>
                            </div>
                            </div>
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </InputWrapper>

                <InputWrapper label="Campaign Name" required error={errors.campaignName}>
                    <Input 
                    placeholder="Eg. Summer Sale 2024" 
                    value={formData.campaignName}
                    onChange={e => handleChange('campaignName', e.target.value)}
                    onBlur={() => handleBlur('campaignName')}
                    className={cn("h-11", errors.campaignName && "border-red-500 focus-visible:ring-red-500")}
                    />
                </InputWrapper>

                <InputWrapper label="Start Date" required error={errors.startDate}>
                    <DatePicker 
                    value={formData.startDate ? new Date(formData.startDate) : null} 
                    onChange={(d) => handleChange('startDate', d ? d.toISOString() : '')}
                    className={cn("h-11", errors.startDate && "border-red-500")}
                    />
                </InputWrapper>

                <InputWrapper 
                  label={responseConfig.label} 
                  required 
                  error={errors.expectedResponse}
                  helpText="Estimated target for the primary metric of this campaign."
                >
                    <Input 
                        type="number" 
                        placeholder={responseConfig.placeholder}
                        className={cn("h-11", errors.expectedResponse && "border-red-500")}
                        value={formData.expectedResponse}
                        onChange={e => handleChange('expectedResponse', e.target.value)}
                        onBlur={() => handleBlur('expectedResponse')}
                        min={0}
                    />
                </InputWrapper>

                <InputWrapper label="Num Sent" error={errors.numSent} helpText="Total recipients or reach count.">
                    <Input 
                        type="number" 
                        placeholder="0" 
                        className={cn("h-11", errors.numSent && "border-red-500")}
                        value={formData.numSent}
                        onChange={e => handleChange('numSent', e.target.value)}
                        min={0}
                    />
                </InputWrapper>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
                <InputWrapper label="Campaign Type" required error={errors.type}>
                    <Select value={formData.type} onValueChange={v => handleChange('type', v)}>
                    <SelectTrigger className={cn("h-11", errors.type && "border-red-500")}><SelectValue placeholder="Select Type" /></SelectTrigger>
                    <SelectContent>
                        {CAMPAIGN_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                    </Select>
                </InputWrapper>

                <InputWrapper label="Status" required error={errors.status}>
                    <Select value={formData.status} onValueChange={v => handleChange('status', v)}>
                    <SelectTrigger className={cn("h-11", errors.status && "border-red-500")}><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {CAMPAIGN_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                    </Select>
                </InputWrapper>

                <InputWrapper label="End Date" error={errors.endDate}>
                    <DatePicker 
                    value={formData.endDate ? new Date(formData.endDate) : null} 
                    onChange={(d) => handleChange('endDate', d ? d.toISOString() : '')}
                    className={cn("h-11", errors.endDate && "border-red-500")}
                    />
                </InputWrapper>
            </div>
        </div>

        <div className="mt-6 border-t dark:border-zinc-800 pt-6">
            <InputWrapper label="Target Audience Description" error={errors.audience}>
                <div className="relative">
                    <Textarea 
                        placeholder="Eg. Men aged 25–40 interested in tech, located in Metro cities..." 
                        className={cn("min-h-[120px] text-sm pr-2 pb-6 resize-none", errors.audience && "border-red-500")}
                        value={formData.audience}
                        onChange={e => handleChange('audience', e.target.value)}
                        onBlur={() => handleBlur('audience')}
                    />
                    <div className={cn("absolute bottom-2 right-2 text-[10px] font-medium px-1 rounded", formData.audience.length > 1000 ? "text-red-500" : "text-gray-400 bg-white dark:bg-zinc-900")}>
                        {formData.audience.length}/1000
                    </div>
                </div>
            </InputWrapper>
        </div>
      </div>
    </div>
  );
};

// --- STEP 2: Budget, Costing & Schedule ---
const Step2Content = ({ formData, handleChange, handleBlur, errors }: any) => (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
                <Icon name="dollarSign" className="w-4 h-4 text-green-500" /> Budget & Costing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* LEFT COLUMN: Budget Scheduling */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                            <Icon name="calendar" className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Budget Schedule</span>
                    </div>

                    <InputWrapper label="Budget Type">
                        <Select value={formData.budgetType} onValueChange={v => handleChange('budgetType', v)}>
                            <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {BUDGET_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </InputWrapper>

                    <InputWrapper label="Budget Start Date">
                        <DatePicker 
                            value={formData.budgetStartDate ? new Date(formData.budgetStartDate) : null} 
                            onChange={(d) => handleChange('budgetStartDate', d ? d.toISOString() : '')}
                            className="h-11 bg-white dark:bg-zinc-900"
                        />
                    </InputWrapper>

                    <InputWrapper label="Budget End Date" error={errors.budgetEndDate}>
                        <DatePicker 
                            value={formData.budgetEndDate ? new Date(formData.budgetEndDate) : null} 
                            onChange={(d) => handleChange('budgetEndDate', d ? d.toISOString() : '')}
                            className={cn("h-11 bg-white dark:bg-zinc-900", errors.budgetEndDate && "border-red-500")}
                        />
                    </InputWrapper>
                </div>

                {/* RIGHT COLUMN: Cost Estimation */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center">
                            <Icon name="trendingUp" className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Financial Projections</span>
                    </div>

                    <InputWrapper label="Estimated Total Cost" error={errors.budgetedCost} helpText="Predicted cost including ads, creatives, etc.">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                            <Input 
                                type="number" 
                                placeholder="0.00" 
                                className={cn("pl-8 h-11", errors.budgetedCost && "border-red-500")}
                                value={formData.budgetedCost}
                                onChange={e => handleChange('budgetedCost', e.target.value)}
                            />
                        </div>
                    </InputWrapper>

                    <InputWrapper label="Actual Cost" error={errors.actualCost} helpText="Final cost after campaign completion.">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                            <Input 
                                type="number" 
                                placeholder="0.00" 
                                className={cn("pl-8 h-11", errors.actualCost && "border-red-500")}
                                value={formData.actualCost}
                                onChange={e => handleChange('actualCost', e.target.value)}
                            />
                        </div>
                    </InputWrapper>

                    <InputWrapper label="Expected Revenue" error={errors.expectedRevenue} helpText="Projected revenue generation.">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                            <Input 
                                type="number" 
                                placeholder="0.00" 
                                className={cn("pl-8 h-11", errors.expectedRevenue && "border-red-500")}
                                value={formData.expectedRevenue}
                                onChange={e => handleChange('expectedRevenue', e.target.value)}
                            />
                        </div>
                    </InputWrapper>
                </div>
            </div>
        </div>
    </div>
);

// --- STEP 3: Creative Upload ---
const Step3Content = ({ formData, handleChange, handleBlur, errors, setErrors }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const isNoCreative = formData.creativeFormat === "No Creative Needed";
    const isCarousel = formData.creativeFormat === "Carousel (Multiple Images)";
    const isImage = formData.creativeFormat === "Image";
    const isVideo = formData.creativeFormat === "Video";
    const isPDF = formData.creativeFormat === "Document / PDF";

    // Determine accepted file types
    const acceptTypes = isVideo ? "video/mp4" : isPDF ? "application/pdf" : "image/jpeg,image/png,image/gif";
    const allowMultiple = isCarousel || isImage;
    const maxFiles = allowMultiple ? 5 : 1;

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        
        const newAssets: CreativeAsset[] = [];
        let hasError = false;
        let errorMessage = "";

        const currentCount = formData.creativeAssets.length;
        const filesToAdd = Array.from(files);

        if (currentCount + filesToAdd.length > maxFiles) {
             setErrors((prev: any) => ({ ...prev, creativeAssets: `Max ${maxFiles} files allowed.` }));
             return;
        }

        filesToAdd.forEach(file => {
            if (file.size > 10 * 1024 * 1024) {
                hasError = true;
                errorMessage = "One or more files exceed 10MB limit.";
                return;
            }

            // Basic type check matching format
            if (isVideo && !file.type.startsWith('video/')) {
                hasError = true; errorMessage = "Invalid file type. MP4 required."; return;
            }
            if (isPDF && file.type !== 'application/pdf') {
                hasError = true; errorMessage = "Invalid file type. PDF required."; return;
            }
            if ((isImage || isCarousel) && !file.type.startsWith('image/')) {
                hasError = true; errorMessage = "Invalid file type. Images only."; return;
            }

            newAssets.push({
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                url: URL.createObjectURL(file),
                type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
                size: file.size,
                file: file
            });
        });

        if (hasError) {
            setErrors((prev: any) => ({ ...prev, creativeAssets: errorMessage }));
        } else {
             // Clear errors
            const newErr = { ...errors };
            delete newErr.creativeAssets;
            setErrors(newErr);

            // Update state
            if (allowMultiple) {
                handleChange('creativeAssets', [...formData.creativeAssets, ...newAssets]);
            } else {
                handleChange('creativeAssets', [newAssets[0]]);
            }
        }
    };

    const removeAsset = (id: string) => {
        const newAssets = formData.creativeAssets.filter((a: CreativeAsset) => a.id !== id);
        handleChange('creativeAssets', newAssets);
    };

    return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
                <Icon name="image" className="w-4 h-4 text-purple-500" /> Creative Assets
            </h3>

            <InputWrapper label="Creative Format">
                <Select value={formData.creativeFormat} onValueChange={v => {
                    handleChange('creativeFormat', v);
                    handleChange('creativeAssets', []); // Clear assets on format change
                    const newErr = { ...errors };
                    delete newErr.creativeAssets;
                    setErrors(newErr);
                }}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {CREATIVE_FORMATS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                </Select>
            </InputWrapper>

            {!isNoCreative && (
                <InputWrapper 
                    label="Upload Assets" 
                    helpText={`Supported: ${isImage || isCarousel ? "JPG, PNG" : isVideo ? "MP4" : "PDF"}. Max 10MB. ${allowMultiple ? "Up to 5 files." : "Single file."}`}
                    error={errors.creativeAssets}
                >
                    <div 
                        className={cn(
                            "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group relative bg-gray-50 dark:bg-zinc-900/50",
                            isDragging ? "border-green-500 bg-green-50 dark:bg-green-900/10" : "border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600 hover:bg-white dark:hover:bg-zinc-900"
                        )}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            handleFiles(e.dataTransfer.files);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input 
                            type="file" 
                            className="hidden" 
                            ref={fileInputRef}
                            accept={acceptTypes}
                            multiple={allowMultiple}
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                        
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Icon name={isImage || isCarousel ? "image" : isVideo ? "play" : "fileText"} className="w-6 h-6 text-gray-500" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                    Click to upload or drag & drop
                                </p>
                                <p className="text-xs text-gray-500">
                                    {isImage || isCarousel ? "Images" : isVideo ? "Video" : "Document"} only
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Asset Previews */}
                    {formData.creativeAssets.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 animate-in slide-in-from-bottom-2">
                            {formData.creativeAssets.map((asset: CreativeAsset) => (
                                <div key={asset.id} className="flex items-center gap-3 p-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm relative group">
                                    {/* Thumbnail / Icon */}
                                    <div className="w-12 h-12 rounded bg-gray-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200 dark:border-zinc-700">
                                        {asset.type === 'image' ? (
                                            <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                                        ) : asset.type === 'video' ? (
                                            <Icon name="play" className="w-5 h-5 text-gray-500" />
                                        ) : (
                                            <Icon name="fileText" className="w-5 h-5 text-gray-500" />
                                        )}
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{asset.name}</p>
                                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                            {(asset.size / 1024 / 1024).toFixed(2)} MB
                                            <Icon name="checkCircle" className="w-3 h-3 text-green-500" />
                                        </p>
                                    </div>

                                    {/* Remove Action */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); removeAsset(asset.id); }}
                                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                                        title="Remove Asset"
                                    >
                                        <Icon name="close" className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </InputWrapper>
            )}

            <InputWrapper label="Primary Text / Caption" error={errors.adCopy}>
                <div className="relative">
                    <Textarea 
                        placeholder="Enter the ad copy that will appear above or below the creative..." 
                        className={cn("min-h-[120px] text-sm pb-6 resize-none", errors.adCopy && "border-red-500")}
                        value={formData.adCopy}
                        onChange={e => handleChange('adCopy', e.target.value)}
                        onBlur={() => handleBlur('adCopy')}
                    />
                    <div className={cn("absolute bottom-2 right-2 text-[10px] font-medium px-1 rounded", formData.adCopy.length > 200 ? "text-red-500" : "text-gray-400 bg-white dark:bg-zinc-900")}>
                        {formData.adCopy.length}/200
                    </div>
                </div>
            </InputWrapper>
        </div>
    </div>
    );
};


// --- Drafts List View ---
const DraftsView = ({ drafts, onLoadDraft, onDeleteDraft }: { drafts: CampaignDraft[], onLoadDraft: (draft: CampaignDraft) => void, onDeleteDraft: (id: string) => void }) => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-zinc-800/50">
              <TableHead>Draft Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drafts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-gray-500">
                  No saved drafts found.
                </TableCell>
              </TableRow>
            ) : (
              drafts.map((draft) => (
                <TableRow key={draft.id}>
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                    {draft.name || "Untitled Draft"}
                  </TableCell>
                  <TableCell>{draft.type}</TableCell>
                  <TableCell className="text-gray-500">{new Date(draft.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="gray" className="bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400">Draft</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onLoadDraft(draft)}>
                        <Icon name="edit" className="w-3.5 h-3.5 mr-1.5" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDeleteDraft(draft.id)}>
                        <Icon name="close" className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};


export const CreateCampaignDrawer: React.FC<CreateCampaignDrawerProps> = ({ open, onClose, campaignToEdit, onSave }) => {
  const { push } = useGlassyToasts();
  
  // --- State ---
  const [viewMode, setViewMode] = useState<'wizard' | 'drafts'>('wizard');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CampaignFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<CampaignDraft[]>([]);

  // --- Effects ---
  // Load drafts from local storage on mount
  useEffect(() => {
    const savedDrafts = localStorage.getItem('campaign_drafts');
    if (savedDrafts) {
      try {
        setDrafts(JSON.parse(savedDrafts));
      } catch (e) {
        console.error("Failed to parse drafts", e);
      }
    }
  }, []);

  // Reset when opening or editing
  useEffect(() => {
    if (open) {
      if (campaignToEdit) {
        // Populate from existing campaign
        setFormData({
          owner: campaignToEdit.owner?.name || '', // Mapping simplified
          campaignName: campaignToEdit.name,
          type: campaignToEdit.type,
          status: campaignToEdit.status,
          startDate: campaignToEdit.startDate,
          endDate: campaignToEdit.endDate,
          expectedResponse: String(campaignToEdit.metrics.conversions || ''),
          numSent: String(campaignToEdit.metrics.impressions || ''),
          audience: 'Target audience from existing campaign', // Mocked
          budgetType: 'Lifetime Budget', // Mocked
          budgetStartDate: campaignToEdit.startDate,
          budgetEndDate: campaignToEdit.endDate,
          budgetedCost: String(campaignToEdit.metrics.spend || ''),
          actualCost: String(campaignToEdit.metrics.spend || ''), // Mocked
          expectedRevenue: String(campaignToEdit.metrics.revenue || ''),
          creativeFormat: 'Image', // Mocked
          adCopy: 'Existing ad copy...', // Mocked
          creativeAssets: campaignToEdit.image ? [{
             id: 'existing-img',
             name: 'Campaign Image',
             url: campaignToEdit.image,
             type: 'image',
             size: 0
          }] : [],
          description: ''
        });
        setViewMode('wizard');
      } else {
        // Reset for Create Mode
        setFormData(INITIAL_DATA);
        setViewMode('wizard');
      }
      setStep(1);
      setErrors({});
      setTouched({});
    }
  }, [open, campaignToEdit]);

  // --- Handlers ---
  const handleChange = (field: keyof CampaignFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: keyof CampaignFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  // --- Validation Logic ---
  const validateField = (field: keyof CampaignFormData) => {
    let error = "";
    const value = formData[field];

    switch (field) {
      // Step 1
      case 'owner': if (!value) error = "Campaign Owner is required."; break;
      case 'campaignName': 
        if (!value) error = "Campaign Name is required.";
        else if ((value as string).length < 3) error = "Name must be at least 3 characters.";
        break;
      case 'type': if (!value) error = "Campaign Type is required."; break;
      case 'status': if (!value) error = "Status is required."; break;
      case 'startDate': if (!value) error = "Start date is required."; break;
      case 'endDate':
        if (value && formData.startDate && new Date(value as string) < new Date(formData.startDate)) {
          error = "End Date must be after Start Date.";
        }
        break;
      case 'expectedResponse':
         if (value !== '' && Number(value) < 0) {
            error = "Must be 0 or greater.";
         }
         if (formData.numSent && Number(value) > Number(formData.numSent)) {
            error = "Expected outcome cannot be greater than Num Sent.";
         }
        break;
      case 'numSent':
         if (value !== '' && Number(value) < 0) {
            error = "Must be 0 or greater.";
         }
         if (formData.expectedResponse && Number(formData.expectedResponse) > Number(value)) {
            error = "Num Sent must be greater than or equal to Expected Response.";
         }
         break;
      case 'audience':
        if ((value as string).length > 1000) error = "Max 1000 characters allowed.";
        break;

      // Step 2
      case 'budgetEndDate':
        if (value && formData.budgetStartDate && new Date(value as string) < new Date(formData.budgetStartDate)) {
             error = "Budget End Date must be after Budget Start Date.";
        }
        break;
      case 'budgetedCost':
      case 'actualCost':
      case 'expectedRevenue':
         if (value !== '' && Number(value) < 0) error = "Value cannot be negative.";
         break;

      // Step 3
      case 'adCopy':
        if ((value as string).length > 200) error = "Max 200 characters allowed.";
        break;
      // Creative Assets validation is handled in handleFiles and during final submission if we wanted mandatory uploads,
      // but requirement is optional upload. Max file count/size is handled in upload logic.
    }

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
      return false;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const fieldsToValidate: (keyof CampaignFormData)[] = [];

    // Step-based fields
    if (currentStep === 1) {
      fieldsToValidate.push(
        'owner',
        'campaignName',
        'type',
        'status',
        'startDate',
        'endDate',
        'expectedResponse',
        'numSent',
        'audience'
      );
    }
    else if (currentStep === 2) {
      fieldsToValidate.push(
        'budgetEndDate',
        'budgetedCost',
        'actualCost',
        'expectedRevenue'
      );
    }
    else if (currentStep === 3) {
      fieldsToValidate.push('adCopy');
    }

    // 1) Validate individual fields
    let isValid = true;
    fieldsToValidate.forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    // If individual field validation failed → Stop here
    if (!isValid) return false;

    // 2) Cross-field validation rules
    if (currentStep === 1) {
      // Expected Response must not exceed Num Sent
      if (
        formData.expectedResponse &&
        formData.numSent &&
        Number(formData.expectedResponse) > Number(formData.numSent)
      ) {
        setErrors(prev => ({
          ...prev,
          expectedResponse: "Expected outcome cannot be greater than Num Sent.",
          numSent: "Num Sent must be greater than or equal to Expected Response."
        }));
        return false;
      }
    }

    if (currentStep === 2) {
      // Budget End Date must be after Budget Start Date
      if (
        formData.budgetEndDate &&
        formData.budgetStartDate &&
        new Date(formData.budgetEndDate) < new Date(formData.budgetStartDate)
      ) {
        setErrors(prev => ({
          ...prev,
          budgetEndDate: "Budget End Date must be after Budget Start Date."
        }));
        return false;
      }
    }

    return true;
  };

  // --- Actions ---
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 3));
    } else {
      push({ title: "Validation Error", description: "Please fix the errors before proceeding.", variant: "error" });
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleLaunch = () => {
    if (validateStep(3)) {
      const payload = {
        ...formData,
        // Convert numeric strings
        expectedResponse: Number(formData.expectedResponse) || 0,
        numSent: Number(formData.numSent) || 0,
        estimatedTotalCost: Number(formData.budgetedCost) || 0,
        actualCost: Number(formData.actualCost) || 0,
        expectedRevenue: Number(formData.expectedRevenue) || 0,
      };

      if (onSave) {
          onSave(payload);
      } else {
          console.log("🚀 Campaign Launched:", payload);
          push({ title: "Campaign Launched!", description: "Your campaign has been successfully created.", variant: "success" });
      }
      onClose();
    }
  };

  const handleSaveDraft = () => {
      // Validate Step 1 ONLY
      if (!validateStep(1)) {
          push({ title: "Draft Error", description: "Please complete the required fields in Step 1 to save a draft.", variant: "error" });
          return;
      }

      const draftId = `draft_${Date.now()}`;
      const newDraft: CampaignDraft = {
          id: draftId,
          name: formData.campaignName,
          type: formData.type,
          createdAt: new Date().toISOString(),
          data: { ...formData }
      };

      const updatedDrafts = [newDraft, ...drafts];
      setDrafts(updatedDrafts);
      localStorage.setItem('campaign_drafts', JSON.stringify(updatedDrafts));
      
      push({ title: "Draft Saved", description: "Your campaign draft has been saved.", variant: "info" });
  };

  const handleLoadDraft = (draft: CampaignDraft) => {
      setFormData(draft.data);
      setStep(1);
      setErrors({});
      setTouched({});
      setViewMode('wizard');
      push({ title: "Draft Loaded", description: `Loaded draft: ${draft.name}`, variant: "info" });
  };

  const handleDeleteDraft = (id: string) => {
      const updatedDrafts = drafts.filter(d => d.id !== id);
      setDrafts(updatedDrafts);
      localStorage.setItem('campaign_drafts', JSON.stringify(updatedDrafts));
      push({ title: "Draft Deleted", description: "Draft removed from list.", variant: "info" });
  };

  // Step 1 Validity Check for Save Draft button availability
  const isStep1Valid = () => {
      return !!formData.owner && !!formData.campaignName && !!formData.type && !!formData.status && !!formData.startDate;
  };

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="w-full md:w-[900px] p-0 overflow-hidden rounded-l-3xl h-full md:h-screen border-l border-gray-200 dark:border-zinc-800 shadow-2xl" resizable={true} showCloseButton={false}>
        
        {/* --- Header --- */}
        <DrawerHeader className="border-b border-gray-100 dark:border-zinc-800 px-8 py-5 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <DrawerTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {viewMode === 'wizard' ? (campaignToEdit ? "Edit Campaign" : "Create Campaign") : "Saved Drafts"}
                    </DrawerTitle>
                    {viewMode === 'wizard' && <Badge variant="outline" className="font-normal">Step {step} of 3</Badge>}
                </div>
                <DrawerDescription>
                    {viewMode === 'wizard' 
                        ? "Configure your marketing campaign details, budget, and creatives."
                        : "Resume your work from saved drafts."
                    }
                </DrawerDescription>
            </div>
            
            <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
                    <button 
                        onClick={() => setViewMode('wizard')}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                            viewMode === 'wizard' ? "bg-white dark:bg-zinc-600 shadow text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        Wizard
                    </button>
                    <button 
                        onClick={() => setViewMode('drafts')}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2",
                            viewMode === 'drafts' ? "bg-white dark:bg-zinc-600 shadow text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        Drafts
                        {drafts.length > 0 && (
                            <span className="bg-gray-200 dark:bg-zinc-700 px-1.5 rounded-full text-[10px]">{drafts.length}</span>
                        )}
                    </button>
                </div>
                
                {/* Steps Indicator (Only in Wizard) */}
                {viewMode === 'wizard' && (
                    <div className="flex items-center gap-3 pl-4 border-l dark:border-zinc-800">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center">
                                <div 
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2",
                                        step === i ? "border-green-600 bg-green-600 text-white" :
                                        step > i ? "border-green-500 bg-green-500 text-white" :
                                        "border-gray-200 dark:border-zinc-700 text-gray-400 bg-transparent"
                                    )}
                                >
                                    {step > i ? <Icon name="check" className="w-4 h-4" /> : i}
                                </div>
                                {i < 3 && (
                                    <div className={cn("w-8 h-0.5 mx-1 transition-colors duration-300", step > i ? "bg-green-500" : "bg-gray-200 dark:bg-zinc-700")} />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>
        </DrawerHeader>
        
        {/* --- Scrollable Content --- */}
        <div className="flex-1 overflow-y-auto bg-gray-50/80 dark:bg-zinc-950/80 p-6 md:p-8">
            {viewMode === 'wizard' ? (
                <>
                    {step === 1 && <Step1Content formData={formData} handleChange={handleChange} handleBlur={handleBlur} errors={errors} />}
                    {step === 2 && <Step2Content formData={formData} handleChange={handleChange} handleBlur={handleBlur} errors={errors} />}
                    {step === 3 && <Step3Content formData={formData} handleChange={handleChange} handleBlur={handleBlur} errors={errors} setErrors={setErrors} />}
                </>
            ) : (
                <DraftsView drafts={drafts} onLoadDraft={handleLoadDraft} onDeleteDraft={handleDeleteDraft} />
            )}
        </div>

        {/* --- Footer --- */}
        <DrawerFooter className="border-t border-gray-200 dark:border-zinc-800 px-8 py-5 bg-white dark:bg-zinc-900 flex-row justify-between items-center">
             <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-800">
                Close
             </Button>
             
             {viewMode === 'wizard' && (
                 <div className="flex gap-3">
                    {/* Save Draft Button - Only on Step 1 and if basically valid */}
                    {step === 1 && !campaignToEdit && (
                        <Button 
                            variant="outline" 
                            onClick={handleSaveDraft}
                            className="text-gray-600 border-gray-300 hover:bg-gray-50"
                            disabled={!isStep1Valid()}
                        >
                            <Icon name="download" className="w-4 h-4 mr-2" /> Save Draft
                        </Button>
                    )}

                    {step > 1 && (
                        <Button variant="outline" onClick={handleBack} className="w-24">
                            Back
                        </Button>
                    )}
                    
                    {step < 3 ? (
                        <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700 text-white w-32 shadow-sm">
                            Continue <Icon name="arrowRight" className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleLaunch} className="bg-green-600 hover:bg-green-700 text-white w-40 shadow-md">
                            {campaignToEdit ? "Save Changes" : "Launch Campaign"}
                        </Button>
                    )}
                </div>
             )}
        </DrawerFooter>

      </DrawerContent>
    </Drawer>
  );
};
