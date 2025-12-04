import React, { useRef, useState } from "react";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Icon } from "../../../../components/shared/icon";
import { LeadsFilterDrawer } from "./LeadsFilterDrawer";
import { Badge } from "../../../../components/ui/Badge";
import { Card } from "../../../../components/ui/Card";

type ToolbarChangePayload = Partial<{
  searchValue: string;
  assignedValue: string;
  stageValue: string;
  priorityValue: string;
  dateFrom: string;
  dateTo: string;
}>;

type LeadsFilterState = {
  assignedValue: string;
  stageValue: string;
  priorityValue: string;
  dateFrom: string;
  dateTo: string;
};

interface ToolbarProps {
  assignees: string[];
  stages: string[];
  priorities: string[];
  searchValue: string;
  assignedValue: string;
  stageValue: string;
  priorityValue: string;
  dateFrom: string;
  dateTo: string;
  onChange: (payload: ToolbarChangePayload) => void;
  onRefresh: () => void;
  onExport: () => void;
  onImportFile: (file: File) => void;
  onToggleView: () => void;
  view: "kanban" | "table";
  onNewLead: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  assignees,
  stages,
  priorities,
  searchValue,
  assignedValue,
  stageValue,
  priorityValue,
  dateFrom,
  dateTo,
  onChange,
  onRefresh,
  onExport,
  onImportFile,
  onToggleView,
  view,
  onNewLead,
}) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFilterCount =
    (assignedValue !== "All" ? 1 : 0) +
    (stageValue !== "All" ? 1 : 0) +
    (priorityValue !== "All" ? 1 : 0) +
    (dateFrom || dateTo ? 1 : 0);

  const handleApplyFilters = (filters: LeadsFilterState) => {
    onChange(filters);
  };

  const handleClearFilters = () => {
    onChange({
      assignedValue: "All",
      stageValue: "All",
      priorityValue: "All",
      dateFrom: "",
      dateTo: "",
    });
  };

  return (
    <Card className="p-3">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 md:flex-none md:w-64">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          />
          <Input
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange({ searchValue: e.target.value })
            }
            placeholder="Search company or contact..."
            className="pl-9 h-9 w-full"
          />
        </div>

        {/* Filter Button */}
        <Button
          variant="outline"
          size="sm"
          className="gap-2 relative"
          onClick={() => setIsFilterOpen(true)}
        >
          <Icon name="list" className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge
              variant="green"
              className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {/* Tools */}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onExport}>
            <Icon name="download" className="mr-2 h-4 w-4" />
            Export
          </Button>

          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0] || null;
              if (file) {
                onImportFile(file);
                // Allow selecting the same file again
                e.target.value = "";
              }
            }}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
          >
            <Icon name="arrowUp" className="mr-2 h-4 w-4" />
            Import
          </Button>

          <Button variant="outline" size="sm" onClick={onRefresh}>
            <Icon name="refreshCw" className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <div className="h-8 border-l border-gray-300 dark:border-gray-700 mx-2"></div>

          <Button variant="outline" size="sm" onClick={onToggleView}>
            <Icon
              name={view === "kanban" ? "table" : "pipeline"}
              className="mr-2 h-4 w-4"
            />
            {view === "kanban" ? "Table View" : "Kanban View"}
          </Button>

          <Button size="sm" onClick={onNewLead}>
            + New Lead
          </Button>
        </div>
      </div>

      <LeadsFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        currentFilters={{
          assignedValue,
          stageValue,
          priorityValue,
          dateFrom,
          dateTo,
        }}
        assignees={assignees}
        stages={stages}
        priorities={priorities}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />
    </Card>
  );
};

export default Toolbar;
