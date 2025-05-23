import os
import shutil
from jinja2 import Environment, FileSystemLoader
from pathlib import Path

class BotGenerator:
    def __init__(self):
        self.template_dir = Path(__file__).parent / "templates" / "aiogram_basic"
        self.jinja_env = Environment(loader=FileSystemLoader(self.template_dir))
    
    def generate(self, config, output_dir):
        # Создаем выходную папку
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        # Генерируем основные файлы
        self._generate_file("bot.py.j2", output_path / "bot.py", config)
        self._generate_file("config.py.j2", output_path / "config.py", config)
        
        # Копируем статичные файлы
        shutil.copy(self.template_dir / "requirements.txt", output_path)
        
        # Создаем handlers
        handlers_dir = output_path / "handlers"
        handlers_dir.mkdir(exist_ok=True)
        self._generate_file("handlers/commands.py.j2", 
                          handlers_dir / "commands.py", config)
    
    def _generate_file(self, template_name, output_path, config):
        template = self.jinja_env.get_template(template_name)
        content = template.render(**config)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)