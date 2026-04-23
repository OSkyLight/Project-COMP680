import React from "react";

type SeparatorProps = React.HTMLAttributes<HTMLHRElement>;

export function Separator({ className = "", ...props }: SeparatorProps) {
  return (
    <hr
      className={`border-0 border-t my-4 ${className}`}
      {...props}
    />
  );
}