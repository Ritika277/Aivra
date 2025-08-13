import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, Bot, User } from 'lucide-react';
import { Button } from './enhanced-button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export interface ChatBubbleProps {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
  onCopy?: (content: string) => void;
  onDownload?: (content: string) => void;
  className?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  type,
  content,
  timestamp,
  model,
  onCopy,
  onDownload,
  className
}) => {
  const { toast } = useToast();
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      description: "Message copied to clipboard",
      duration: 2000,
    });
    onCopy?.(content);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-message-${timestamp.getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onDownload?.(content);
  };

  const isUser = type === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group flex gap-3 py-4",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-ai flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] space-y-2",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "relative px-4 py-3 rounded-2xl shadow-elegant",
            isUser
              ? "bg-primary text-primary-foreground ml-auto"
              : "ai-card text-card-foreground"
          )}
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {content}
          </div>
          
          {!isUser && model && (
            <div className="mt-2 pt-2 border-t border-border/30">
              <span className="text-xs text-muted-foreground">{model}</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity",
          isUser ? "justify-end" : "justify-start"
        )}>
          <span className="text-xs text-muted-foreground">
            {timestamp.toLocaleTimeString()}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-6 w-6 p-0 hover:bg-accent"
          >
            <Copy className="w-3 h-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-6 w-6 p-0 hover:bg-accent"
          >
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </motion.div>
  );
};