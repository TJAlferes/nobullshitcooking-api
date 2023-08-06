import { assert, string } from 'superstruct';
import { uuidv7 }         from 'uuidv7';

export class Chatmessage {
  private id;
  private kind;
  private to;
  private from;
  private content;
  // Timestamps -- handled by MySQL
  private created_at: Date | null = null;
  private updated_at: Date | null = null;

  private constructor(params: ChatMessageParams) {
    this.id   =    ChatmessageId();
    this.kind =    Kind(params.kind);
    this.to   =    Username(params.to);    // ALSO ALLOW SOCKETS ?
    this.from =    Username(params.from);  // ALSO ALLOW SOCKETS ?
    this.content = Content(params.content);
  }

  static create(params: ChatMessageParams): Chatmessage {
    const chatMessage = new Chatmessage(params);
    return chatMessage;
  }
}

export function ChatmessageId() {
  return uuidv7();
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

export function Content(content: string) {
  assert(content, string());
  if (content.length > 1000) {
    throw new Error("Chat message content must be no more than 1,000 characters.");
  }
  return content;
}

export type ChatMessageParams = {
  kind:    typeof PRIVATE | typeof PUBLIC;
  to:      string;
  from:    string;
  content: string;
};

export const PRIVATE = "private" as const;
export const PUBLIC  = "public" as const;
