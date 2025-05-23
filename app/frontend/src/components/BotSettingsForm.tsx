import React, { useState } from "react";
import { commonStyles } from "../styles";

interface BotSettings {
  botName: string;
  token: string;
}

interface BotSettingsFormProps {
  onNext: (settings: BotSettings) => void;
}

export const BotSettingsForm: React.FC<BotSettingsFormProps> = ({ onNext }) => {
  const [settings, setSettings] = useState<BotSettings>({
    botName: "",
    token: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings.botName && settings.token) {
      onNext(settings);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{
          display: "block",
          marginBottom: "0.5rem",
          color: "#fff",
          fontWeight: "500"
        }}>
          Имя бота:
        </label>
        <input
          type="text"
          value={settings.botName}
          onChange={(e) => setSettings({ ...settings, botName: e.target.value })}
          style={commonStyles.input}
          placeholder="Введите имя бота"
          required
        />
      </div>

      <div>
        <label style={{
          display: "block",
          marginBottom: "0.5rem",
          color: "#fff",
          fontWeight: "500"
        }}>
          Токен бота:
        </label>
        <input
          type="text"
          value={settings.token}
          onChange={(e) => setSettings({ ...settings, token: e.target.value })}
          style={commonStyles.input}
          placeholder="Введите токен бота"
          required
        />
      </div>

      <button 
        type="submit"
        style={{
          ...commonStyles.button,
          marginTop: '1rem'
        }}
      >
        Далее
      </button>
    </form>
  );
};
