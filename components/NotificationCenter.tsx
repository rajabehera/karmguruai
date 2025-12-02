
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Info, AlertTriangle, XCircle, CheckCircle, X } from 'lucide-react';
import { User, Notification, View } from '../types';
import { api } from '../services/api';

interface NotificationCenterProps {
  user: User;
  onNavigate: (view: View) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ user, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const notifications = user.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    await api.user.markAllNotificationsRead(user.email);
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await api.user.markNotificationRead(user.email, notification.id);
    }
    if (notification.link) {
      onNavigate(notification.link);
      setIsOpen(false);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'ERROR': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-white/20 transition-colors"
      >
        <Bell className="w-6 h-6 text-karm-dark" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-karm-sage overflow-hidden z-50 animate-fade-in origin-top-right">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-karm-dark flex items-center gap-2">
              Notifications {unreadCount > 0 && <span className="bg-karm-gold text-white px-2 py-0.5 rounded-full text-xs">{unreadCount} new</span>}
            </h3>
            <div className="flex gap-2">
               {unreadCount > 0 && (
                 <button onClick={handleMarkAllRead} className="text-xs text-karm-gold hover:text-karm-dark font-bold hover:underline">
                   Mark all read
                 </button>
               )}
               <button onClick={() => setIsOpen(false)}><X className="w-4 h-4 text-gray-400 hover:text-gray-600" /></button>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                <Bell className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className={`text-sm font-bold ${!notif.read ? 'text-karm-dark' : 'text-gray-600'}`}>{notif.title}</h4>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notif.message}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-[10px] text-gray-400">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {notif.link && (
                          <span className="text-[10px] font-bold text-karm-gold uppercase">View</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
