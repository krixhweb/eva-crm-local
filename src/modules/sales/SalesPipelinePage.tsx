/**
 * Sales Pipeline Page
 * - Manages deals, filters, sorting, pagination
 * - Renders Dashboard, Toolbar, Kanban/Table views
 * - Handles CSV import/export + drag & drop
 */

import { useMemo, useState } from "react";
import { useSelector } from 'react-redux';

import Dashboard from "./components/leads/Dashboard";
import Toolbar from "./components/leads/Toolbar";
import PipelineAndTable from "./components/leads/PipelineAndTable";

import CreateLeadModal from "../../components/modals/CreateLeadModal";
import { useGlassyToasts } from "../../components/ui/GlassyToastProvider";

import type { Deal, LeadFormData } from '../../types';
import { mockDeals } from '../../data/mockData';
import type { RootState } from '../../store/store';

const STAGES = ["Lead Gen","Qualification","Proposal","Demo","Negotiation","Closed Won","Closed Lost"];
const PRIORITIES = ["low","medium","high"];

const SalesPipelinePage: React.FC = () => {
  const currentUser = useSelector((s: RootState) => s.auth.currentUser);
  const { push } = useGlassyToasts();

  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [view, setView] = useState<"kanban" | "table">("kanban");

  // Filters
  const [searchValue, setSearchValue] = useState("");
  const [assignedValue, setAssignedValue] = useState("All");
  const [stageValue, setStageValue] = useState("All");
  const [priorityValue, setPriorityValue] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Table sorting & pagination
  const [sortConfig, setSortConfig] = useState<{ key: keyof Deal; direction: "asc" | "desc" } | null>({
    key: "value", direction: "desc"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // Apply filters + optional sorting (table only)
  const filteredDeals = useMemo(() => {
    return deals
      .filter(d => {
        if (searchValue && !(`${d.company} ${d.contactPerson}`.toLowerCase().includes(searchValue.toLowerCase()))) return false;
        if (assignedValue !== "All" && !d.assignees.some(a => a.name === assignedValue)) return false;
        if (stageValue !== "All" && d.stage !== stageValue) return false;
        if (priorityValue !== "All" && d.priority !== priorityValue) return false;

        if (dateFrom) {
          const from = new Date(dateFrom);
          if (new Date(d.dueDate) < from) return false;
        }
        if (dateTo) {
          const to = new Date(dateTo);
          if (new Date(d.dueDate) > to) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (view === "kanban" || !sortConfig) return 0;
        const aV = a[sortConfig.key];
        const bV = b[sortConfig.key];

        if (typeof aV === "number" && typeof bV === "number") {
          return sortConfig.direction === "asc" ? aV - bV : bV - aV;
        }
        return sortConfig.direction === "asc"
          ? String(aV).localeCompare(String(bV))
          : String(bV).localeCompare(String(aV));
      });
  }, [deals, searchValue, assignedValue, stageValue, priorityValue, dateFrom, dateTo, sortConfig, view]);

  // Pagination (table only)
  const totalPages = Math.ceil(filteredDeals.length / ITEMS_PER_PAGE) || 1;
  const paginatedDeals = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDeals.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDeals, currentPage]);

  // When toolbar changes filters
  const handleToolbarChange = (p: any) => {
    if (p.searchValue !== undefined) setSearchValue(p.searchValue);
    if (p.assignedValue !== undefined) setAssignedValue(p.assignedValue);
    if (p.stageValue !== undefined) setStageValue(p.stageValue);
    if (p.priorityValue !== undefined) setPriorityValue(p.priorityValue);
    if (p.dateFrom !== undefined) setDateFrom(p.dateFrom);
    if (p.dateTo !== undefined) setDateTo(p.dateTo);

    setCurrentPage(1); // always reset page
  };

  // Refresh button toast
  const handleRefresh = () => {
    push({ title: "Filters applied", description: "Data refreshed", variant: "info" });
  };

  // Export CSV
  const handleExport = () => {
    if (!filteredDeals.length) {
      push({ title: "No data", description: "Nothing to export", variant: "error" });
      return;
    }

    const header = ["Company","Description","Value","Stage","Priority","Probability"];
    const rows = filteredDeals.map(d => [
      `"${d.company}"`,
      `"${d.description || ""}"`,
      d.value,
      d.stage,
      d.priority,
      d.probability
    ]);

    const csv = [header.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `export_${Date.now()}.csv`;
    link.click();

    push({ title: "Exported", description: `${filteredDeals.length} rows`, variant: "success" });
  };

  // Import CSV
  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const text = String(e.target?.result || "");
      const lines = text.split(/\r?\n/).filter(Boolean);

      if (lines.length <= 1) {
        push({ title: "Empty file", variant: "error" });
        return;
      }

      const header = lines[0].split(",");
      const required = ["Company","Description","Value","Stage","Priority","Probability"];
      const valid = required.every((h, i) => header[i]?.trim().toLowerCase() === h.toLowerCase());

      if (!valid) {
        push({ title: "Invalid CSV", description: `Needs: ${required.join(", ")}`, variant: "error" });
        return;
      }

      const imported: Deal[] = lines.slice(1).map((line, i) => {
        const cols = line.split(",").map(c => c.replace(/^"|"$/g, ""));
        const [company, description, value, stage, priority, prob] = cols;

        return {
          id: `imp-${Date.now()}-${i}`,
          company,
          description,
          contactPerson: "",
          value: Number(value),
          probability: Number(prob),
          stage,
          priority: priority as Deal["priority"],
          assignees: [{ name: "Unassigned", avatar: "UA" }],
          comments: 0,
          attachments: 0,
          daysInStage: 0,
          dueDate: new Date().toISOString().split("T")[0],
          createdBy: currentUser.id,
          createdByName: currentUser.name,
          createdAt: new Date().toISOString()
        };
      });

      if (!imported.length) {
        push({ title: "Nothing found", variant: "error" });
        return;
      }

      if (confirm(`Import ${imported.length} deals? OK=Append / Cancel=Replace`)) {
        setDeals(prev => [...imported, ...prev]);
      } else {
        setDeals(imported);
      }

      push({ title: "Import complete", variant: "success" });
    };

    reader.readAsText(file);
  };

  // Move card between stages (Kanban)
  const handleMoveDeal = (id: string, newStage: string, newIndex?: number) => {
    const deal = deals.find(d => d.id === id);
    if (!deal) return;

    const updated = {
      ...deal,
      stage: newStage,
      updatedBy: currentUser.id,
      updatedByName: currentUser.name,
      updatedAt: new Date().toISOString()
    };

    const without = deals.filter(d => d.id !== id);
    const target = without.filter(d => d.stage === newStage);

    let final: Deal[];

    // Insert at index or end of stage
    if (newIndex === undefined || newIndex >= target.length) {
      if (!target.length) {
        final = [...without, updated];
      } else {
        const last = target[target.length - 1];
        const pos = without.indexOf(last);
        final = [...without.slice(0, pos + 1), updated, ...without.slice(pos + 1)];
      }
    } else {
      const targetDeal = target[newIndex];
      const pos = without.indexOf(targetDeal);
      final = [...without.slice(0, pos), updated, ...without.slice(pos)];
    }

    setDeals(final);

    if (deal.stage !== newStage) {
      push({ title: "Deal moved", description: `${deal.company} → ${newStage}`, variant: "success" });
    }
  };

  // Mark deal lost
  const handleMarkLost = (id: string) => {
    const deal = deals.find(d => d.id === id);
    if (!deal) return;

    if (!confirm(`Mark "${deal.company}" as Lost?`)) return;

    setDeals(prev =>
      prev.map(d =>
        d.id === id
          ? { ...d, stage: "Closed Lost", updatedAt: new Date().toISOString() }
          : d
      )
    );

    push({ title: "Marked lost", description: deal.company, variant: "info" });
  };

  // Table column sort toggles
  const handleSort = (key: keyof Deal) => {
    if (!sortConfig || sortConfig.key !== key) {
      setSortConfig({ key, direction: "desc" });
    } else {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc"
      });
    }
  };

  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Sales Pipeline</h1>
        <p className="text-gray-500">Visualize and manage your deals</p>
      </div>

      {/* Stats */}
      <Dashboard deals={filteredDeals} />

      {/* Filters & actions */}
      <Toolbar
        assignees={Array.from(new Set(deals.flatMap(d => d.assignees.map(a => a.name))))}
        stages={["All", ...STAGES]}
        priorities={["All", ...PRIORITIES]}

        searchValue={searchValue}
        assignedValue={assignedValue}
        stageValue={stageValue}
        priorityValue={priorityValue}
        dateFrom={dateFrom}
        dateTo={dateTo}

        view={view}
        onChange={handleToolbarChange}
        onRefresh={handleRefresh}
        onExport={handleExport}
        onImportFile={handleImportFile}
        onToggleView={() => setView(v => (v === "kanban" ? "table" : "kanban"))}
        onNewLead={() => setCreateOpen(true)}
      />

      {/* Pipeline or Table */}
      <PipelineAndTable
        deals={view === "kanban" ? filteredDeals : paginatedDeals}
        stages={STAGES}
        view={view}
        sortConfig={sortConfig}

        onMoveDeal={handleMoveDeal}
        onMarkLost={handleMarkLost}
        onRequestSort={handleSort}

        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Create Lead */}
      <CreateLeadModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(data: LeadFormData) => {
          const owner = {
            name: data.leadOwner || "Unassigned",
            avatar: (data.leadOwner || "UA").split(" ").map(n => n[0]).join("")
          };

          const due = new Date();
          due.setDate(due.getDate() + 30);

          const newDeal: Deal = {
            id: `lead-${Date.now()}`,
            company:
              data.templateType === "company"
                ? data.companyName
                : `${data.firstName} ${data.lastName}`,
            contactPerson: data.contactPerson,
            description: data.description || "",
            value: Number(data.budget),
            probability: data.rating === "Hot" ? 80 : data.rating === "Warm" ? 50 : 20,
            assignees: [owner],
            priority: data.rating === "Hot" ? "high" : data.rating === "Warm" ? "medium" : "low",
            stage: data.stage,
            comments: 0,
            attachments: 0,
            daysInStage: 0,
            dueDate: due.toISOString().split("T")[0],

            createdBy: currentUser.id,
            createdByName: currentUser.name,
            createdAt: new Date().toISOString()
          };

          setDeals(prev => [newDeal, ...prev]);
          setCreateOpen(false);

          push({ title: "Lead created", description: newDeal.company, variant: "success" });
        }}
      />
    </div>
  );
};

export default SalesPipelinePage;
