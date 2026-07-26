import { Pause, Play, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@tabletalk/shad-ui/components/button";

import { AudioWaveform } from "./audio-waveform";

export function AudioPlayer({ blob, durationHint, onClear }: { blob: Blob | null; durationHint?: number; onClear?: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationHint ?? 0);

  useEffect(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    if (!blob) {
      objectUrlRef.current = null;
      audioRef.current = null;
      setPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }
    setDuration(durationHint ?? 0);
    const url = URL.createObjectURL(blob);
    objectUrlRef.current = url;
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    });
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });
    audio.addEventListener("ended", () => {
      setPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [blob, durationHint]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  }, [playing]);

  const seekTo = useCallback((t: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = t;
    setCurrentTime(t);
  }, []);

  const formatTime = (s: number) => {
    if (!Number.isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!blob) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-2.5">
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={togglePlay}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </Button>

      <div className="min-w-0 flex-1">
        <AudioWaveform
          blob={blob}
          currentTime={currentTime}
          duration={duration}
          onSeek={seekTo}
        />
      </div>

      <span className="min-w-12 shrink-0 text-right text-muted-foreground text-xs tabular-nums">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>

      {onClear ? (
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={onClear}
          aria-label="Clear recording"
        >
          <Trash2 className="size-3" />
        </Button>
      ) : null}
    </div>
  );
}
