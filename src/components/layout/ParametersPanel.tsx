import React from 'react';
import { motion } from 'framer-motion';
import { Settings, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { ParameterSlider } from '@/components/ui/parameter-slider';
import { useAI } from '@/contexts/AIContext';

export const ParametersPanel: React.FC = () => {
  const { parameters, updateParameters, selectedModel } = useAI();

  const resetToDefaults = () => {
    updateParameters({
      temperature: 0.7,
      maxTokens: 1000,
      topP: 1.0,
      frequencyPenalty: 0,
      presencePenalty: 0
    });
  };

  const maxTokensLimit = selectedModel?.maxTokens || 4096;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="ai-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Parameters</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToDefaults}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          <CardDescription>
            Fine-tune the AI model's behavior
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <ParameterSlider
            label="Temperature"
            description="Controls randomness (0 = focused, 1 = creative)"
            value={parameters.temperature}
            onChange={(value) => updateParameters({ temperature: value })}
            min={0}
            max={1}
            step={0.1}
          />

          <ParameterSlider
            label="Max Tokens"
            description={`Maximum response length (max: ${maxTokensLimit.toLocaleString()})`}
            value={parameters.maxTokens}
            onChange={(value) => updateParameters({ maxTokens: value })}
            min={50}
            max={Math.min(maxTokensLimit, 4000)}
            step={50}
          />

          <ParameterSlider
            label="Top P"
            description="Controls diversity of word selection"
            value={parameters.topP}
            onChange={(value) => updateParameters({ topP: value })}
            min={0}
            max={1}
            step={0.05}
          />

          <ParameterSlider
            label="Frequency Penalty"
            description="Reduces repetition of frequent tokens"
            value={parameters.frequencyPenalty}
            onChange={(value) => updateParameters({ frequencyPenalty: value })}
            min={-2}
            max={2}
            step={0.1}
          />

          <ParameterSlider
            label="Presence Penalty"
            description="Encourages talking about new topics"
            value={parameters.presencePenalty}
            onChange={(value) => updateParameters({ presencePenalty: value })}
            min={-2}
            max={2}
            step={0.1}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};