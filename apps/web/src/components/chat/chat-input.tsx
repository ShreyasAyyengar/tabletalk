import { useCallback, useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@tabletalk/shad-ui/components/button";
import { Input } from "@tabletalk/shad-ui/components/input";

export function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("");

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  }, [text, onSend]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <div className="flex flex-1 items-center gap-2">
      <Input
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message…"
      />
      <Button
        size="icon"
        onClick={handleSend}
        disabled={!text.trim()}
        aria-label="Send message"
      >
        <Send className="size-4" />
      </Button>
    </div>
  );
}
