import { Message } from "@/lib/chat-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, Download, ThumbsUp, ThumbsDown, Loader2, X } from "lucide-react";
import { CroweLogicAvatar } from "@/components/croweos-logo-system";

interface Props {
  msg: Message;
  onCopy: (content: string) => void;
  onAbort: () => void;
}

export function MessageRow({ msg, onCopy, onAbort }: Props) {
  const isUser = msg.role === "user";
  
  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%] group",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
      role="article"
      aria-label={`${msg.userName} message`}
    >
      {/* Use CroweLogicAvatar for AI responses, regular Avatar for users */}
      {msg.role === "agent" ? (
        <CroweLogicAvatar size={32} className="flex-shrink-0" />
      ) : (
        <Avatar className="h-8 w-8 border flex-shrink-0">
          <AvatarImage src={msg.avatar || "/placeholder-user.jpg"} alt={msg.userName} />
          <AvatarFallback>{msg.userName.substring(0, 1)}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn("space-y-1", isUser ? "items-end" : "items-start")}>
        <div className={cn("flex items-center gap-2", isUser ? "flex-row-reverse" : "")}>
          <span className="text-xs font-medium">{msg.userName}</span>
          <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
        </div>
        
        <div
          className={cn(
            "p-3 rounded-xl shadow-sm text-sm",
            msg.role === "agent"
              ? "bg-zinc-100 rounded-bl-none text-zinc-900"
              : "bg-zinc-900 text-white rounded-br-none",
          )}
        >
          <div className="whitespace-pre-wrap leading-relaxed">
            {msg.content}
            {msg.loading && <Loader2 className="inline animate-spin ml-2 h-4 w-4" />}
          </div>
          
          {msg.error && (
            <div className="text-red-600 text-xs mt-2 flex items-center gap-1">
              ⚠️ {msg.error}
            </div>
          )}
        </div>

        {!isUser && !msg.loading && (
          <div className="flex items-center gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-zinc-500 hover:text-zinc-900"
              onClick={() => onCopy(msg.content)}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-zinc-500 hover:text-zinc-900"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-zinc-500 hover:text-zinc-900"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-zinc-500 hover:text-zinc-900"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {msg.loading && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-zinc-500 hover:text-zinc-900"
            onClick={onAbort}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
