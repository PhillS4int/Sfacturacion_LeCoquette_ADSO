import React from 'react';

interface Props {
  label: string;
  description?: string;
  icon?: React.ElementType;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function ToggleRow({
  label,
  description,
  icon: Icon,
  checked,
  onChange,
}: Props) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <Icon className="w-4 h-4 text-gray-500" />
          </div>
        )}
        <div>
          <p className="text-sm text-gray-800">{label}</p>
          {description && <p className="text-xs text-gray-400">{description}</p>}
        </div>
      </div>

      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
      />
    </div>
  );
}