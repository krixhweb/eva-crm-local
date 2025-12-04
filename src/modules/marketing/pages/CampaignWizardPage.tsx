
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { Icon } from '../../../components/shared/Icon';
import { useGlassyToasts } from '../../../components/ui/GlassyToastProvider';
import { 
  WizardStep1Setup, 
  WizardStep2Template, 
  WizardStep3Editor, 
  WizardStep4Audience, 
  WizardStep5Schedule, 
  WizardStep6Review 
} from '../components/wizard/WizardStepContent';
import type { Block } from './editor/editorTypes';
import { getDefaultBlock } from './editor/editorTypes';
import ConfirmationDialog from '../../../components/modals/ConfirmationDialog';

// --- Types ---
export interface WizardData {
  // Step 1
  campaignName: string;
  subjectLine: string;
  previewText: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  tags: string[];
  isTransactional: boolean;
  
  // Step 2
  templateId: string | null;
  importHtml?: string;
  
  // Step 3
  emailBlocks: Block[];
  
  // Step 4
  audienceSegment: string;
  excludedSegments: string[];
  
  // Step 5
  scheduleType: 'now' | 'later';
  sendDate: string;
  sendTime: string;
  timezone: string;
}

const INITIAL_DATA: WizardData = {
  campaignName: '',
  subjectLine: '',
  previewText: '',
  fromName: 'Eva Team',
  fromEmail: 'hello@evacrm.com',
  replyTo: 'support@evacrm.com',
  tags: [],
  isTransactional: false,
  templateId: null,
  emailBlocks: [getDefaultBlock('header'), getDefaultBlock('text')],
  audienceSegment: '',
  excludedSegments: [],
  scheduleType: 'now',
  sendDate: new Date().toISOString().split('T')[0],
  sendTime: '09:00',
  timezone: 'UTC-5'
};

const STEPS = [
  { id: 1, label: 'Setup', icon: 'settings' },
  { id: 2, label: 'Template', icon: 'layout' },
  { id: 3, label: 'Design', icon: 'edit' },
  { id: 4, label: 'Audience', icon: 'users' },
  { id: 5, label: 'Schedule', icon: 'calendar' },
  { id: 6, label: 'Review', icon: 'checkCircle' },
];

const CampaignWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const { push } = useGlassyToasts();
  
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('campaign_wizard_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.campaignName || parsed.subjectLine) {
           setData(parsed);
        }
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('campaign_wizard_draft', JSON.stringify(data));
    }, 1000);
    return () => clearTimeout(timer);
  }, [data]);

  // --- Navigation Logic ---
  const updateData = (updates: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!data.campaignName || !data.subjectLine || !data.fromEmail) {
          push({ title: "Validation Error", description: "Please fill in all required fields.", variant: "error" });
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.fromEmail)) {
             push({ title: "Validation Error", description: "Invalid From Email format.", variant: "error" });
             return false;
        }
        return true;
      case 2:
         return true;
      case 4:
        if (!data.audienceSegment) {
          push({ title: "Validation Error", description: "Please select an audience segment.", variant: "error" });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleDraftSave = () => {
    localStorage.setItem('campaign_wizard_draft', JSON.stringify(data));
    push({ title: "Draft Saved", description: "Your progress has been saved locally.", variant: "info" });
  };

  const handleFinish = () => {
    setIsSubmitting(true);
    // Simulate API
    setTimeout(() => {
      setIsSubmitting(false);
      localStorage.removeItem('campaign_wizard_draft'); // Clear draft
      push({ title: "Success", description: "Campaign created successfully!", variant: "success" });
      navigate('/marketing/channel/email');
    }, 1500);
  };
  
  const handleExit = () => {
      setShowExitConfirm(true);
  };

  const confirmExit = () => {
      navigate('/marketing/channel/email');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-black overflow-hidden">
      
      {/* --- Top Bar (Stepper) --- */}
      <header className="h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shrink-0 px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleExit}>
            <Icon name="close" className="w-5 h-5 text-gray-500" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {data.campaignName || "New Campaign"}
            </h1>
            <p className="text-xs text-gray-500">Email Marketing</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="hidden md:flex items-center gap-1">
          {STEPS.map((s, idx) => (
            <React.Fragment key={s.id}>
              <div 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  step === s.id 
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
                    : step > s.id 
                      ? "text-green-600 dark:text-green-400" 
                      : "text-gray-400"
                }`}
              >
                <Icon 
                    name={step > s.id ? "check" : s.icon as any} 
                    className={`w-3.5 h-3.5 ${step === s.id ? "animate-pulse" : ""}`} 
                />
                <span>{s.label}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-4 h-0.5 rounded ${step > s.id ? 'bg-green-500' : 'bg-gray-200 dark:bg-zinc-700'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" onClick={handleDraftSave}>Save Draft</Button>
           <div className="text-xs text-gray-400 font-mono hidden lg:block">
               {step} / {STEPS.length}
           </div>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
            <motion.div
                key={step}
                {...({
                    initial: { opacity: 0, x: 20 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: -20 },
                    transition: { duration: 0.2 }
                } as any)}
                className="h-full overflow-y-auto p-6 md:p-8"
            >
                <div className={step === 3 ? "h-full w-full max-w-full" : "max-w-5xl mx-auto"}>
                    {step === 1 && <WizardStep1Setup data={data} updateData={updateData} />}
                    {step === 2 && <WizardStep2Template data={data} updateData={updateData} onNext={handleNext} />}
                    {step === 3 && <WizardStep3Editor data={data} updateData={updateData} />}
                    {step === 4 && <WizardStep4Audience data={data} updateData={updateData} />}
                    {step === 5 && <WizardStep5Schedule data={data} updateData={updateData} />}
                    {step === 6 && <WizardStep6Review data={data} onSubmit={handleFinish} isSubmitting={isSubmitting} />}
                </div>
            </motion.div>
        </AnimatePresence>
      </div>

      {/* --- Bottom Navigation Bar --- */}
      <footer className="h-16 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 shrink-0 px-6 flex items-center justify-between z-30">
        <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={step === 1}
            className="text-gray-600 dark:text-gray-300"
        >
            <Icon name="arrowLeft" className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="flex gap-3">
             {step === 6 ? (
                 <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700 text-white w-40" disabled={isSubmitting}>
                    {isSubmitting ? <Icon name="refreshCw" className="w-4 h-4 animate-spin" /> : "Launch Campaign"}
                 </Button>
             ) : (
                 <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white w-32">
                    Next <Icon name="arrowRight" className="w-4 h-4 ml-2" />
                 </Button>
             )}
        </div>
      </footer>
      
      <ConfirmationDialog
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onConfirm={confirmExit}
        title="Exit Wizard?"
        description="You have unsaved changes. Are you sure you want to leave? Progress may be lost."
      />
    </div>
  );
};

export default CampaignWizardPage;
