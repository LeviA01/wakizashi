import React, { useState } from "react";
import axios from "axios";

function App() {
  const [botName, setBotName] = useState("");
  const [botToken, setBotToken] = useState("");
  const [commands, setCommands] = useState([{ name: "", response: "" }]);
  const [loading, setLoading] = useState(false);

  const handleCommandChange = (idx, field, value) => {
    const newCommands = [...commands];
    newCommands[idx][field] = value;
    setCommands(newCommands);
  };

  const addCommand = () => setCommands([...commands, { name: "", response: "" }]);
  const removeCommand = (idx) => setCommands(commands.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/generate",
        {
          bot_name: botName,
          bot_token: botToken,
          commands: commands.filter(cmd => cmd.name && cmd.response),
        },
        { responseType: "blob" }
      );
      // Скачиваем архив
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${botName}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Ошибка при генерации бота");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Генератор Telegram-бота</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя бота:</label>
          <input value={botName} onChange={e => setBotName(e.target.value)} required />
        </div>
        <div>
          <label>Токен бота:</label>
          <input value={botToken} onChange={e => setBotToken(e.target.value)} required />
        </div>
        <div>
          <label>Команды:</label>
          {commands.map((cmd, idx) => (
            <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
              <input
                placeholder="Название"
                value={cmd.name}
                onChange={e => handleCommandChange(idx, "name", e.target.value)}
                required
              />
              <input
                placeholder="Ответ"
                value={cmd.response}
                onChange={e => handleCommandChange(idx, "response", e.target.value)}
                required
              />
              {commands.length > 1 && (
                <button type="button" onClick={() => removeCommand(idx)}>-</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addCommand}>Добавить команду</button>
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 16 }}>
          {loading ? "Генерация..." : "Сгенерировать и скачать"}
        </button>
      </form>
    </div>
  );
}

export default App;
