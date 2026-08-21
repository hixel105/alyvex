import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [orbs, setOrbs] = useState<
    { x: number; y: number; size: number; delay: number; color: string }[]
  >([]);

  useEffect(() => {
    const colors = [
      "rgba(139, 92, 246, 0.15)",
      "rgba(37, 99, 235, 0.15)",
      "rgba(6, 182, 212, 0.1)",
    ];
    const generated = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 200 + Math.random() * 300,
      delay: Math.random() * 6,
      color: colors[i % colors.length],
    }));
    setOrbs(generated);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Grid */}
      <div
        className="absolute inset-0 bg-grid-pattern"
        style={{ backgroundSize: "50px 50px" }}
      />

      {/* Orbs */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-3xl animate-float"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: orb.color,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}

      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary-900/20 to-transparent" />

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-secondary-900/20 to-transparent" />
    </div>
  );
}
