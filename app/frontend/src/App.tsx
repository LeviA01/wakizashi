import { useState } from 'react';
import axios from 'axios';
import { BotSettingsForm } from './components/BotSettingsForm';
import { BotBlocksEditor } from './components/BotBlocksEditor';
import { colors, commonStyles } from './styles';

type Command = {
  name: string;
  response: string;
};

function App() {
  const [step, setStep] = useState<"settings" | "editor">("settings");
  const [botSettings, setBotSettings] = useState<{ botName: string; token: string } | null>(null);
  const [commands, setCommands] = useState<Command[]>([{ name: '', response: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCommandChange = (idx: number, field: keyof Command, value: string) => {
    const newCommands = [...commands];
    newCommands[idx][field] = value;
    setCommands(newCommands);
  };

  const addCommand = () => setCommands([...commands, { name: '', response: '' }]);
  const removeCommand = (idx: number) => setCommands(commands.filter((_, i) => i !== idx));

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
          commands: commands.filter(cmd => cmd.name && cmd.response),
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
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{ 
          color: colors.text,
          textAlign: 'center',
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
          <BotBlocksEditor 
            botSettings={botSettings} 
            onBack={() => setStep("settings")} 
          />
        )}
      </div>
    </div>
  );
}

export default App;