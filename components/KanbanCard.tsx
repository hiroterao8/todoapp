"use client";

import type { Card } from "@/types";

type Props = {
  card: Card;
  onClick: (card: Card) => void;
  onDragStart: (cardId: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, position: "above" | "below") => void;
  isDragging: boolean;
};

function formatDate(dateStr: string): string {
  // datetime-local format: "YYYY-MM-DDTHH:MM" or date-only "YYYY-MM-DD"
  const hasTime = dateStr.includes("T");
  const d = new Date(hasTime ? dateStr : dateStr + "T00:00:00");
  const month = d.getMonth() + 1;
  const day = d.getDate();
  if (hasTime) {
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${month}/${day} ${h}:${m}`;
  }
  return `${month}/${day}`;
}

function isOverdue(dateStr: string): boolean {
  const hasTime = dateStr.includes("T");
  const due = new Date(hasTime ? dateStr : dateStr + "T23:59:59");
  return due < new Date();
}

export function KanbanCard({ card, onClick, onDragStart, onDragEnd, onDragOver, isDragging }: Props) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(card.id);
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const position = e.clientY < rect.top + rect.height / 2 ? "above" : "below";
        onDragOver(e, position);
      }}
      onClick={() => onClick(card)}
      onKeyDown={(e) => e.key === "Enter" && onClick(card)}
      className={`bg-white rounded-lg border px-3 py-2.5 shadow-sm transition-all group
        cursor-grab active:cursor-grabbing select-none
        ${isDragging
          ? "opacity-40 scale-95 border-blue-300"
          : "border-slate-200 hover:shadow-md hover:border-slate-300"
        }`}
      role="button"
      tabIndex={0}
    >
      <p className="text-sm text-slate-700 leading-snug break-words group-hover:text-slate-900">
        {card.title}
      </p>

      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
        {card.dueDate && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded
              ${isOverdue(card.dueDate)
                ? "bg-rose-50 text-rose-600"
                : "bg-amber-50 text-amber-600"
              }`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(card.dueDate)}
          </span>
        )}
        {card.url && (
          <span className="inline-flex items-center gap-1 text-xs text-blue-400">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m3.878-3.878a4 4 0 015.656 0l1 1a4 4 0 11-5.656 5.656l-1.102-1.1" />
            </svg>
            Link
          </span>
        )}
      </div>
    </div>
  );
}
