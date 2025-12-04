
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleSidebar } from '../../store/uiSlice';
import type { RootState } from '../../store/store';
import { Icon } from '../shared/Icon';
import { ThemeToggle } from '../ui/ThemeToggle';
import type { Notification } from '../../types';
import { timeAgo } from '../../lib/utils';

// Mock data simulating DB response
const mockNotificationsData: Notification[] = [
    {
        id: '1',
        title: 'New Order Received',
        message: 'Order #ORD-1024 from Sarah Johnson',
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
        isRead: false,
        type: 'success',
        link: '/commerce/orders'
    },
    {
        id: '2',
        title: 'Low Stock Alert',
        message: 'Wireless Headphones are running low (5 items left).',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(), // 1.5 hours ago
        isRead: false,
        type: 'warning',
        link: '/commerce/products'
    },
    {
        id: '3',
        title: 'Ticket Assigned',
        message: 'Ticket #TKT-209 assigned to you by Admin.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        isRead: true,
        type: 'info',
        link: '/support/tickets'
    },
    {
        id: '4',
        title: 'Payment Failed',
        message: 'Payment for Invoice #INV-2024-002 failed.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        isRead: true,
        type: 'error',
        link: '/commerce/financials'
    }
];

const TopNavBar: React.FC = () => {
  const { breadcrumb } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  
  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Simulate API Fetch on Mount
  useEffect(() => {
      const fetchNotifications = async () => {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          setNotifications(mockNotificationsData);
          setIsLoading(false);
      };
      fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    if (isNotificationsOpen || isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen, isProfileOpen]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
      if (!notification.isRead) {
          setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
      }
      setNotificationsOpen(false);
      if (notification.link) {
          navigate(notification.link);
      }
  };

  const getNotificationIcon = (type: Notification['type']) => {
      switch (type) {
          case 'success': return <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600"><Icon name="checkCircle" className="w-4 h-4" /></div>;
          case 'warning': return <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full text-yellow-600"><Icon name="alertTriangle" className="w-4 h-4" /></div>;
          case 'error': return <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full text-red-600"><Icon name="alertCircle" className="w-4 h-4" /></div>;
          default: return <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600"><Icon name="bell" className="w-4 h-4" /></div>;
      }
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setProfileOpen(false);
    navigate('/settings');
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 flex-shrink-0 z-10 bg-white dark:bg-[#09090b] transition-colors duration-300">
      {/* Left Section */}
      <div className="flex items-center gap-4">
         <button onClick={() => dispatch(toggleSidebar())} className="md:hidden text-gray-500 dark:text-gray-400">
           <Icon name="menu" className="w-6 h-6" />
         </button>
        <div className="text-sm font-medium text-gray-500 dark:text-dark-muted">
          {breadcrumb.join(' / ')}
        </div>
      </div>

      {/* Center Section */}
      <div className="hidden md:block">
        <div className="relative">
          <Icon name="search" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers, orders, products..."
            className="w-full max-w-sm lg:w-[400px] bg-gray-50 dark:bg-dark-surface border border-gray-300 dark:border-dark-border rounded-md py-2 pl-10 pr-4 text-sm focus:ring-green-500 focus:border-green-500 dark:text-gray-200 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/* Notification Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setNotificationsOpen(!isNotificationsOpen)} 
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            <Icon name="bell" className="w-5 h-5" />
            {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-dark-surface rounded-lg shadow-xl border border-gray-200 dark:border-dark-border overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b dark:border-dark-border flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm dark:text-gray-200">Notifications</h3>
                    {unreadCount > 0 && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                </div>
                {unreadCount > 0 && (
                    <button onClick={handleMarkAllAsRead} className="text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium transition-colors">
                        Mark all as read
                    </button>
                )}
              </div>
              
              <div className="max-h-[400px] overflow-y-auto">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        <Icon name="refreshCw" className="w-6 h-6 mx-auto animate-spin mb-2 opacity-50"/>
                        <p className="text-xs">Loading...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        <p className="text-sm">No notifications yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                        {notifications.map(notification => (
                            <div 
                                key={notification.id} 
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-4 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors flex gap-3 ${!notification.isRead ? 'bg-green-50/30 dark:bg-green-900/10' : ''}`}
                            >
                                <div className="flex-shrink-0 mt-1">
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900 dark:text-gray-100' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                                            {notification.title}
                                        </p>
                                        {!notification.isRead && (
                                            <span className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5 ml-2"></span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-1.5">
                                        {notification.message}
                                    </p>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                                        {timeAgo(notification.timestamp)}
                                    </p>
                                </div>
                                {!notification.isRead && (
                                    <div className="self-center ml-2">
                                        <button 
                                            onClick={(e) => handleMarkAsRead(e, notification.id)}
                                            className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                            title="Mark as read"
                                        >
                                            <Icon name="check" className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
              </div>
              
              <div className="p-2 text-center border-t dark:border-dark-border bg-gray-50/50 dark:bg-white/5">
                <a href="#" className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    View all notifications
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200 dark:bg-dark-border mx-1"></div>

        <div className="relative" ref={profileRef}>
          <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-1.5 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center font-bold text-white shadow-sm">
              JD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold dark:text-gray-200 leading-none">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Admin</p>
            </div>
            <Icon name="chevronDown" className="w-4 h-4 text-gray-500 dark:text-gray-400 hidden lg:block" />
          </button>
          {isProfileOpen && (
             <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-surface rounded-lg shadow-xl border border-gray-200 dark:border-dark-border overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b dark:border-dark-border bg-gray-50/50 dark:bg-white/5">
                <p className="font-semibold text-sm dark:text-gray-200">John Doe</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">john.doe@example.com</p>
              </div>
              <div className="p-1">
                <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-white/5 dark:text-gray-300 transition-colors"><Icon name="user" className="w-4 h-4"/> My Profile</a>
                <button onClick={handleSettingsClick} className="flex w-full items-center gap-3 px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-white/5 dark:text-gray-300 transition-colors"><Icon name="settings" className="w-4 h-4"/> Settings</button>
              </div>
              <div className="p-1 border-t dark:border-dark-border">
                <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Icon name="logout" className="w-4 h-4"/> Logout</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
