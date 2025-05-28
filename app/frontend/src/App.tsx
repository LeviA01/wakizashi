import { useState } from 'react';
import axios from 'axios';
import { BotSettingsForm } from './components/BotSettingsForm';
import { BlockEditor } from './components/BlockEditor';
import { BlockEditForm } from './components/BlockEditForm';
import { colors, commonStyles } from './styles';

type Block = {
  id: string;
  type: 'command' | 'autoReply' | 'custom';
  x: number;
  y: number;
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

function App() {
  const [step, setStep] = useState<"settings" | "editor">("settings");
  const [botSettings, setBotSettings] = useState<{ botName: string; token: string } | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!botSettings) {
      setError('Настройки бота не найдены');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        'http://localhost:8000/generate',
        {
          bot_name: botSettings.botName,
          bot_token: botSettings.token,
          blocks: blocks,
        },
        { responseType: 'blob' }
      );
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${botSettings.botName}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Ошибка при генерации бота');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div style={{
      ...commonStyles.container,
      width: '100%',
      maxWidth: '100%',
      padding: '1rem',
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '100%',
        marginLeft: '0',
      }}>
        <h2 style={{ 
          color: colors.text,
          textAlign: 'left',
          marginBottom: '2rem',
          fontSize: '2rem',
          textShadow: '0 0 10px rgba(255, 68, 68, 0.5)'
        }}>
          Генератор Telegram-бота
        </h2>
        
        {error && (
          <div style={{
            color: colors.error,
            marginBottom: '20px',
            padding: '10px',
            border: `1px solid ${colors.error}`,
            borderRadius: '4px',
            backgroundColor: `${colors.error}22`
          }}>
            {error}
          </div>
        )}

        {step === "settings" && (
          <BotSettingsForm
            onNext={(settings) => {
              setBotSettings(settings);
              setStep("editor");
            }}
          />
        )}
        
        {step === "editor" && botSettings && (
          <div>
            <BlockEditor
              blocks={blocks}
              onChange={setBlocks}
            />
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                onClick={() => setStep("settings")}
                style={{
                  ...commonStyles.button,
                  marginRight: '10px',
                }}
              >
                Назад
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={commonStyles.button}
              >
                {loading ? 'Генерация...' : 'Сгенерировать бота'}
              </button>
            </div>
          </div>
        )}

        {selectedBlock && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                ...commonStyles.card,
                width: '80%',
                maxWidth: '800px',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <BlockEditForm
                block={selectedBlock}
                onSave={(updatedBlock) => {
                  setBlocks(blocks.map(block =>
                    block.id === updatedBlock.id ? updatedBlock : block
                  ));
                  setSelectedBlock(null);
                }}
                onCancel={() => setSelectedBlock(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;