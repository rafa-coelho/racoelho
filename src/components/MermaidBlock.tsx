"use client";
import { useEffect, useRef, useState } from "react";

let mermaidInitialized = false;

export default function MermaidBlock({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const mermaid = (await import("mermaid")).default;
      if (!mermaidInitialized) {
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          fontFamily: "inherit",
        });
        mermaidInitialized = true;
      }

      try {
        const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
        const { svg: rendered } = await mermaid.render(id, code);
        if (!cancelled) setSvg(rendered);
      } catch {
        if (!cancelled) setSvg(`<pre class="text-red-400 text-sm">Erro ao renderizar diagrama Mermaid</pre>`);
      }
    })();

    return () => { cancelled = true; };
  }, [code]);

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center overflow-x-auto rounded-md bg-card/30 p-4 border border-white/10"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
