// src/blockDefinitions.ts

export type BotBlockType = "command" | "autoReply" | "messageResponse";

export interface BlockField {
  key: string;
  label: string;
  type: "text"; // можно расширить типами: "select", "checkbox", "number"
}

export interface BlockDefinition {
  type: BotBlockType;
  title: string;
  fields: BlockField[];
}

export const blockDefinitions: Record<BotBlockType, BlockDefinition> = {
  command: {
    type: "command",
    title: "Обработчик команды",
    fields: [
      { key: "name", label: "Команда (без /)", type: "text" },
      { key: "response", label: "Ответ", type: "text" }
    ]
  },
  autoReply: {
    type: "autoReply",
    title: "Автоответчик",
    fields: [
      { key: "name", label: "Название правила", type: "text" },
      { key: "response", label: "Ответ", type: "text" }
    ]
  },
  messageResponse: {
    type: "messageResponse",
    title: "Ответ на сообщение",
    fields: [
      { key: "keyword", label: "Ключевое слово", type: "text" },
      { key: "response", label: "Ответ", type: "text" }
    ]
  }
};

