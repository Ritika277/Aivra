import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Save, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Textarea } from '@/components/ui/textarea';
import { useAI } from '@/contexts/AIContext';
import { useToast } from '@/hooks/use-toast';

export const PromptEditor: React.FC = () => {
  const { 
    currentPrompt, 
    setCurrentPrompt, 
    addMessage, 
    selectedModel, 
    parameters,
    isLoading,
    setIsLoading
  } = useAI();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!currentPrompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a message to send.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedModel) {
      toast({
        title: "No model selected",
        description: "Please select an AI model first.",
        variant: "destructive",
      });
      return;
    }

    // Add user message
    addMessage({
      type: 'user',
      content: currentPrompt
    });

    setIsLoading(true);
    
    // Simulate AI response
    try {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Mock AI response
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
      setCurrentPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const saveTemplate = () => {
    if (!currentPrompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Enter a prompt to save as template.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would save to backend
    toast({
      description: "Template saved successfully!",
      duration: 2000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="ai-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Prompt Editor</CardTitle>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={saveTemplate}
                disabled={!currentPrompt.trim()}
                className="text-muted-foreground hover:text-foreground"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Enter your prompt here... (Ctrl/Cmd + Enter to send)"
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[120px] resize-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{currentPrompt.length} characters</span>
              <span>Ctrl/Cmd + Enter to send</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSubmit}
              disabled={!currentPrompt.trim() || !selectedModel || isLoading}
              className="flex-1"
              variant="ai"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>

          {selectedModel && (
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Using:</span>
                <span className="font-medium">{selectedModel.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                <span>Temperature: {parameters.temperature}</span>
                <span>Max Tokens: {parameters.maxTokens}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};