import React, { useState } from 'react';
import { colors, commonStyles } from '../styles';

interface BlockEditFormProps {
  block: {
    id: string;
    type: 'command' | 'autoReply' | 'custom';
    settings: {
      command?: string;
      triggers?: string[];
      response: {
        text: string;
        image_url?: string;
        buttons?: Array<{
          text: string;
          callback: string;
        }>;
      };
      custom_function?: string;
      conditions?: {
        only_if_admin?: boolean;
      };
    };
  };
  onSave: (block: any) => void;
  onCancel: () => void;
}

export const BlockEditForm: React.FC<BlockEditFormProps> = ({
  block,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState(block);

  const handleChange = (path: string[], value: any) => {
    const newData = { ...formData };
    let current: any = newData;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    
    setFormData(newData);
  };

  const addButton = () => {
    const newButtons = [...(formData.settings.response.buttons || []), { text: '', callback: '' }];
    handleChange(['settings', 'response', 'buttons'], newButtons);
  };

  const removeButton = (index: number) => {
    const newButtons = formData.settings.response.buttons?.filter((_, i) => i !== index);
    handleChange(['settings', 'response', 'buttons'], newButtons);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ color: colors.text }}>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Тип блока:</label>
        <select
          value={formData.type}
          onChange={(e) => handleChange(['type'], e.target.value)}
          style={commonStyles.input}
        >
          <option value="command">Команда</option>
          <option value="autoReply">Автоответ</option>
          <option value="custom">Кастомный</option>
        </select>
      </div>

      {formData.type === 'command' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Команда:</label>
          <input
            type="text"
            value={formData.settings.command || ''}
            onChange={(e) => handleChange(['settings', 'command'], e.target.value)}
            style={commonStyles.input}
          />
        </div>
      )}

      {formData.type === 'autoReply' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Триггеры (через запятую):</label>
          <input
            type="text"
            value={formData.settings.triggers?.join(', ') || ''}
            onChange={(e) => handleChange(['settings', 'triggers'], e.target.value.split(',').map(t => t.trim()))}
            style={commonStyles.input}
          />
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Текст ответа:</label>
        <textarea
          value={formData.settings.response.text}
          onChange={(e) => handleChange(['settings', 'response', 'text'], e.target.value)}
          style={{ ...commonStyles.input, minHeight: '100px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>URL изображения (опционально):</label>
        <input
          type="text"
          value={formData.settings.response.image_url || ''}
          onChange={(e) => handleChange(['settings', 'response', 'image_url'], e.target.value)}
          style={commonStyles.input}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Кнопки:</label>
        {formData.settings.response.buttons?.map((button, index) => (
          <div key={index} style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Текст кнопки"
              value={button.text}
              onChange={(e) => {
                const newButtons = [...(formData.settings.response.buttons || [])];
                newButtons[index] = { ...newButtons[index], text: e.target.value };
                handleChange(['settings', 'response', 'buttons'], newButtons);
              }}
              style={commonStyles.input}
            />
            <input
              type="text"
              placeholder="Callback"
              value={button.callback}
              onChange={(e) => {
                const newButtons = [...(formData.settings.response.buttons || [])];
                newButtons[index] = { ...newButtons[index], callback: e.target.value };
                handleChange(['settings', 'response', 'buttons'], newButtons);
              }}
              style={commonStyles.input}
            />
            <button
              type="button"
              onClick={() => removeButton(index)}
              style={{ ...commonStyles.button, backgroundColor: colors.error }}
            >
              Удалить
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addButton}
          style={commonStyles.button}
        >
          Добавить кнопку
        </button>
      </div>

      {formData.type === 'command' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={formData.settings.conditions?.only_if_admin || false}
              onChange={(e) => handleChange(['settings', 'conditions', 'only_if_admin'], e.target.checked)}
            />
            Только для администраторов
          </label>
        </div>
      )}

      {formData.type === 'custom' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Кастомная функция:</label>
          <input
            type="text"
            value={formData.settings.custom_function || ''}
            onChange={(e) => handleChange(['settings', 'custom_function'], e.target.value)}
            style={commonStyles.input}
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{ ...commonStyles.button, backgroundColor: colors.error }}
        >
          Отмена
        </button>
        <button
          type="submit"
          style={commonStyles.button}
        >
          Сохранить
        </button>
      </div>
    </form>
  );
}; 