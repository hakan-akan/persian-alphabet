'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, CircleCheck, Eraser, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Point = { x: number; y: number };
type TraceForm = { label: string; persianLabel: string; glyph: string };

export function TracingPad({ letter, forms, onComplete }: { letter: string; forms: TraceForm[]; onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<Point | null>(null);
  const [hasInk, setHasInk] = useState(false);
  const [activeForm, setActiveForm] = useState(0);
  const [completedForms, setCompletedForms] = useState<number[]>([]);
  const currentForm = forms[activeForm];

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
    setActiveForm(0);
    setCompletedForms([]);
  }, [letter]);

  useEffect(() => {
    prepare();
    setHasInk(false);
    const onResize = () => prepare();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [letter, activeForm]);

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

  const selectForm = (index: number) => {
    setActiveForm(index);
  };

  const finishForm = () => {
    const nextCompleted = completedForms.includes(activeForm)
      ? completedForms
      : [...completedForms, activeForm];
    setCompletedForms(nextCompleted);

    if (nextCompleted.length === forms.length) {
      onComplete();
      return;
    }

    const nextIndex = forms.findIndex((_, index) => !nextCompleted.includes(index));
    setActiveForm(nextIndex);
  };

  return (
    <div>
      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4" dir="ltr">
        {forms.map((form, index) => {
          const done = completedForms.includes(index);
          const active = index === activeForm;
          return (
            <button
              key={form.label}
              type="button"
              onClick={() => selectForm(index)}
              aria-pressed={active}
              className={`relative rounded-2xl border px-3 py-3 text-center transition ${active ? 'border-[#173e33] bg-[#173e33] shadow-md' : 'border-[#dfdbcf] bg-white hover:border-[#d49a50]'}`}
            >
              {done && <CircleCheck className={`absolute right-2 top-2 size-4 ${active ? 'text-[#f4c982]' : 'text-[#3f8066]'}`} />}
              <div className={`font-persian min-h-12 text-4xl font-bold ${active ? 'text-white' : 'text-[#173e33]'}`} dir="rtl">{form.glyph}</div>
              <p className={`mt-1 text-[10px] font-bold uppercase tracking-[.12em] ${active ? 'text-[#f4c982]' : 'text-[#707b74]'}`}>{form.label}</p>
              <p className={`font-persian text-[11px] ${active ? 'text-[#cce0d6]' : 'text-[#9b7a4d]'}`} dir="rtl">{form.persianLabel}</p>
            </button>
          );
        })}
      </div>

      <div className="mb-3 flex items-center justify-between text-xs font-semibold text-[#78837c]">
        <span>Tracing {currentForm.label.toLowerCase()} form</span>
        <span>{completedForms.length} of {forms.length} complete</span>
      </div>
      <div className="relative h-[360px] overflow-hidden rounded-[28px] border-2 border-dashed border-[#cbc8bc] bg-[#fbfaf6] sm:h-[410px]">
        <div className="font-persian pointer-events-none absolute inset-0 grid select-none place-items-center text-[260px] leading-none text-[#dfe4dd] sm:text-[320px]" dir="rtl">
          {currentForm.glyph}
        </div>
        <canvas
          ref={canvasRef}
          aria-label={`Tracing canvas for the ${currentForm.label.toLowerCase()} form of ${letter}`}
          className="absolute inset-0 size-full touch-none"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={stop}
          onPointerCancel={stop}
        />
        {!hasInk && (
          <div className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#77827b] shadow-sm">
            <PenLine className="size-4" /> Trace the {currentForm.label.toLowerCase()} form
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={clear} className="h-11 rounded-full px-5"><Eraser /> Clear</Button>
        <Button disabled={!hasInk} onClick={finishForm} className="h-11 rounded-full bg-[#173e33] px-6 text-white hover:bg-[#245849]"><Check /> {completedForms.length === forms.length - 1 && !completedForms.includes(activeForm) ? 'Finish letter' : 'Complete form'}</Button>
      </div>
    </div>
  );
}
