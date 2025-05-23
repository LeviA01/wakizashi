import shutil
import tempfile
import zipfile
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import List
from pathlib import Path

from .generator import BotGenerator  # Твой класс генератора из generator.py

app = FastAPI(title="Telegram Bot Generator API")

class Command(BaseModel):
    name: str = Field(..., example="start")
    response: str = Field(..., example="Привет!")

class BotConfig(BaseModel):
    bot_name: str = Field(..., example="MyBot")
    bot_token: str = Field(..., example="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11")
    commands: List[Command]

@app.post("/generate")
async def generate_bot(config: BotConfig):
    tmpdir = tempfile.mkdtemp()
    try:
        output_path = Path(tmpdir) / f"generated_{config.bot_name}"
        config_dict = config.dict()

        generator = BotGenerator()
        generator.generate(config_dict, output_path)

        zip_path = Path(tmpdir) / f"{config.bot_name}.zip"
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for file_path in output_path.rglob("*"):
                zipf.write(file_path, file_path.relative_to(output_path))

        return FileResponse(zip_path, filename=f"{config.bot_name}.zip", media_type="application/zip")
    finally:
        # Не удаляйте tmpdir сразу! Можно сделать отдельный эндпоинт для очистки или использовать планировщик.
        pass

