import { useCallback, useEffect, useRef, useState } from "react";

const BAR_COUNT = 48;
const BAR_GAP = 2;
const MIN_BAR_HEIGHT = 2;
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
        const binSize = Math.floor(data.length / BAR_COUNT);
        const amps: number[] = [];
        for (let i = 0; i < BAR_COUNT; i += 1) {
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
        if (!cancelled) setAmplitudes(Array.from({ length: BAR_COUNT }, () => FALLBACK_AMP));
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

    const w = rect.width;
    const h = rect.height;
    const barWidth = Math.max((w - BAR_GAP * (BAR_COUNT - 1)) / BAR_COUNT, 2);

    ctx.clearRect(0, 0, w, h);

    const progress = duration > 0 ? currentTime / duration : 0;
    const playedBars = Math.floor(progress * BAR_COUNT);

    for (let i = 0; i < BAR_COUNT; i += 1) {
      const amp = amplitudes[i] ?? FALLBACK_AMP;
      const barHeight = Math.max(amp * h * AMP_HEIGHT_RATIO, MIN_BAR_HEIGHT);
      const x = i * (barWidth + BAR_GAP);
      const y = (h - barHeight) / 2;

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
