import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, X, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAI, type AITemplate } from '@/contexts/AIContext';
import { cn } from '@/lib/utils';

export const TemplateSelector: React.FC = () => {
  const { templates, selectedTemplate, setSelectedTemplate, setCurrentPrompt } = useAI();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: AITemplate) => {
    setSelectedTemplate(template);
    setCurrentPrompt(template.prompt);
  };

  const handleTemplateDeselect = () => {
    setSelectedTemplate(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'creative': return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      case 'development': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'education': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'analytics': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="ai-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Prompt Templates</CardTitle>
            </div>
            {selectedTemplate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTemplateDeselect}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <CardDescription>
            Choose from pre-built prompts or create your own
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {selectedTemplate ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-lg bg-primary/5 border border-primary/20"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{selectedTemplate.name}</h4>
                  <Badge className={getCategoryColor(selectedTemplate.category)}>
                    {selectedTemplate.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedTemplate.description}
                </p>
                <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border">
                  {selectedTemplate.prompt}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="Creative">Creative</TabsTrigger>
                  <TabsTrigger value="Development">Dev</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="max-h-64 overflow-y-auto space-y-2">
                <AnimatePresence>
                  {filteredTemplates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 rounded-lg border border-border/50 hover:border-primary/30 cursor-pointer transition-all hover:shadow-sm"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 min-w-0 flex-1">
                          <h5 className="text-sm font-medium truncate">{template.name}</h5>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {template.description}
                          </p>
                        </div>
                        <Badge className={cn("text-xs", getCategoryColor(template.category))}>
                          {template.category}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};