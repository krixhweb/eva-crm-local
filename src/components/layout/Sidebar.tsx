/* Sidebar.tsx — App navigation with groups, nested items, collapse, and drag-to-resize */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, setBreadcrumb, setSidebarWidth, setSidebarOpen } from '../../store/uiSlice';
import type { RootState } from '../../store/store';
import { Icon } from '../shared/icon';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

/* --- Types for navigation structure --- */
interface SubItem {
  label: string;
  path: string;
  icon: string;
  breadcrumb: string[];
}

interface NavItem {
  label: string;
  path: string;
  icon: string;
  breadcrumb: string[];
  new?: boolean;
  subItems?: SubItem[];
}

interface NavGroup {
  title: string;
  icon: string;
  defaultOpen: boolean;
  items: NavItem[];
}

/* --- Navigation data: groups, items, sub-items --- */
const navGroups: NavGroup[] = [
  {
    title: '360° Overview',
    icon: 'analytics',
    defaultOpen: true,
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard', breadcrumb: ['360° Overview', 'Dashboard'] },
      { label: 'Customer Directory', path: '/customers', icon: 'users', breadcrumb: ['360° Overview', 'Customer Directory'] },
      { label: 'Abandoned Carts', path: '/abandoned-carts', icon: 'shoppingCart', breadcrumb: ['360° Overview', 'Abandoned Carts'] },
    ],
  },
  {
    title: 'Marketing',
    icon: 'megaphone',
    defaultOpen: false,
    items: [
      { label: 'Campaigns Management', path: '/marketing/campaigns', icon: 'megaphone', breadcrumb: ['Marketing', 'Campaigns Management'] },
      {
        label: 'Channel Marketing',
        path: '#',
        icon: 'send',
        breadcrumb: ['Marketing', 'Channel Marketing'],
        subItems: [
          { label: 'Email Marketing', path: '/marketing/channel/email', icon: 'mail', breadcrumb: ['Marketing', 'Channel Marketing', 'Email'] },
          { label: 'WhatsApp Marketing', path: '/marketing/channel/whatsapp', icon: 'messageCircle', breadcrumb: ['Marketing', 'Channel Marketing', 'WhatsApp'] },
          { label: 'Social Publisher', path: '/marketing/channel/social', icon: 'share', breadcrumb: ['Marketing', 'Channel Marketing', 'Social'] },
        ],
      },
      { label: 'Coupon Management', path: '/marketing/coupons', icon: 'ticket', breadcrumb: ['Marketing', 'Coupon Management'] },
    ],
  },
  {
    title: 'Sales',
    icon: 'dollarSign',
    defaultOpen: false,
    items: [
      { label: 'Leads Pipeline', path: '/sales/pipeline', icon: 'pipeline', breadcrumb: ['Sales', 'Leads Pipeline'] },
      { label: 'Performance & Activity', path: '/sales/analytics', icon: 'analytics', breadcrumb: ['Sales', 'Performance & Activity'] },
    ],
  },
  {
    title: 'Commerce',
    icon: 'shoppingCart',
    defaultOpen: false,
    items: [
      { label: 'Products & Inventory', path: '/commerce/products', icon: 'package', breadcrumb: ['Commerce', 'Products & Inventory'] },
      { label: 'Orders Management', path: '/commerce/orders', icon: 'shoppingCart', breadcrumb: ['Commerce', 'Orders Management'] },
      { label: 'Financial Hub', path: '/commerce/financials', icon: 'dollarSign', breadcrumb: ['Commerce', 'Financial Hub'] },
    ],
  },
  {
    title: 'Support',
    icon: 'lifeBuoy',
    defaultOpen: false,
    items: [
      { label: 'Ticket Management', path: '/support/tickets', icon: 'ticket', breadcrumb: ['Support', 'Ticket Management'] },
      { label: 'Returns & Refunds', path: '/support/returns', icon: 'lifeBuoy', breadcrumb: ['Support', 'Returns & Refunds'] },
      { label: 'Multi-Channel Support', path: '/support/multi-channel', icon: 'messageSquare', breadcrumb: ['Support', 'Multi-Channel Support'] },
    ],
  },
  {
    title: 'Automation',
    icon: 'zap',
    defaultOpen: false,
    items: [
      { label: 'Workflow Builder', path: '/automation/workflows', icon: 'workflow', breadcrumb: ['Automation', 'Workflow Builder'] },
      { label: 'Marketing Automation', path: '/automation/marketing', icon: 'megaphone', breadcrumb: ['Automation', 'Marketing Automation'] },
      { label: 'Service Automation', path: '/automation/service', icon: 'lifeBuoy', breadcrumb: ['Automation', 'Service Automation'] },
    ],
  },
  {
    title: 'Settings',
    icon: 'settings',
    defaultOpen: false,
    items: [
      { label: 'Integrations', path: '/settings/integrations', icon: 'settings', breadcrumb: ['Settings', 'Integrations'] },
      { label: 'Admin & Security', path: '/settings/admin', icon: 'settings', breadcrumb: ['Settings', 'Admin & Security'] },
      { label: 'APIs & Webhooks', path: '/settings/api', icon: 'settings', breadcrumb: ['Settings', 'APIs & Webhooks'] },
    ],
  },
];

