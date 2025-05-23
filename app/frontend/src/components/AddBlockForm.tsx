import React, { useState } from "react";
import type { BotBlockType } from "../types.ts";
import { colors, gradients, commonStyles } from "../styles";

interface Props {
  onAdd: (type: BotBlockType, name: string) => void;
}

export const AddBlockForm: React.FC<Props> = ({ onAdd }) => {
  const [type, setType] = useState<BotBlockType>("command");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(type, name.trim());
      setName("");
    } else {
      alert("Введите имя блока");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      ...commonStyles.card,
      background: gradients.surface,
      marginBottom: '2rem'
    }}>
      <h3 style={{
        marginBottom: '1rem',
        color: colors.text,
        fontSize: '1.2rem',
        textShadow: '0 0 10px rgba(255, 68, 68, 0.3)'
      }}>Добавить блок</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          color: colors.textSecondary,
          fontWeight: '500'
        }}>
          Тип блока:
        </label>
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value as BotBlockType)}
          style={{
            ...commonStyles.input,
            cursor: 'pointer'
          }}
        >
          <option value="command">Обработчик команды</option>
          <option value="autoReply">Автоответчик</option>
          <option value="messageResponse">Ответ на сообщение</option>
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          color: colors.textSecondary,
          fontWeight: '500'
        }}>
          Имя блока:
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={commonStyles.input}
          placeholder="Введите имя блока"
        />
      </div>

      <button 
        type="submit"
        style={{
          ...commonStyles.button,
          width: '100%',
          background: gradients.success
        }}
      >
        Добавить блок
      </button>
    </form>
  );
};
