import { createFileRoute } from "@tanstack/react-router";

import { VoiceRecorder } from "#/components/chat/voice-recorder";

export const Route = createFileRoute("/")({ component: App });

function App() {
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

      <VoiceRecorder
        onRecordingComplete={(blob) => {
          console.log("Recorded blob:", blob.type, `${(blob.size / 1024).toFixed(1)} KB`)
        }}
      />
    </main>
  );
}
