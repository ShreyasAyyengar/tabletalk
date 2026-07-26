import { useCallback, useEffect, useRef, useState } from "react";

export type MediaRecorderStatus = "idle" | "requesting" | "recording" | "stopped" | "error";

export type UseMediaRecorderReturn = {
  status: MediaRecorderStatus;
  start: () => Promise<void>;
  stop: () => void;
  cancel: () => void;
  audioBlob: Blob | null;
  durationMs: number;
  error: string | null;
};

const MIME_TYPES = ["audio/webm;codecs=opus", "audio/webm"] as const;

function getSupportedMimeType(): string {
  for (const mime of MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return "";
}

export function useMediaRecorder(): UseMediaRecorderReturn {
  const [status, setStatus] = useState<MediaRecorderStatus>("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [durationMs, setDurationMs] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef(0);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelledRef = useRef(false);

  const stopDurationCounter = useCallback(() => {
    if (durationIntervalRef.current !== null) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, []);

  const cleanup = useCallback(() => {
    stopDurationCounter();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
  }, [stopDurationCounter]);

  useEffect(
    () => () => {
      cancelledRef.current = true;
      cleanup();
    },
    [cleanup]
  );

  const start = useCallback(async () => {
    if (!window.MediaRecorder) {
      setError("Recording is not supported in this browser");
      setStatus("error");
      return;
    }

    if (status === "recording" || status === "requesting") return;

    setError(null);
    setAudioBlob(null);
    setDurationMs(0);
    cancelledRef.current = false;
    setStatus("requesting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (cancelledRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      chunksRef.current = [];

      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const mime = mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mime });
        setAudioBlob(blob);
        setStatus("stopped");
        stopDurationCounter();
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      recorder.onerror = () => {
        setError("An error occurred during recording");
        setStatus("error");
        stopDurationCounter();
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      recorder.start(100);
      startTimeRef.current = Date.now();
      setStatus("recording");

      durationIntervalRef.current = setInterval(() => {
        setDurationMs(Date.now() - startTimeRef.current);
      }, 100);
    } catch (err: unknown) {
      if (cancelledRef.current) return;

      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          setError("Microphone access denied");
        } else if (err.name === "NotFoundError") {
          setError("No microphone found");
        } else {
          setError(err.message);
        }
      } else {
        setError(err instanceof Error ? err.message : "Failed to start recording");
      }
      setStatus("error");
    }
  }, [status, stopDurationCounter]);

  const stop = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    stopDurationCounter();
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }
    cleanup();
    chunksRef.current = [];
    setAudioBlob(null);
    setDurationMs(0);
    setStatus("idle");
  }, [stopDurationCounter, cleanup]);

  return { status, start, stop, cancel, audioBlob, durationMs, error };
}
