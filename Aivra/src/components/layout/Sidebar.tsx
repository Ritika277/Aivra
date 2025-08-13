import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { ModelSelector } from './ModelSelector';
import { TemplateSelector } from './TemplateSelector';
import { ParametersPanel } from './ParametersPanel';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
          
          {/* Sidebar */}
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "fixed lg:relative left-0 top-0 h-full w-80 z-50",
              "bg-sidebar border-r border-border",
              "flex flex-col overflow-hidden"
            )}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
              <h2 className="text-lg font-semibold">AI Settings</h2>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <ModelSelector />
              <TemplateSelector />
              <ParametersPanel />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};