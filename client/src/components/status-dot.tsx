import React from "react";

type StatusDotProps = {
  color?: string;
  pulse?: boolean;
};

export function StatusDot({ color = "#22c55e", pulse = true }: StatusDotProps) {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className={`absolute inline-flex h-full w-full rounded-full ${
          pulse ? "animate-ping" : ""
        } opacity-75`}
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex rounded-full h-2 w-2"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

export default StatusDot;
