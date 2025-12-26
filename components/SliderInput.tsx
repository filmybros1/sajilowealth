
import React from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (val: number) => void;
  prefix?: string;
}

const SliderInput: React.FC<SliderInputProps> = ({ label, value, min, max, step, unit, onChange, prefix }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value.replace(/[^0-9.]/g, ''));
    if (!isNaN(val)) {
      onChange(val);
    }
  };

  return (
    <div className="group">
      <div className="flex justify-between items-center mb-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-800 transition-colors">
          {label}
        </label>
        {/* Removed all shadows, using flat border and background */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-emerald-500 focus-within:bg-white transition-all shadow-none">
          {prefix && <span className="pl-3 text-xs font-bold text-slate-400">{prefix}</span>}
          <input 
            type="text" 
            value={value} 
            onChange={handleInputChange}
            className="w-20 sm:w-28 px-2 py-2 text-sm font-bold text-slate-800 outline-none text-right bg-transparent shadow-none"
          />
          {unit && <span className="pr-3 text-xs font-bold text-slate-400">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer accent-emerald-500"
      />
      <div className="flex justify-between mt-2">
        <span className="text-[10px] font-medium text-slate-400">{prefix}{min.toLocaleString()}{unit}</span>
        <span className="text-[10px] font-medium text-slate-400">{prefix}{max.toLocaleString()}{unit}</span>
      </div>
    </div>
  );
};

export default SliderInput;
