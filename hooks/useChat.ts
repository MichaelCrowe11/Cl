import { useChatContext } from "@/state/ChatProvider";

export const useChat = () => {
  const [state, dispatch] = useChatContext();
  
  return {
    ...state,
    send: (content: string) => dispatch({ type: "SEND", content }),
    setModel: (model: string) => dispatch({ type: "SET_MODEL", model }),
    abort: () => dispatch({ type: "ABORT" }),
  };
};
