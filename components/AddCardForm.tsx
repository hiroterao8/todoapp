"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  listId: string;
  onAdd: (listId: string, title: string) => void;
  onCancel: () => void;
};

export function AddCardForm({ listId, onAdd, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const t = title.trim();
    if (!t) return;
    onAdd(listId, t);
    setTitle("");
  };

  return (
    <div className="mt-1">
      <textarea
        ref={textareaRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            handleSubmit();
          }
          if (e.key === "Escape") onCancel();
        }}
        placeholder="カードのタイトルを入力..."
        rows={3}
        className="w-full px-3 py-2 text-sm text-slate-700 bg-white border border-slate-300
                   rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400
                   focus:border-transparent placeholder:text-slate-300"
      />
      <div className="mt-1.5 flex items-center gap-2">
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg
                     hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          追加
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
