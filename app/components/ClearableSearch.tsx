"use client";

import * as React from "react";

type Props = {
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  onClear?: () => void;
  className?: string;
};

export default function ClearableSearch({
  value,
  placeholder = "Find 3-digit (e.g. 432)",
  onChange,
  onClear,
  className = "",
}: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange("");
    onClear?.();
    // keep focus in the input for quick typing
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const showClear = value.trim().length > 0;

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-[260px] rounded-md border border-yellow-500/70 bg-transparent px-3 py-2 text-sm text-white outline-none focus:ring-0 pr-10"
      />

      {/* Clear (×) white-ball button */}
      <button
        type="button"
        aria-label="Clear search"
        onClick={handleClear}
        className={`absolute right-1 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full bg-white text-black shadow-md h-6 w-6 font-bold leading-none transition-opacity ${
          showClear ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        title="Clear"
      >
        ×
      </button>
    </div>
  );
}
