export type Role = "agent" | "user";
export type ApiRole = "assistant" | "user" | "system"; // For API calls

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;          // locale string for UI
  userName: string;
  avatar?: string;
  // streaming helpers
  loading?: boolean;          // true while token stream open
  error?: string | null;
}

export interface ApiMessage {
  role: ApiRole;
  content: string;
  userName?: string; // Optional for system messages
  avatar?: string;
}

export interface ChatState {
  messages: Message[];
  model: string;
  isSending: boolean;
  controller?: AbortController;
}

export type ChatAction =
  | { type: "SEND"; content: string }
  | { type: "STREAM_PART"; id: string; delta: string }
  | { type: "STREAM_DONE"; id: string }
  | { type: "ERROR"; id: string; error: string }
  | { type: "SET_MODEL"; model: string }
  | { type: "ABORT" }
  | { type: "INIT" };        // first‑render timestamp fix
