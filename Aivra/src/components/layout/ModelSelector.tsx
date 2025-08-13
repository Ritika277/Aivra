import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown, Cpu } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAI, type AIModel } from '@/contexts/AIContext';
import { cn } from '@/lib/utils';

export const ModelSelector: React.FC = () => {
  const { models, selectedModel, setSelectedModel } = useAI();

  const handleModelChange = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (model) {
      setSelectedModel(model);
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'anthropic': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'custom': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="ai-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Model Selection</CardTitle>
          </div>
          <CardDescription>
            Choose your AI model for optimal performance
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Select
            value={selectedModel?.id || ''}
            onValueChange={handleModelChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{model.name}</span>
                    <Badge variant="outline" className={getProviderColor(model.provider)}>
                      {model.provider}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedModel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-lg bg-muted/50 border border-border/50"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{selectedModel.name}</span>
                  <Badge className={getProviderColor(selectedModel.provider)}>
                    {selectedModel.provider}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {selectedModel.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Max Tokens: {selectedModel.maxTokens.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};