import { useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { v4 as uuidv4 } from "uuid";

import { ChatInput } from "#/components/chat/chat-input";
import { ChatMessages, type ChatMessage } from "#/components/chat/chat-messages";
import { VoiceRecorder } from "#/components/chat/voice-recorder";

const MS_TO_S = 1000;

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleRecordingComplete = useCallback((blob: Blob, durationMs: number) => {
    const msg: ChatMessage = {
      id: uuidv4(),
      role: "user",
      durationHint: durationMs / MS_TO_S,
      audioBlob: blob,
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  const handleSend = useCallback((text: string) => {
    const msg: ChatMessage = {
      id: uuidv4(),
      role: "user",
      text,
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="flex shrink-0 flex-col items-center gap-1 border-b px-4 py-4">
        <h1 className="font-bold text-4xl text-foreground tracking-tighter">
          tabletalk
        </h1>
        <p className="text-muted-foreground text-sm">
          Voice-powered reservations
        </p>
      </header>

      <section className="flex min-h-0 flex-1 flex-col">
        <ChatMessages messages={messages} />
      </section>

      <footer className="flex shrink-0 items-center gap-2 border-t p-4">
        <VoiceRecorder compact onRecordingComplete={handleRecordingComplete} />
        <ChatInput onSend={handleSend} />
      </footer>
    </main>
  );
}
