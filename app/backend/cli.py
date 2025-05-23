import questionary
from generator import BotGenerator

def main():
    print("🤖 Telegram Bot Constructor")
    print("=" * 30)
    
    # Базовые настройки
    bot_name = questionary.text("Название бота:").ask()
    bot_token = questionary.text("Токен бота:").ask()
    
    # Команды
    commands = []
    while True:
        add_command = questionary.confirm("Добавить команду?").ask()
        if not add_command:
            break
            
        cmd_name = questionary.text("Название команды (без /):").ask()
        cmd_response = questionary.text("Ответ на команду:").ask()
        commands.append({"name": cmd_name, "response": cmd_response})
    
    # Генерация
    config = {
        "bot_name": bot_name,
        "bot_token": bot_token,
        "commands": commands
    }
    
    generator = BotGenerator()
    generator.generate(config, f"./tests/generated_{bot_name}")
    print(f"✅ Бот создан в папке generated_{bot_name}")

if __name__ == "__main__":
    main()