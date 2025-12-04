/* Layout.tsx — Global layout wrapper: sidebar, top navbar, and page content */

import React from 'react';
import Sidebar from './Sidebar';
import TopNavBar from './TopNavBar';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode; // rendered page
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-white dark:bg-[#09090b] text-gray-800 dark:text-dark-text overflow-hidden">
      
      {/* --- Sidebar Section --- */}
      <Sidebar />

      {/* --- Main Panel --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        
        {/* --- Top Navigation Bar --- */}
        <TopNavBar />

        {/* --- Page Content Area --- */}
        <main
          className="
            flex-1 overflow-y-auto overflow-x-hidden
            bg-gray-50 dark:bg-black
            p-4 sm:p-6
            rounded-tl-3xl
            border-t border-l border-green-500 dark:border-green-500/30
            transition-all duration-300
          "
        >
          {/* --- Content Wrapper + Page Animation --- */}
          <div className="max-w-[1600px] mx-auto h-full">
            <motion.div
              initial={{ opacity: 0, y: 15 }}  // page enter animation
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </div>
          
        </main>
      </div>
    </div>
  );
};

export default Layout;
