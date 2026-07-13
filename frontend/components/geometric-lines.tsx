import React from "react";

interface GeometricLinesProps {
  className?: string;
}

export function GeometricLines({ className = "" }: GeometricLinesProps) {
  const starPath = "M 500,50 L 620,380 L 970,380 L 680,600 L 790,930 L 500,740 L 210,930 L 320,600 L 30,380 L 380,380 Z";

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 1000 1000"
        className="w-full h-full opacity-60 dark:opacity-40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lines-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Large Background Star Outline */}
        <g transform="translate(-150, -150) scale(1.3) rotate(35, 500, 500)">
          <path
            d={starPath}
            fill="none"
            stroke="url(#lines-gradient)"
            strokeWidth="1.2"
          />
        </g>

        {/* Medium Floating Star Outline */}
        <g transform="translate(350, 50) scale(0.7) rotate(-20, 500, 500)">
          <path
            d={starPath}
            fill="none"
            stroke="url(#lines-gradient)"
            strokeWidth="1.5"
          />
        </g>

        {/* Small Left Star Outline */}
        <g transform="translate(-100, 400) scale(0.55) rotate(15, 500, 500)">
          <path
            d={starPath}
            fill="none"
            stroke="url(#lines-gradient)"
            strokeWidth="1.5"
          />
        </g>

        {/* Medium Bottom Star Outline */}
        <g transform="translate(100, 500) scale(0.8) rotate(45, 500, 500)">
          <path
            d={starPath}
            fill="none"
            stroke="url(#lines-gradient)"
            strokeWidth="1.2"
          />
        </g>
      </svg>
    </div>
  );
}
