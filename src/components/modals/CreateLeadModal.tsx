
import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "../ui/Drawer";

import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/Select";

import MultiSelect from "../ui/MultiSelect"; 
import { Icon } from "../shared/Icon";
import { useGlassyToasts } from "../ui/GlassyToastProvider";

export interface LeadFormData {
  templateType: "company" | "individual";
  companyName: string;
  firstName: string;
  lastName: string;
  contactPerson: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  tags: string[];
  leadOwner: string;
  budget: string;
  stage: string;
  rating: "Hot" | "Warm" | "Cold";
  leadSource: string;
  description: string;
  preferredContact: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: LeadFormData) => void;
}

const owners = ["Priya Patel", "Rohan Kumar", "Ananya Singh", "Jane Smith", "John Doe"];
const stages = ["Lead Gen", "Qualification", "Proposal", "Demo", "Negotiation"];
const ratings = ["Hot", "Warm", "Cold"];
const sources = ["Website", "Email", "Cold Call", "Event", "Referral", "Social Media"];
const contactChannels = ["Phone", "Email", "WhatsApp", "SMS"];

const defaultTags = [
  "Premium",
  "Negotiation",
  "Repeat Buyer",
  "High Budget",
  "Furniture",
  "Interior",
  "Urgent",
];

const CreateLeadModal: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  const { push } = useGlassyToasts();

  const [tagsList, setTagsList] = useState<string[]>(defaultTags);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagText, setNewTagText] = useState("");

  const [form, setForm] = useState<LeadFormData>({
    templateType: "company",
    companyName: "",
    firstName: "",
    lastName: "",
    contactPerson: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    tags: [],
    leadOwner: owners[0],
    budget: "",
    stage: stages[0],
    rating: "Warm",
    leadSource: sources[0],
    description: "",
    preferredContact: contactChannels[0],
  });

  const update = (key: keyof LeadFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (form.templateType === "individual") {
      update("contactPerson", `${form.firstName} ${form.lastName}`.trim());
    }
  }, [form.templateType, form.firstName, form.lastName]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedTags([]);
      setForm((prev) => ({ ...prev, tags: [] }));
    }
  }, [isOpen]);

  const validate = (): string | null => {
    if (form.templateType === "company" && !form.companyName.trim()) return "Company name is required.";
    if (form.templateType === "individual") {
      if (!form.firstName.trim() || !form.lastName.trim()) return "First & Last name required.";
    }
    if (!form.contactPerson.trim()) return "Contact person required.";
    if (!form.phone && !form.email) return "Phone or Email required."; 
    return null;
  };

  const addNewTag = () => {
    const t = newTagText.trim();
    if (!t) return;
    if (!tagsList.includes(t)) setTagsList((prev) => [...prev, t]);
    if (!selectedTags.includes(t)) setSelectedTags((prev) => [...prev, t]);
    setNewTagText("");
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) {
      push({ title: "Validation Error", description: err, variant: "error" });
      return;
    }
    onCreate({ ...form, tags: selectedTags });
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="w-full md:w-[900px] p-0 overflow-hidden rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 shadow-2xl" resizable>
        
        {/* Header */}
        <DrawerHeader className="border-b px-6 py-4 bg-white dark:bg-zinc-900 z-10">
          <div className="flex items-center gap-2">
            <DrawerTitle className="flex items-center gap-2">
              <Icon name="plus" className="h-5 w-5 text-green-600" />
              Create Lead
            </DrawerTitle>
          </div>
          <DrawerDescription>
            Add a new lead to your pipeline.
          </DrawerDescription>
        </DrawerHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-zinc-950/50">

          {/* Type & Owner */}
          <div className="grid grid-cols-2 gap-5">
             <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={form.templateType}
                  onValueChange={(v) => update("templateType", v as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
             </div>
             
             <div className="space-y-2">
                <Label>Owner</Label>
                <Select
                  value={form.leadOwner}
                  onValueChange={(v) => update("leadOwner", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
             </div>
          </div>

          {/* Name Fields */}
          {form.templateType === "company" ? (
            <div className="space-y-2">
              <Label>Company Name *</Label>
              <Input placeholder="e.g. Acme Corp" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input placeholder="John" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input placeholder="Doe" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} />
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Contact Person</Label>
              <Input placeholder="Full Name" value={form.contactPerson} onChange={(e) => update("contactPerson", e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label>Preferred Contact</Label>
               <Select value={form.preferredContact} onValueChange={(v) => update("preferredContact", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {contactChannels.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input placeholder="user@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input placeholder="+1..." value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
          </div>

          {/* Deal Details */}
          <div className="grid grid-cols-3 gap-4">
             <div className="space-y-2">
               <Label>Budget</Label>
               <Input type="number" placeholder="0.00" value={form.budget} onChange={(e) => update("budget", e.target.value)} />
             </div>
             <div className="space-y-2">
               <Label>Stage</Label>
               <Select value={form.stage} onValueChange={(v) => update("stage", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{stages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
               </Select>
             </div>
             <div className="space-y-2">
               <Label>Rating</Label>
               <Select value={form.rating} onValueChange={(v) => update("rating", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{ratings.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
               </Select>
             </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input className="flex-1" placeholder="Add custom tag..." value={newTagText} onChange={(e) => setNewTagText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addNewTag()} />
              <Button variant="outline" onClick={addNewTag}>Add</Button>
            </div>
            <div className="mt-1">
                <MultiSelect
                    label="Select Tags"
                    options={tagsList}
                    value={selectedTags}
                    onChange={setSelectedTags}
                    placeholder="Choose tags..."
                />
            </div>
          </div>
          
          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea className="min-h-[100px] resize-none" placeholder="Additional details..." value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>

        </div>

        {/* Footer */}
        <DrawerFooter className="border-t px-6 py-4 bg-white dark:bg-zinc-900 z-20">
          <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">Create Lead</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateLeadModal;
