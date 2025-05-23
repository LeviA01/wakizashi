export type BotBlockType = "command" | "autoReply" | "messageResponse";

export interface BotBlock {
  id: string;
  type: BotBlockType;
  name: string;
  settings: Record<string, any>;
}

export interface BotSettings {
  botName: string;
  token: string;
}