import { useCallback, useEffect, useRef, useState } from "react";

const AMP_BINS = 100;
const BAR_GAP = 1;
const TARGET_BAR_WIDTH = 3;
const MIN_BAR_HEIGHT = 2;
const MIN_DISPLAY_BARS = 4;
const FALLBACK_AMP = 0.3;
const AMP_HEIGHT_RATIO = 0.9;

type AudioWaveformProps = {
  blob: Blob;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
};

export function AudioWaveform({ blob, currentTime, duration, onSeek }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [amplitudes, setAmplitudes] = useState<number[]>([]);

  useEffect(() => {
    const ctx = new AudioContext();
    let cancelled = false;

    blob
      .arrayBuffer()
      .then((buf) => ctx.decodeAudioData(buf))
      .then((buffer) => {
        if (cancelled) return;
        const data = buffer.getChannelData(0);
        const binSize = Math.floor(data.length / AMP_BINS);
        const amps: number[] = [];
        for (let i = 0; i < AMP_BINS; i += 1) {
          let peak = 0;
          for (let j = 0; j < binSize; j += 1) {
            const abs = Math.abs(data[i * binSize + j]);
            if (abs > peak) peak = abs;
          }
          amps.push(peak);
        }
        setAmplitudes(amps);
      })
      .catch(() => {
        if (!cancelled) setAmplitudes(Array.from({ length: AMP_BINS }, () => FALLBACK_AMP));
      });

    return () => {
      cancelled = true;
      ctx.close();
    };
  }, [blob]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || amplitudes.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const primaryColor = "hsl(0 0% 100%)";
    const mutedColor = "hsl(0 0% 100% / 0.25)";

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);

    const displayCount = Math.max(MIN_DISPLAY_BARS, Math.floor((rect.width + BAR_GAP) / (TARGET_BAR_WIDTH + BAR_GAP)));
    const merge = Math.floor(AMP_BINS / displayCount);
    const barWidth = (rect.width - BAR_GAP * (displayCount - 1)) / displayCount;

    const progress = duration > 0 ? currentTime / duration : 0;
    const playedBars = Math.floor(progress * displayCount);

    for (let i = 0; i < displayCount; i += 1) {
      let peak = 0;
      for (let j = 0; j < merge; j += 1) {
        const idx = i * merge + j;
        if (idx < amplitudes.length) {
          const v = amplitudes[idx] ?? FALLBACK_AMP;
          if (v > peak) peak = v;
        }
      }
      const barHeight = Math.max(peak * rect.height * AMP_HEIGHT_RATIO, MIN_BAR_HEIGHT);
      const x = i * (barWidth + BAR_GAP);
      const y = (rect.height - barHeight) / 2;

      ctx.fillStyle = i < playedBars ? primaryColor : mutedColor;

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    }
  }, [amplitudes, currentTime, duration]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (duration <= 0) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, x / rect.width));
      onSeek(ratio * duration);
    },
    [duration, onSeek]
  );

  return <canvas ref={canvasRef} className="h-10 w-full cursor-pointer" onClick={handleClick} />;
}
