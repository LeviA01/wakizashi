import React, { useState } from "react";
import { AddBlockForm } from "./AddBlockForm";
import { BlockItem } from "./BlockItem";
import { blockDefinitions } from "./BlockDefinitions";
import type { BotBlockType } from "./BlockDefinitions";
import { BlockSettingsForm } from "./BlockSettingsForm";
import { v4 as uuidv4 } from "uuid";
import { commonStyles } from "../styles";

interface BotBlock {
  id: string;
  type: BotBlockType;
  name: string;
  settings: Record<string, any>;
}

interface BotSettings {
  botName: string;
  token: string;
}

interface BotBlocksEditorProps {
  botSettings: BotSettings;
  onBack: () => void;
}

export const BotBlocksEditor: React.FC<BotBlocksEditorProps> = ({ botSettings: initialBotSettings, onBack }) => {
  const [botSettings, setBotSettings] = useState<BotSettings>(initialBotSettings);

  const [blocks, setBlocks] = useState<BotBlock[]>([]);

  const addBlock = (type: BotBlockType, name: string) => {
    const definition = blockDefinitions[type];
    const initialSettings: Record<string, any> = {};
    definition.fields.forEach(field => {
      initialSettings[field.key] = "";
    });

    setBlocks(prev => [
      ...prev,
      {
        id: uuidv4(),
        type,
        name,
        settings: initialSettings
      }
    ]);
  };

  const updateBlockSettings = (id: string, newSettings: Record<string, any>) => {
    setBlocks(prev =>
      prev.map(block =>
        block.id === id ? { ...block, settings: newSettings } : block
      )
    );
  };

  const deleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
  };

  const handleGenerate = () => {
    const payload = {
      bot_name: botSettings.botName,
      bot_token: botSettings.token,
      commands: blocks.map(({ type, name, settings }) => ({
        type,
        name,
        settings
      }))
    };

    console.log("📦 Сгенерировано:", JSON.stringify(payload, null, 2));
    alert("JSON сгенерирован и выведен в консоль!");
  };

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>Настройки бота</h2>
      <input
        placeholder="Имя бота"
        value={botSettings.botName}
        onChange={e => setBotSettings({ ...botSettings, botName: e.target.value })}
        style={commonStyles.input}
      />
      <input
        placeholder="Токен"
        value={botSettings.token}
        onChange={e => setBotSettings({ ...botSettings, token: e.target.value })}
        style={{ ...commonStyles.input, marginTop: "1rem" }}
      />

      <hr style={{ margin: "2rem 0" }} />

      <AddBlockForm onAdd={addBlock} />

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {blocks.map(block => (
          <div key={block.id} style={commonStyles.card}>
            <h4 style={{ marginBottom: "0.5rem" }}>
              {blockDefinitions[block.type].title}: {block.name}
            </h4>

            <BlockSettingsForm
              type={block.type}
              settings={block.settings}
              onChange={(newSettings: Record<string, any>) => updateBlockSettings(block.id, newSettings)}
            />

            <button
              onClick={() => deleteBlock(block.id)}
              style={{ ...commonStyles.button, background: "#c0392b", marginTop: "1rem" }}
            >
              Удалить блок
            </button>
          </div>
        ))}
      </div>

      <hr style={{ margin: "2rem 0" }} />

      <button onClick={handleGenerate} style={{ ...commonStyles.button, width: "100%" }}>
        Сгенерировать JSON
      </button>
    </div>
  );
};

