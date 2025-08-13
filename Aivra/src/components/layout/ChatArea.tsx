import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { ChatBubble } from '@/components/ui/chat-bubble';
import { useAI } from '@/contexts/AIContext';
import { useToast } from '@/hooks/use-toast';

export const ChatArea: React.FC = () => {
  const { messages, clearMessages } = useAI();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    <div className="flex flex-col h-full">
      <Card className="ai-card flex-1 flex flex-col">
        <CardHeader className="pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Conversation</CardTitle>
            </div>
            
            {messages.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadChatHistory}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto space-y-1 pr-2">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center h-full text-center"
              >
                <div className="max-w-md space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-ai flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                    <p className="text-muted-foreground">
                      Type your message in the prompt editor below to begin chatting with the AI.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
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
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};