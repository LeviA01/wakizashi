import React, { useState } from "react";
import type { BotBlock } from "../types.ts";
import { colors, gradients, commonStyles } from "../styles";

interface Props {
  block: BotBlock;
  onUpdate: (block: BotBlock) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const BlockItem: React.FC<Props> = ({ block, onUpdate, onDelete, onMoveUp, onMoveDown }) => {
  const [settingsText, setSettingsText] = useState(JSON.stringify(block.settings, null, 2));

  const handleSettingsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSettingsText(e.target.value);
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(settingsText);
      onUpdate({ ...block, settings: parsed });
    } catch {
      alert("Неверный JSON в настройках блока");
    }
  };

  const buttonStyle = {
    ...commonStyles.button,
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    marginLeft: '0.5rem'
  };

  return (
    <div style={{
      ...commonStyles.card,
      background: gradients.surface,
      marginBottom: '1rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h4 style={{
          margin: 0,
          color: colors.text,
          fontSize: '1.1rem'
        }}>
          {block.name} <span style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>({block.type})</span>
        </h4>
        <div>
          <button
            onClick={onMoveUp}
            style={{
              ...buttonStyle,
              background: gradients.info,
              padding: '0.5rem'
            }}
          >
            ↑
          </button>
          <button
            onClick={onMoveDown}
            style={{
              ...buttonStyle,
              background: gradients.info,
              padding: '0.5rem'
            }}
          >
            ↓
          </button>
        </div>
      </div>

      <textarea
        rows={6}
        value={settingsText}
        onChange={handleSettingsChange}
        style={{
          ...commonStyles.input,
          fontFamily: 'monospace',
          marginBottom: '1rem',
          resize: 'vertical'
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          style={{
            ...buttonStyle,
            background: gradients.primary
          }}
        >
          Сохранить настройки
        </button>
        <button
          onClick={onDelete}
          style={{
            ...buttonStyle,
            background: gradients.error
          }}
        >
          Удалить блок
        </button>
      </div>
    </div>
  );
};
