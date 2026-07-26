import { Bubble, BubbleContent } from "@tabletalk/shad-ui/components/bubble";

import { Message, MessageContent } from "@tabletalk/shad-ui/components/message";
import { useEffect, useRef } from "react";

import { AudioPlayer } from "./audio-player";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text?: string;
  audioBlob?: Blob;
  durationHint?: number;
};

export function ChatMessages({ messages }: { messages: ChatMessage[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-4 overflow-y-auto p-4">
      {messages.map((msg) => (
        <Message key={msg.id} align={msg.role === "user" ? "end" : "start"}>
          <MessageContent>
            <Bubble variant={msg.role === "user" ? "default" : "secondary"}>
              <BubbleContent>
                {msg.text ? <p>{msg.text}</p> : null}
                {msg.audioBlob ? <AudioPlayer blob={msg.audioBlob} durationHint={msg.durationHint} /> : null}
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
