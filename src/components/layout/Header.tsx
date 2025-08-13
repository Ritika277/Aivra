import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Menu, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/enhanced-button';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/80 sticky top-0 z-30"
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-ai flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-ai-accent">
                  AI Chat
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Intelligent Conversation Interface
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-4 h-4 mr-2" />
              {sidebarOpen ? 'Hide' : 'Show'} Panel
            </Button>
            
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  );
};