/* --- Sidebar width constraints --- */
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;
const COLLAPSED_WIDTH = 64;

const Sidebar: React.FC = () => {
  /* --- Redux state: open/collapsed & width --- */
  const { isSidebarOpen, sidebarWidth } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  /* --- Router location (used to highlight active items) --- */
  const location = useLocation();

  /* --- Track which groups are expanded --- */
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => navGroups.reduce<Record<string, boolean>>((acc, group) => { acc[group.title] = group.defaultOpen || false; return acc; }, {})
  );

  /* --- Track expanded nested menu items --- */
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  /* --- Drag-to-resize sidebar --- */
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  /* --- Begin resizing mouse drag --- */
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  /* --- Stop resize drag --- */
  const stopResizing = useCallback(() => setIsResizing(false), []);

  /* --- Handle drag movement to adjust width --- */
  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = mouseMoveEvent.clientX; // new width from X pos

      if (newWidth < 150) {
        if (isSidebarOpen) dispatch(setSidebarOpen(false)); // snap closed
        return;
      }

      if (!isSidebarOpen && newWidth > 150) dispatch(setSidebarOpen(true)); // reopen when dragged outward

      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) dispatch(setSidebarWidth(newWidth)); // apply width
    },
    [isResizing, isSidebarOpen, dispatch]
  );

  /* --- Attach global mouse events during resize --- */
  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, resize, stopResizing]);

  /* --- Auto-expand active group and item based on URL --- */
  useEffect(() => {
    let activeGroup = '';
    let activeParentItem = '';

    for (const group of navGroups) {
      for (const item of group.items) {
        if (item.path === location.pathname) {
          activeGroup = group.title;
          dispatch(setBreadcrumb(item.breadcrumb)); // set breadcrumb
          break;
        }

        if (item.subItems) {
          const activeSub = item.subItems.find(sub => sub.path === location.pathname);
          if (activeSub) {
            activeGroup = group.title;
            activeParentItem = item.label; // expand parent item
            dispatch(setBreadcrumb(activeSub.breadcrumb));
            break;
          }
        }
      }
      if (activeGroup) break;
    }

    if (activeGroup && !openGroups[activeGroup]) {
      setOpenGroups(
        Object.fromEntries(Object.keys(openGroups).map(g => [g, g === activeGroup]))
      );
    }

    if (activeParentItem) {
      setExpandedItems(prev => ({ ...prev, [activeParentItem]: true }));
    }
  }, [location.pathname]);

  /* --- Toggle main group open/close --- */
  const handleGroupToggle = (title: string) => {
    if (!isSidebarOpen) {
      dispatch(setSidebarOpen(true));
      setOpenGroups(Object.fromEntries(Object.keys(openGroups).map(g => [g, g === title])));
      return;
    }

    setOpenGroups(prev => {
      const isClosing = prev[title];
      if (isClosing) return { ...prev, [title]: false };

      return Object.fromEntries(Object.keys(prev).map(g => [g, g === title]));
    });
  };

  /* --- Toggle sub-item expansion --- */
  const handleItemExpand = (e: React.MouseEvent, label: string) => {
    e.preventDefault();

    if (!isSidebarOpen) {
      dispatch(setSidebarOpen(true));
      setExpandedItems(prev => ({ ...prev, [label]: true }));
      return;
    }

    setExpandedItems(prev => ({ ...prev, [label]: !prev[label] }));
  };

  /* --- Calculate actual width (collapsed → fixed small width) --- */
  const currentWidth = isSidebarOpen ? sidebarWidth : COLLAPSED_WIDTH;

  return (
    <>
      {/* --- Mobile overlay when sidebar open --- */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => dispatch(setSidebarOpen(false))}
      />

      {/* --- Sidebar container with animated width --- */}
      <motion.aside
        ref={sidebarRef as any}
        animate={{ width: currentWidth }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={cn(
          "flex flex-col z-40 fixed md:relative h-full bg-white dark:bg-[#09090b] flex-shrink-0 border-r border-gray-200 dark:border-zinc-800 shadow-xl md:shadow-none group/sidebar",
          isResizing && "transition-none"
        )}
      >

        {/* --- Drag Handle (resizer) --- */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors z-50 opacity-0 hover:opacity-100 group-hover/sidebar:opacity-50 active:bg-blue-600 active:opacity-100"
          onMouseDown={startResizing}
          title="Drag to resize"
        />

        {/* --- Sidebar Header: Logo --- */}
        <div
          className={cn(
            "p-5 flex items-center h-16 border-b border-gray-100 dark:border-zinc-800 overflow-hidden",
            isSidebarOpen ? "justify-start" : "justify-center"
          )}
        >
          <Icon name="sparkles" className="w-7 h-7 text-green-600 flex-shrink-0" />
          {isSidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-bold text-gray-900 dark:text-white ml-3 whitespace-nowrap"
            >
              EVA CRM
            </motion.span>
          )}
        </div>

        {/* --- Navigation Section --- */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-zinc-800">
          {navGroups.map(group => (
            <div key={group.title}>

              {/* --- Main Group Button --- */}
              <button
                onClick={() => handleGroupToggle(group.title)}
                title={isSidebarOpen ? '' : group.title}
                className={cn(
                  "w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group",
                  openGroups[group.title]
                    ? "text-gray-900 dark:text-white bg-gray-100/80 dark:bg-zinc-800/80"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50",
                  isSidebarOpen ? "justify-between" : "justify-center"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    name={group.icon as any}
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      openGroups[group.title] ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />
                  {isSidebarOpen && <span className="whitespace-nowrap">{group.title}</span>}
                </div>

                {isSidebarOpen && (
                  <Icon
                    name="chevronDown"
                    className={cn(
                      "w-4 h-4 text-gray-400 transition-transform",
                      openGroups[group.title] && "rotate-180"
                    )}
                  />
                )}
              </button>

              {/* --- Group Items (animated open/close) --- */}
              <AnimatePresence initial={false}>
                {isSidebarOpen && openGroups[group.title] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-0.5 pt-1 pb-2">

                      {/* --- Loop through items inside the group --- */}
                      {group.items.map(item => {
                        /* --- Nested items (has subItems) --- */
                        if (item.subItems) {
                          const isExpanded = expandedItems[item.label];
                          const isParentActive = item.subItems.some(sub => sub.path === location.pathname);

                          return (
                            <div key={item.label}>
                              <button
                                onClick={(e) => handleItemExpand(e, item.label)}
                                className={cn(
                                  "w-full flex items-center justify-between py-2 pr-3 pl-10 rounded-md text-sm transition-all group",
                                  isParentActive
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                                )}
                              >
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <Icon
                                    name={item.icon}
                                    className={cn(
                                      "w-4 h-4",
                                      isParentActive ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"
                                    )}
                                  />
                                  <span className="truncate">{item.label}</span>
                                </div>

                                <Icon
                                  name="chevronDown"
                                  className={cn(
                                    "w-3 h-3 transition-transform",
                                    isExpanded && "rotate-180"
                                  )}
                                />
                              </button>

                              {/* --- Render sub-items --- */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="space-y-0.5 mt-0.5 mb-1">
                                      {item.subItems.map(sub => {
                                        const isActive = location.pathname === sub.path;

                                        return (
                                          <Link
                                            key={sub.label}
                                            to={sub.path}
                                            className={cn(
                                              "group flex items-center gap-3 py-1.5 pr-3 pl-[3.25rem] rounded-r-md text-[13px] transition-all relative",
                                              isActive
                                                ? "text-green-700 dark:text-green-400 font-semibold bg-green-50/50 dark:bg-green-900/10"
                                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
                                            )}
                                          >
                                            {isActive && <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-green-500"></div>}

                                            <Icon
                                              name={sub.icon}
                                              className={cn(
                                                "w-3.5 h-3.5",
                                                isActive ? "text-green-600" : "text-gray-400 group-hover:text-gray-500"
                                              )}
                                            />

                                            <span className="truncate">{sub.label}</span>
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        }

                        /* --- Normal non-nested nav item --- */
                        const isActive = location.pathname === item.path;

                        return (
                          <Link
                            key={item.label}
                            to={item.path}
                            className={cn(
                              "flex items-center gap-3 py-2 pr-3 pl-10 rounded-md text-sm transition-all relative group",
                              isActive
                                ? "text-green-700 dark:text-green-400 font-semibold bg-green-50/50 dark:bg-green-900/10"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                            )}
                          >
                            {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-green-500"></div>}

                            <Icon
                              name={item.icon}
                              className={cn(
                                "w-4 h-4",
                                isActive ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"
                              )}
                            />

                            <span className="truncate">{item.label}</span>

                            {item.new && (
                              <span className="ml-auto text-[9px] font-bold bg-green-500 text-white rounded-full px-1.5 py-0.5">
                                NEW
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* --- Collapse/Expand Button at Bottom --- */}
        <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-[#09090b]">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800",
              isSidebarOpen ? "justify-start" : "justify-center"
            )}
          >
            <Icon name={isSidebarOpen ? "arrowLeft" : "chevronRight"} className="w-5 h-5" />
            {isSidebarOpen && <span>Collapse Sidebar</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
