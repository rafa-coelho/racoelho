'use client';

// Barra de 3px logo abaixo do header (57px no mobile, 67px no desktop, com a borda).
export function ReadingProgress({ progress }: { progress: number }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-[57px] z-40 h-[3px] bg-rc-border md:top-[67px]">
      <div className="h-full origin-left bg-rc-blue" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}
