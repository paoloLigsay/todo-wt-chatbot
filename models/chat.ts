type User = "user" | "assistant" | "system"

export interface Message {
  id: string;
  created_at?: string;
  role: User;
  content: string;
}
