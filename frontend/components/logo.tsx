import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className = "h-6 w-6", ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Top trapezoid */}
      <polygon points="20,37 60,37 51,51 31,51" />
      {/* Middle diagonal */}
      <polygon points="31,51 45,51 70,78 56,78" />
      {/* Bottom-left block */}
      <polygon points="25,62 39,62 29,78 15,78" />
    </svg>
  );
}
