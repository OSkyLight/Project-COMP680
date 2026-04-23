import React from "react";

type ScrollAreaProps = React.HTMLAttributes<HTMLDivElement>;

export function ScrollArea({ className = "", children, ...props }: ScrollAreaProps) {
  return (
    <div
      className={`overflow-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}