import React, { createContext, useContext, useState, useCallback } from 'react';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  provider: string;
}

export interface AITemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
  parameters?: AIParameters;
}

export interface AIParameters {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

interface AIContextType {
  // Models
  models: AIModel[];
  selectedModel: AIModel | null;
  setSelectedModel: (model: AIModel) => void;
  
  // Templates
  templates: AITemplate[];
  selectedTemplate: AITemplate | null;
  setSelectedTemplate: (template: AITemplate | null) => void;
  
  // Chat
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  
  // Parameters
  parameters: AIParameters;
  updateParameters: (params: Partial<AIParameters>) => void;
  
  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Current prompt
  currentPrompt: string;
  setCurrentPrompt: (prompt: string) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

// Mock data
const mockModels: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model, great for complex tasks',
    maxTokens: 8192,
    provider: 'OpenAI'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for most tasks',
    maxTokens: 4096,
    provider: 'OpenAI'
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    description: 'Advanced reasoning and analysis',
    maxTokens: 100000,
    provider: 'Anthropic'
  },
  {
    id: 'custom-model',
    name: 'Custom Model',
    description: 'Your fine-tuned model',
    maxTokens: 2048,
    provider: 'Custom'
  }
];

const mockTemplates: AITemplate[] = [
  {
    id: 'creative-writing',
    name: 'Creative Writing',
    description: 'Generate creative content and stories',
    prompt: 'Write a creative and engaging story about',
    category: 'Creative'
  },
  {
    id: 'code-review',
    name: 'Code Review',
    description: 'Review and analyze code',
    prompt: 'Please review the following code and provide feedback on:\n1. Code quality\n2. Performance\n3. Best practices\n4. Potential improvements\n\nCode:',
    category: 'Development'
  },
  {
    id: 'explain-concept',
    name: 'Explain Concept',
    description: 'Explain complex concepts simply',
    prompt: 'Explain the following concept in simple terms, with examples:',
    category: 'Education'
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Analyze data and provide insights',
    prompt: 'Analyze the following data and provide key insights, trends, and recommendations:',
    category: 'Analytics'
  },
  {
    id: 'brainstorm',
    name: 'Brainstorming',
    description: 'Generate ideas and solutions',
    prompt: 'Help me brainstorm creative ideas for:',
    category: 'Creative'
  }
];

interface AIProviderProps {
  children: React.ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [models] = useState<AIModel[]>(mockModels);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(mockModels[0]);
  const [templates] = useState<AITemplate[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<AITemplate | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  
  const [parameters, setParameters] = useState<AIParameters>({
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1.0,
    frequencyPenalty: 0,
    presencePenalty: 0
  });

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const updateParameters = useCallback((params: Partial<AIParameters>) => {
    setParameters(prev => ({ ...prev, ...params }));
  }, []);

  return (
    <AIContext.Provider value={{
      models,
      selectedModel,
      setSelectedModel,
      templates,
      selectedTemplate,
      setSelectedTemplate,
      messages,
      addMessage,
      clearMessages,
      parameters,
      updateParameters,
      isLoading,
      setIsLoading,
      currentPrompt,
      setCurrentPrompt
    }}>
      {children}
    </AIContext.Provider>
  );
};