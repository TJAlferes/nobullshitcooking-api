import { assert, string } from 'superstruct';
import { v4 as uuidv4 }   from 'uuid';

export class ChatMessage {
  private id;
  private kind;
  private to;
  private from;
  private text;

  private constructor(params: ChatMessageParams) {
    this.id   = ChatMessageId();
    this.kind = Kind(params.kind);
    this.to   = Username(params.to);    // ALSO ALLOW SOCKETS ?
    this.from = Username(params.from);  // ALSO ALLOW SOCKETS ?
    this.text = Text(params.text);
  }

  static create(params: ChatMessageParams): ChatMessage {
    const chatMessage = new ChatMessage(params);
    return chatMessage;
  }
}

export function ChatMessageId() {
  return uuidv4();
}

export function Kind(kind: typeof PRIVATE | typeof PUBLIC) {
  if (kind === "private" || kind === "public") {
    return kind;
  }
  throw new Error ("Chat message kind must be 'private' or 'public'");
}

export function Username(username: string) {
  assert(username, string());
  if (username.length < 6) {
    throw new Error("Username must be at least 6 characters.");
  }
  if (username.length > 20) {
    throw new Error("Username must be no more than 20 characters.");
  }
  return username;
}

export function Text(text: string) {
  assert(text, string());
  if (text.length > 1000) {
    throw new Error("Chat message text must be no more than 1,000 characters.");
  }
  return text;
}

export type ChatMessageParams = {
  kind: typeof PRIVATE | typeof PUBLIC;
  to:   string;
  from: string;
  text: string;
};

export const PRIVATE = "private" as const;
export const PUBLIC  = "public" as const;
