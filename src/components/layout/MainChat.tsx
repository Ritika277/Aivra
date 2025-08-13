import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, MessageSquare, Download } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Textarea } from '@/components/ui/textarea';
import { ChatBubble } from '@/components/ui/chat-bubble';
import { useAI } from '@/contexts/AIContext';
import { useToast } from '@/hooks/use-toast';

export const MainChat: React.FC = () => {
  const { 
    messages, 
    addMessage, 
    selectedModel, 
    parameters,
    isLoading,
    setIsLoading,
    clearMessages
  } = useAI();
  
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;
    if (!selectedModel) {
      toast({
        title: "No model selected",
        description: "Please select an AI model first.",
        variant: "destructive",
      });
      return;
    }

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message
    addMessage({
      type: 'user',
      content: userMessage
    });

    setIsLoading(true);
    
    // Simulate AI response
    try {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const responses = [
        "I understand your request. Let me provide a comprehensive response to help you with this task.",
        "That's an interesting question! Here's my analysis of the situation and some recommendations.",
        "Based on the parameters you've set and the context provided, here's what I would suggest:",
        "I can help you with that. Let me break this down into manageable parts and provide detailed guidance.",
        "Great question! This requires a multi-faceted approach. Let me explain the key considerations."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      addMessage({
        type: 'assistant',
        content: randomResponse + "\n\nThis is a simulated response for demonstration purposes. In a real implementation, this would connect to your chosen AI model API.",
        model: selectedModel.name,
        parameters: parameters
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const downloadChatHistory = () => {
    if (messages.length === 0) {
      toast({
        title: "No messages to download",
        description: "Start a conversation first!",
        variant: "destructive",
      });
      return;
    }

    const chatData = {
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        model: msg.model,
        parameters: msg.parameters
      }))
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      description: "Chat history downloaded successfully",
      duration: 2000,
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Chat Header */}
      {messages.length > 0 && (
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="font-medium">Chat ({messages.length} messages)</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadChatHistory}
              className="text-muted-foreground hover:text-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center h-full"
          >
            <div className="text-center max-w-md mx-auto px-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-ai flex items-center justify-center mb-6">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Start a conversation</h2>
              <p className="text-muted-foreground mb-6">
                Choose an AI model and begin chatting. Your conversation will appear here.
              </p>
              {!selectedModel && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  ⚠️ Please select a model from the sidebar to get started
                </p>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-6">
            <AnimatePresence>
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  type={message.type}
                  content={message.content}
                  timestamp={message.timestamp}
                  model={message.model}
                />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder={
                selectedModel 
                  ? "Type your message... (Enter to send, Shift+Enter for new line)"
                  : "Please select a model first..."
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || !selectedModel}
              className="min-h-[60px] max-h-[200px] resize-none pr-12 focus:ring-2 focus:ring-primary"
              rows={1}
            />
            
            <Button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || !selectedModel || isLoading}
              size="sm"
              className="absolute right-2 bottom-2 h-8 w-8 p-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              {selectedModel && (
                <span>Model: {selectedModel.name}</span>
              )}
              <span>{inputValue.length} characters</span>
            </div>
            <span>Enter to send • Shift+Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
};