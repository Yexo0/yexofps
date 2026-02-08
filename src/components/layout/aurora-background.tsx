// src/components/layout/aurora-background.tsx
"use client";

import { useEffect, useState } from "react";

interface BlobData {
  size: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  duration: number;
}

export function AuroraBackground() {
  const [blobs, setBlobs] = useState<BlobData[]>([]);

  useEffect(() => {
    const generated: BlobData[] = Array.from({ length: 5 }, () => ({
      size: Math.random() * 450 + 550,
      x: Math.random() * 100,
      y: Math.random() * 100,
      dx: (Math.random() * 2 - 1) * 70,
      dy: (Math.random() * 2 - 1) * 60,
      duration: Math.random() * 10 + 16,
    }));
    setBlobs(generated);
  }, []);

  return (
    <div className="aurora-container">
      {blobs.map((blob, i) => (
        <div
          key={i}
          className="bg-blob"
          style={
            {
              "--s": `${blob.size}px`,
              "--x": `${blob.x}%`,
              "--y": `${blob.y}%`,
              "--dx": `${blob.dx}px`,
              "--dy": `${blob.dy}px`,
              "--d": `${blob.duration}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
