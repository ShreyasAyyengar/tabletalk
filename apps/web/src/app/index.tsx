import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { useCallback, useState } from "react";

import { AudioPlayer } from "#/components/chat/audio-player";
import { VoiceRecorder } from "#/components/chat/voice-recorder";
import { api } from "../../../backend/convex/_generated/api";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const handleRecordingComplete = useCallback((blob: Blob) => {
    setAudioBlob(blob);
  }, []);

  const handleClear = useCallback(() => {
    setAudioBlob(null);
  }, []);

  const generateUploadURL = useMutation(api.audio.process.generateUploadUrl);
  const sendAudioSegment = useMutation(api.audio.process.receiveAudio);

  const handleSend = useCallback(async () => {
    if (!audioBlob) return;

    const uploadURL = await generateUploadURL({});
    const result = await fetch(uploadURL, {
      method: "POST",
      headers: {
        "Content-Type": "audio/webm",
      },
      body: audioBlob,
    });
    const { storageId } = await result.json();

    await sendAudioSegment({
      audioSegmentStorageId: storageId,
      customerName: "", // TODO,
    });
  }, [audioBlob]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-16 bg-background px-4">
      <section className="flex flex-col items-center gap-3">
        <h1 className="font-bold text-4xl text-foreground tracking-tighter">tabletalk</h1>
        <p className="text-muted-foreground text-sm">Voice-powered reservations</p>
      </section>

      <div className="flex flex-col items-center gap-4">
        <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
        <AudioPlayer blob={audioBlob} onClear={handleClear} />
      </div>
    </main>
  );
}
