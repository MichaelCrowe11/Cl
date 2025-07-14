"use client";

import {
  createContext, 
  useContext, 
  useReducer, 
  useEffect, 
  ReactNode
} from "react";
import { ChatState, ChatAction, Message } from "@/lib/chat-types";
import { streamCompletion } from "@/lib/ai";

// Simple ID generator to avoid uuid dependency
const generateId = () => Math.random().toString(36).substr(2, 9);

const ChatContext = createContext<
  [ChatState, React.Dispatch<ChatAction>] | undefined
>(undefined);

const INITIAL_AGENT: Message = {
  id: "sys-welcome",
  role: "agent",
  userName: "Crowe Logic AI",
  avatar: "/crowe-avatar.png",
  content:
    "Welcome to Crowe Logic AI, your dedicated mycology lab partner. How can I assist your cultivation efforts today?",
  timestamp: "",
};

const initialState: ChatState = {
  messages: [INITIAL_AGENT],
  model: "gpt-4",
  isSending: false,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        messages: state.messages.map((m, i) => ({
          ...m,
          timestamp: new Date(Date.now() + i * 60_000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        })),
      };

    case "SET_MODEL":
      return { ...state, model: action.model };

    case "SEND": {
      const userMsg: Message = {
        id: generateId(),
        role: "user",
        userName: "Cultivator",
        avatar: "/placeholder-user.jpg",
        content: action.content,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      
      const stubAgent: Message = {
        id: generateId(),
        role: "agent",
        userName: "Crowe Logic AI",
        avatar: "/crowe-avatar.png",
        content: "",
        timestamp: userMsg.timestamp,
        loading: true,
      };
      
      return {
        ...state,
        messages: [...state.messages, userMsg, stubAgent],
        isSending: true,
        controller: new AbortController(),
      };
    }

    case "STREAM_PART":
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.id ? { ...m, content: m.content + action.delta } : m
        ),
      };

    case "STREAM_DONE":
      return {
        ...state,
        isSending: false,
        controller: undefined,
        messages: state.messages.map((m) =>
          m.id === action.id ? { ...m, loading: false } : m
        ),
      };

    case "ERROR":
      return {
        ...state,
        isSending: false,
        controller: undefined,
        messages: state.messages.map((m) =>
          m.id === action.id
            ? { ...m, loading: false, error: action.error }
            : m
        ),
      };

    case "ABORT":
      state.controller?.abort();
      return { 
        ...state, 
        isSending: false, 
        controller: undefined,
        messages: state.messages.map((m) =>
          m.loading ? { ...m, loading: false, error: "Cancelled" } : m
        ),
      };

    default:
      return state;
  }
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // One-time timestamp hydration to avoid SSR mismatch
  useEffect(() => {
    dispatch({ type: "INIT" });
  }, []);

  // Side-effect: start streaming when we have a loading agent message
  useEffect(() => {
    if (!state.isSending || !state.controller) return;
    
    const lastMessage = state.messages[state.messages.length - 1];
    if (!lastMessage || lastMessage.role !== "agent" || !lastMessage.loading) return;

    const apiMessages = state.messages
      .filter((m) => m.role !== "agent" || !m.loading)
      .map(({ role, content, userName, avatar }) => ({
        role: role === "agent" ? "assistant" as const : "user" as const,
        content,
        userName,
        avatar,
      }));

    const body = {
      model: state.model,
      messages: apiMessages,
      temperature: 0.3,
      maxTokens: 2000,
    };

    streamCompletion(
      body,
      (token) => dispatch({ type: "STREAM_PART", id: lastMessage.id, delta: token }),
      state.controller.signal
    )
      .then(() => dispatch({ type: "STREAM_DONE", id: lastMessage.id }))
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        dispatch({
          type: "ERROR",
          id: lastMessage.id,
          error: errorMessage,
        });
      });
  }, [state.isSending, state.controller]);

  return (
    <ChatContext.Provider value={[state, dispatch]}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
