import { Pause, Play, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@tabletalk/shad-ui/components/button";
import { Slider } from "@tabletalk/shad-ui/components/slider";

const DEFAULT_MAX_DURATION = 100;

type AudioPlayerProps = {
  blob: Blob | null;
  onClear?: () => void;
};

export function AudioPlayer({ blob, onClear }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
    const url = URL.createObjectURL(blob);
    objectUrlRef.current = url;
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
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
  }, [blob]);

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

  const seek = useCallback((value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  }, []);

  const formatTime = (s: number) => {
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

      <Slider
        value={[currentTime]}
        min={0}
        max={duration || DEFAULT_MAX_DURATION}
        step={0.1}
        onValueChange={seek}
        className="flex-1"
      />

      <span className="min-w-12 text-right text-muted-foreground text-xs tabular-nums">
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
