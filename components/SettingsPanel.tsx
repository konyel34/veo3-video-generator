
import React from 'react';
import { type AspectRatio } from '../types';

interface SettingsPanelProps {
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  disabled: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ aspectRatio, setAspectRatio, disabled }) => {
  const aspectRatios: AspectRatio[] = ['16:9', '9:16'];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-content-200 mb-2">Aspect Ratio</label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-base-300 rounded-lg">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              disabled={disabled}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-primary ${
                aspectRatio === ratio
                  ? 'bg-brand-primary text-white shadow'
                  : 'text-content-100 hover:bg-base-100'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>
       {/* NOTE: Sound and Resolution are not currently supported by the VEO API.
           UI elements are omitted to avoid user confusion. */}
    </div>
  );
};

export default SettingsPanel;
