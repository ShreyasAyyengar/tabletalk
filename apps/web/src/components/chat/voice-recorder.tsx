import { Check, Loader2, Mic, MicOff, Square } from "lucide-react";
import { useEffect, useState } from "react";

import { useMediaRecorder } from "#/hooks/use-media-recorder";

type VoiceRecorderProps = {
  onRecordingComplete?: (blob: Blob) => void;
};

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const { status, start, stop, audioBlob, durationMs, error } = useMediaRecorder();
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (status === "stopped" && audioBlob) {
      onRecordingComplete?.(audioBlob);
      setShowCheck(true);
      const timer = setTimeout(() => setShowCheck(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [status, audioBlob, onRecordingComplete]);

  const isRecording = status === "recording";
  const isRequesting = status === "requesting";

  const formatDuration = (ms: number) => {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleClick = () => {
    if (status === "recording") {
      stop();
    } else if (["idle", "stopped", "error"].includes(status)) {
      start();
    }
  };

  const statusText = () => {
    switch (status) {
      case "idle":
        return "Tap to record";
      case "requesting":
        return "Requesting microphone…";
      case "recording":
        return formatDuration(durationMs);
      case "stopped":
        return showCheck ? "Recorded!" : "Tap to record";
      case "error":
        return error ?? "Recording failed";
    }
  };

  const icon = (() => {
    if (isRequesting) return <Loader2 className="size-6 animate-spin" />;
    if (isRecording) return <Square className="size-5" fill="currentColor" />;
    if (status === "error") return <MicOff className="size-6" />;
    if (showCheck) return <Check className="size-6" />;
    return <Mic className="size-6" />;
  })();

  const buttonStyle = (() => {
    if (isRecording) {
      return "border-destructive/60 bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25";
    }
    if (status === "error") {
      return "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20";
    }
    if (showCheck) {
      return "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/25";
    }
    return "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20";
  })();

  return (
    <div className="flex flex-col items-center gap-5">
      <button
        type="button"
        onClick={handleClick}
        disabled={isRequesting}
        className={`relative flex size-16 items-center justify-center rounded-full border-2 transition-all duration-200 disabled:cursor-not-allowed ${buttonStyle}`}
        aria-label={statusText()}
        title={statusText()}
      >
        {icon}
        {isRecording && <span className="absolute -inset-1 animate-ping rounded-full border-2 border-destructive/40" />}
      </button>

      <p className={`font-medium text-sm tracking-tight ${isRecording || status === "error" ? "text-destructive" : "text-muted-foreground"}`}>
        {statusText()}
      </p>
    </div>
  );
}
