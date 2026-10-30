'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Eraser, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Point = { x: number; y: number };

export function TracingPad({ letter, onComplete }: { letter: string; onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<Point | null>(null);
  const [hasInk, setHasInk] = useState(false);

  const prepare = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    const context = canvas.getContext('2d');
    if (!context) return;
    context.scale(ratio, ratio);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 13;
    context.strokeStyle = '#e89c3e';
  };

  useEffect(() => {
    prepare();
    setHasInk(false);
    const onResize = () => prepare();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [letter]);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    lastPoint.current = pointFromEvent(event);
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !lastPoint.current) return;
    const next = pointFromEvent(event);
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    context.beginPath();
    context.moveTo(lastPoint.current.x, lastPoint.current.y);
    context.lineTo(next.x, next.y);
    context.stroke();
    lastPoint.current = next;
    setHasInk(true);
  };

  const stop = () => {
    drawing.current = false;
    lastPoint.current = null;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
  };

  return (
    <div>
      <div className="relative h-[360px] overflow-hidden rounded-[28px] border-2 border-dashed border-[#cbc8bc] bg-[#fbfaf6] sm:h-[410px]">
        <div className="font-persian pointer-events-none absolute inset-0 grid select-none place-items-center text-[260px] leading-none text-[#dfe4dd] sm:text-[320px]" dir="rtl">
          {letter}
        </div>
        <canvas
          ref={canvasRef}
          aria-label={`Tracing canvas for ${letter}`}
          className="absolute inset-0 size-full touch-none"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={stop}
          onPointerCancel={stop}
        />
        {!hasInk && (
          <div className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#77827b] shadow-sm">
            <PenLine className="size-4" /> Trace over the letter
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={clear} className="h-11 rounded-full px-5"><Eraser /> Clear</Button>
        <Button disabled={!hasInk} onClick={onComplete} className="h-11 rounded-full bg-[#173e33] px-6 text-white hover:bg-[#245849]"><Check /> Finish tracing</Button>
      </div>
    </div>
  );
}
