import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300 ${className}`}
      {...props}
    />
  );
}