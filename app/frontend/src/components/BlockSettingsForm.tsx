import React from 'react';
import { blockDefinitions } from './BlockDefinitions';
import type { BotBlockType } from './BlockDefinitions';
import { commonStyles } from '../styles';

interface BlockSettingsFormProps {
  type: BotBlockType;
  settings: Record<string, any>;
  onChange: (settings: Record<string, any>) => void;
}

export const BlockSettingsForm: React.FC<BlockSettingsFormProps> = ({ type, settings, onChange }) => {
  const definition = blockDefinitions[type];

  const handleChange = (key: string, value: string) => {
    onChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {definition.fields.map(field => (
        <div key={field.key}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff' }}>
            {field.label}
          </label>
          <input
            type="text"
            value={settings[field.key] || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            style={commonStyles.input}
          />
        </div>
      ))}
    </div>
  );
}; 