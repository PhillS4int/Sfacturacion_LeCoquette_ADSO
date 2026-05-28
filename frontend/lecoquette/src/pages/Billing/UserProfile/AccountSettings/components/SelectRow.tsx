import React from 'react';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SelectRowProps<T extends string> {
  label: string;
  icon?: React.ElementType;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
}

export function SelectRow<T extends string>({
  label,
  icon: Icon,
  value,
  options,
  onChange,
}: SelectRowProps<T>) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <Icon className="w-4 h-4 text-gray-500" />
          </div>
        )}
        <p className="text-sm text-gray-800">{label}</p>
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="text-sm text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}