import React from 'react';
import { Slider } from './slider';
import { Label } from './label';
import { Input } from './input';
import { cn } from '@/lib/utils';

export interface ParameterSliderProps {
  label: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  className?: string;
  showInput?: boolean;
}

export const ParameterSlider: React.FC<ParameterSliderProps> = ({
  label,
  description,
  value,
  onChange,
  min,
  max,
  step,
  className,
  showInput = true
}) => {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-sm font-medium">{label}</Label>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {showInput && (
          <Input
            type="number"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            className="w-20 h-8 text-center"
          />
        )}
      </div>
      
      <Slider
        value={[value]}
        onValueChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};