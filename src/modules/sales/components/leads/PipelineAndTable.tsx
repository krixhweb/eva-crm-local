
import React, { useMemo } from "react";
import { Card } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Icon } from "../../../../components/icons/Icon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../../components/ui/DropdownMenu";
import { formatCurrency } from "../../../../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/Table";
import { motion, AnimatePresence } from "framer-motion";
import { slideUp } from "../../../../lib/motion";
import { useKanbanCardAnimation } from "../../../../lib/kanbanAnimations";
import { getColumnFromPoint, getIndexFromPoint } from "../../../../lib/kanban-math";
import type { Deal } from "../../../../types";

type Props = {
  deals: Deal[];
  stages: string[];
  view: "kanban" | "table";
  onMoveDeal: (dealId: string, newStage: string, newIndex?: number) => void;
  onMarkLost: (dealId: string, reason?: string) => void;
  onRequestSort: (key: keyof Deal) => void;
  sortConfig?: { key: keyof Deal; direction: "asc" | "desc" } | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case "high":
      return { dot: "bg-red-500" };
    case "medium":
      return { dot: "bg-yellow-500" };
    default:
      return { dot: "bg-blue-500" };
  }
};

/* -------------------------------------------------------------------------- */
/*                               Deal Card (Drag)                             */
/* -------------------------------------------------------------------------- */

const DealCard: React.FC<{
  deal: Deal;
  onMoveDeal: (id: string, stage: string, index: number) => void;
  onMarkLost: (id: string) => void;
}> = ({
  deal,
  onMoveDeal,
  onMarkLost,
}) => {
  const {
    style,
    onDragStart,
    onDragEnd: onAnimationDragEnd,
  } = useKanbanCardAnimation();

  return (
    <motion.div
      layout
      layoutId={deal.id}
      data-kanban-card={deal.id}
      style={style}
      drag
      dragElastic={0.12}
      dragMomentum={false}
      dragSnapToOrigin
      onDragStart={onDragStart}
      {...({
        onDragEnd: (event: any, info: any) => {
            onAnimationDragEnd();
            const dropStageId = getColumnFromPoint(info.point.x, info.point.y);
            
            if (dropStageId) {
                const stageColumnEl = document.querySelector(`[data-kanban-stage="${dropStageId}"]`);
                
                if (stageColumnEl) {
                    const newIndex = getIndexFromPoint(info.point.y, stageColumnEl, deal.id);
                    onMoveDeal(deal.id, dropStageId, newIndex);
                }
            }
        }
      } as any)}
      // Removed static 'shadow-sm' class as it is now handled by 'style.boxShadow' from the hook
      className="w-full bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 flex flex-col gap-2 group touch-none select-none cursor-grab active:cursor-grabbing relative z-0 hover:z-10"
    >
      {/* Top Row */}
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
            {deal.company}
          </div>
          <div className="text-xs text-gray-500">{deal.contactPerson}</div>
        </div>

        <div className="text-right">
          <div className="font-bold text-green-600 text-sm">
            {formatCurrency(deal.value)}
          </div>
          <div className="text-xs text-gray-400">{deal.probability}%</div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              getPriorityStyles(deal.priority).dot
            }`}
          />
          <span className="capitalize font-medium">{deal.priority}</span>
        </div>

        <div
          className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {deal.comments > 0 && (
            <div className="flex items-center gap-1">
              <Icon
                name="messageCircle"
                className="w-3.5 h-3.5 text-gray-500"
              />
              {deal.comments}
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Icon name="moreVertical" className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onMarkLost(deal.id)}
                className="text-red-500"
              >
                Mark Lost
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Main Component                                 */
/* -------------------------------------------------------------------------- */

const PipelineAndTable: React.FC<Props> = ({
  deals,
  stages,
  view,
  onMoveDeal,
  onMarkLost,
  onRequestSort,
  sortConfig,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const byStage = useMemo(() => {
    const map: Record<string, Deal[]> = {};
    stages.forEach((s) => (map[s] = []));
    deals.forEach((d) => {
      if (!map[d.stage]) map[d.stage] = [];
      map[d.stage].push(d);
    });
    return map;
  }, [deals, stages]);

  /* ---------------------------------------------------------------------- */
  /*                               KANBAN VIEW                              */
  /* ---------------------------------------------------------------------- */

  if (view === "kanban") {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x min-h-[650px]">
        {stages.map((s) => (
          <div
            key={s}
            className="w-[320px] flex-shrink-0 snap-center flex flex-col"
          >
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl border-t-4 border-transparent hover:border-green-400/50 transition-colors flex flex-col h-full max-h-[80vh]">
              {/* Column Header */}
              <div className="flex items-center justify-between p-3">
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  {s}
                </h4>
                <span className="text-xs bg-white dark:bg-gray-700 px-2 py-0.5 rounded-full font-mono shadow-sm">
                  {byStage[s]?.length ?? 0}
                </span>
              </div>

              {/* Drop zone */}
              <div
                data-kanban-column
                data-kanban-stage={s}
                className="flex flex-col gap-4 flex-1 min-h-[300px] p-2 w-full overflow-visible"
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {byStage[s]?.map((d) => (
                    <DealCard
                      key={d.id}
                      deal={d}
                      onMoveDeal={onMoveDeal}
                      onMarkLost={onMarkLost}
                    />
                  ))}
                </AnimatePresence>

                {(!byStage[s] || byStage[s].length === 0) && (
                  <motion.div
                    {...({
                        initial: { opacity: 0 },
                        animate: { opacity: 0.5 }
                    } as any)}
                    className="text-center text-xs text-gray-400 py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    Drop here
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /*                               TABLE VIEW                               */
  /* ---------------------------------------------------------------------- */

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company & Contact</TableHead>

              {/* Value Sort */}
              <TableHead
                className="cursor-pointer"
                onClick={() => onRequestSort("value")}
              >
                Value
              </TableHead>

              <TableHead>Probability</TableHead>

              {/* Stage Sort */}
              <TableHead
                className="cursor-pointer"
                onClick={() => onRequestSort("stage")}
              >
                Stage
              </TableHead>

              <TableHead>Priority</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <AnimatePresence>
              {deals.map((d) => (
                <motion.tr
                  key={d.id}
                  {...({
                    variants: slideUp,
                    initial: "hidden",
                    animate: "show",
                    exit: { opacity: 0, x: -10 }
                  } as any)}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <TableCell className="p-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {d.company}
                    </div>
                    <div className="text-xs text-gray-500">{d.contactPerson}</div>
                  </TableCell>

                  <TableCell className="p-4 font-semibold text-green-600">
                    {formatCurrency(d.value)}
                  </TableCell>

                  <TableCell className="p-4 text-sm text-gray-500">
                    {d.probability}%
                  </TableCell>

                  <TableCell className="p-4">
                    <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium">
                      {d.stage}
                    </span>
                  </TableCell>

                  <TableCell className="p-4">
                    <span className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          getPriorityStyles(d.priority).dot
                        }`}
                      />
                      <span className="capitalize text-sm">
                        {d.priority}
                      </span>
                    </span>
                  </TableCell>

                  <TableCell className="p-4 text-sm text-gray-500">
                    {d.assignees?.[0]?.name ?? "N/A"}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="p-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Icon name="moreVertical" className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onMarkLost(d.id)}
                          className="text-red-500"
                        >
                          Mark Lost
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="p-4 flex items-center justify-between border-t dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PipelineAndTable;
