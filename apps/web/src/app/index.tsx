import { useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AudioPlayer } from "#/components/chat/audio-player";
import { VoiceRecorder } from "#/components/chat/voice-recorder";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const handleRecordingComplete = useCallback((blob: Blob) => {
    setAudioBlob(blob);
  }, []);

  const handleClear = useCallback(() => {
    setAudioBlob(null);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-16 bg-background px-4">
      <section className="flex flex-col items-center gap-3">
        <h1 className="text-4xl font-bold tracking-tighter text-foreground">
          tabletalk
        </h1>
        <p className="text-sm text-muted-foreground">
          Voice-powered reservations
        </p>
      </section>

      <div className="flex flex-col items-center gap-4">
        <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
        <AudioPlayer blob={audioBlob} onClear={handleClear} />
      </div>
    </main>
  );
}
