/* TopNavBar.tsx — Global top header: search, theme, notifications, profile */

import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleSidebar } from '../../store/uiSlice';
import type { RootState } from '../../store/store';
import { Icon } from '../shared/icon';
import { ThemeToggle } from '../ui/ThemeToggle';
import type { Notification } from '../../types';
import { timeAgo } from '../../lib/utils';

/* --- Mock notifications (replace with API later) --- */
const mockNotificationsData: Notification[] = [
  { id: '1', title: 'New Order Received', message: 'Order #ORD-1024 from Sarah Johnson', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), isRead: false, type: 'success', link: '/commerce/orders' },
  { id: '2', title: 'Low Stock Alert', message: 'Wireless Headphones are running low (5 items left).', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(), isRead: false, type: 'warning', link: '/commerce/products' },
  { id: '3', title: 'Ticket Assigned', message: 'Ticket #TKT-209 assigned to you.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), isRead: true, type: 'info', link: '/support/tickets' },
  { id: '4', title: 'Payment Failed', message: 'Invoice #INV-2024-002 payment failed.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), isRead: true, type: 'error', link: '/commerce/financials' },
];

const TopNavBar: React.FC = () => {
  /* --- Global UI state --- */
  const { breadcrumb } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* --- Dropdown states --- */
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  /* --- Notification local state (later replace with API) --- */
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* --- Refs for click-outside handling --- */
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  /* --- Fake API fetch on mount --- */
  useEffect(() => {
    const load = async () => {
      await new Promise(r => setTimeout(r, 1000)); // simulate network delay
      setNotifications(mockNotificationsData);
      setIsLoading(false);
    };
    load();
  }, []);

  /* --- Close dropdowns when clicking outside --- */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) setNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    if (isNotificationsOpen || isProfileOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isNotificationsOpen, isProfileOpen]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  /* --- Notification handlers --- */
  const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };
  const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  const onNotificationClick = (n: Notification) => {
    if (!n.isRead) setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, isRead: true } : x));
    setNotificationsOpen(false);
    if (n.link) navigate(n.link);
  };

  /* --- Notification type → icon --- */
  const notificationIcon = (type: Notification['type']) => {
    const wrap = (color: string, icon: string) => (
      <div className={`p-2 rounded-full ${color}`}>
        <Icon name={icon as any} className="w-4 h-4" />
      </div>
    );
    return {
      success: wrap('bg-green-100 dark:bg-green-900/30 text-green-600', 'checkCircle'),
      warning: wrap('bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600', 'alertTriangle'),
      error: wrap('bg-red-100 dark:bg-red-900/30 text-red-600', 'alertCircle'),
      info: wrap('bg-blue-100 dark:bg-blue-900/30 text-blue-600', 'bell'),
    }[type];
  };

  const goSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    setProfileOpen(false);
    navigate('/settings');
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-[#09090b] transition-colors z-10">
      
      {/* --- Left: Sidebar toggle + Breadcrumb --- */}
      <div className="flex items-center gap-4">
        <button onClick={() => dispatch(toggleSidebar())} className="md:hidden text-gray-500 dark:text-gray-400">
          <Icon name="menu" className="w-6 h-6" />
        </button>
        <div className="text-sm font-medium text-gray-500 dark:text-dark-muted">
          {breadcrumb.join(' / ')}
        </div>
      </div>

      {/* --- Center: Search Bar --- */}
      <div className="hidden md:block">
        <div className="relative">
          <Icon name="search" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers, orders, products..."
            className="max-w-sm lg:w-[400px] bg-gray-50 dark:bg-dark-surface border border-gray-300 dark:border-dark-border rounded-md py-2 pl-10 pr-4 text-sm focus:ring-green-500 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* --- Right: Theme, Notifications, Profile --- */}
      <div className="flex items-center gap-4">
        
        <ThemeToggle />

        {/* --- Notification Bell --- */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!isNotificationsOpen)}
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            <Icon name="bell" className="w-5 h-5" />
            {/* unread pulse */}
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            )}
          </button>

          {/* --- Notification Dropdown --- */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-dark-surface border dark:border-dark-border rounded-lg shadow-xl z-50 animate-in slide-in-from-top-2">
              
              {/* Header */}
              <div className="p-3 border-b dark:border-dark-border flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm dark:text-gray-200">Notifications</h3>
                  {unreadCount > 0 && <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-green-600 dark:text-green-400 hover:text-green-700">
                    Mark all as read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-[400px] overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Icon name="refreshCw" className="w-6 h-6 mx-auto animate-spin mb-2 opacity-50" />
                    <p className="text-xs">Loading...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">No notifications yet.</div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => onNotificationClick(n)}
                        className={`p-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer ${!n.isRead ? 'bg-green-50/30 dark:bg-green-900/10' : ''}`}
                      >
                        <div className="flex-shrink-0 mt-1">{notificationIcon(n.type)}</div>

                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start">
                            <p className={`text-sm ${!n.isRead ? 'font-semibold' : 'font-medium'} dark:text-gray-100`}>
                              {n.title}
                            </p>
                            {!n.isRead && <span className="h-2 w-2 bg-green-500 rounded-full"></span>}
                          </div>

                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-1.5">{n.message}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">{timeAgo(n.timestamp)}</p>
                        </div>

                        {!n.isRead && (
                          <button
                            onClick={(e) => handleMarkAsRead(e, n.id)}
                            className="self-center text-gray-400 hover:text-green-600 dark:hover:text-green-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
                            title="Mark read"
                          >
                            <Icon name="check" className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-2 text-center border-t dark:border-dark-border bg-gray-50/50 dark:bg-white/5">
                <a className="text-xs text-gray-600 dark:text-gray-400 hover:text-green-600">View all</a>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200 dark:bg-dark-border"></div>

        {/* --- Profile --- */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-1.5 rounded-lg"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-bold">
              JD
            </div>

            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold dark:text-gray-200">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
            </div>

            <Icon name="chevronDown" className="w-4 h-4 text-gray-500 dark:text-gray-400 hidden lg:block" />
          </button>

          {/* Profile dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-dark-surface border dark:border-dark-border rounded-lg shadow-xl z-50 dropdown-animate">

              <div className="p-1">
        
                <button onClick={goSettings} className="flex items-center gap-3 px-4 py-2 text-sm w-full hover:bg-gray-100 dark:hover:bg-white/5"><Icon name="settings" className="w-4 h-4" />Settings</button>
              </div>

              <div className="p-1 border-t dark:border-dark-border">
                <a className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Icon name="logout" className="w-4 h-4" />Logout
                </a>
              </div>

            </div>
          )}
        </div>
      </div>

    </header>
  );
};

export default TopNavBar;
