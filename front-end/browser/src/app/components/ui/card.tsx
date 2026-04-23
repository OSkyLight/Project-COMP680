import React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", children, ...props }: DivProps) {
  return (
    <div
      className={`rounded-xl border bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }: DivProps) {
  return (
    <div
      className={`flex items-start justify-between gap-4 p-4 pb-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...props }: DivProps) {
  return (
    <h3
      className={`text-lg font-semibold ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardAction({ className = "", children, ...props }: DivProps) {
  return (
    <div
      className={`ml-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className = "", children, ...props }: DivProps) {
  return (
    <div
      className={`p-4 pt-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}