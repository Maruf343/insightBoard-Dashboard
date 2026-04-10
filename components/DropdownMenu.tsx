'use client';

import { useEffect, useRef, useState } from 'react';

type DropdownItem = {
  id: string;
  label: string;
  onClick: () => void;
};

type DropdownMenuProps = {
  label: string;
  items: DropdownItem[];
};

export default function DropdownMenu({ label, items }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-full border border-panel bg-surface/95 px-4 py-2 text-sm font-semibold transition hover:bg-surface"
      >
        {label}
        <span className="text-muted">▾</span>
      </button>
      {open ? (
        <div className="absolute right-0 z-40 mt-2 w-48 overflow-hidden rounded-[28px] border border-panel bg-panel shadow-soft">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-sm transition hover:bg-surface/90"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
