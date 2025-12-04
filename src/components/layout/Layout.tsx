
import React from 'react';
import Sidebar from './Sidebar';
import TopNavBar from './TopNavBar';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-white dark:bg-[#09090b] text-gray-800 dark:text-dark-text transition-colors duration-300 overflow-hidden">
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300 min-w-0">
        <TopNavBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-black p-4 sm:p-6 transition-all duration-300 rounded-tl-3xl border-t border-l border-green-500 dark:border-green-500/30">
          <div className="max-w-[1600px] mx-auto h-full">
            <motion.div
                {...({
                    initial: { opacity: 0, y: 15 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.4, ease: "easeOut" }
                } as any)}
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
