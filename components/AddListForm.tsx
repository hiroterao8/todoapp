"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  onAdd: (name: string) => void;
  onCancel: () => void;
};

export function AddListForm({ onAdd, onCancel }: Props) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const n = name.trim();
    if (!n) return;
    onAdd(n);
    setName("");
  };

  return (
    <div className="w-72 flex-shrink-0 bg-slate-100 rounded-xl p-3">
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.nativeEvent.isComposing) handleSubmit();
          if (e.key === "Escape") onCancel();
        }}
        placeholder="リスト名を入力..."
        className="w-full px-3 py-2 text-sm text-slate-700 bg-white border border-slate-300
                   rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg
                     hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          リストを追加
        </button>
        <button
          onClick={onCancel}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
