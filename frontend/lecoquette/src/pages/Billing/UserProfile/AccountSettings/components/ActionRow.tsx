import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ActionRowProps {
  label: string;
  description?: string;
  icon?: React.ElementType;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export function ActionRow({
  label,
  description,
  icon: Icon,
  onClick,
  variant = 'default',
}: ActionRowProps) {
  const isDanger = variant === 'danger';

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-6 px-6 transition-colors"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDanger ? 'bg-red-50' : 'bg-gray-100'
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isDanger ? 'text-red-500' : 'text-gray-500'
              }`}
            />
          </div>
        )}

        <div className="text-left">
          <p
            className={`text-sm ${
              isDanger ? 'text-red-600' : 'text-gray-800'
            }`}
          >
            {label}
          </p>
          {description && (
            <p className="text-xs text-gray-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      <ChevronRight
        className={`w-4 h-4 ${
          isDanger ? 'text-red-400' : 'text-gray-400'
        }`}
      />
    </button>
  );
}