export const PRIVATE = "private" as const;
export const PUBLIC = "public" as const;

export interface IMessage {
  kind: typeof PRIVATE | typeof PUBLIC;
  id: string;
  to: string;
  from: string;
  text: string;
}