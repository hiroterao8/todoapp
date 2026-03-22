"use client";

import { useState, useEffect, useRef } from "react";
import type { Card, List } from "@/types";

type Props = {
  card: Card;
  lists: List[];
  onSave: (updated: Card) => void;
  onDelete: (cardId: string) => void;
  onClose: () => void;
};

export function CardModal({ card, lists, onSave, onDelete, onClose }: Props) {
  const [title, setTitle] = useState(card.title);
  const [dueDate, setDueDate] = useState(card.dueDate ?? "");
  const [url, setUrl] = useState(card.url);
  const overlayRef = useRef<HTMLDivElement>(null);

  const listName = lists.find((l) => l.id === card.listId)?.name ?? "";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSave = () => {
    const t = title.trim();
    if (!t) return;
    onSave({ ...card, title: t, dueDate: dueDate || null, url: url.trim() });
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`"${card.title}" を削除しますか？`)) {
      onDelete(card.id);
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* ヘッダー */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">
                {listName}
              </p>
              <h2 className="text-lg font-semibold text-slate-800">カードを編集</h2>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* フォーム */}
        <div className="px-6 py-5 space-y-5">
          {/* タイトル */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              タイトル
            </label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200
                         rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400
                         focus:border-transparent focus:bg-white transition-colors"
            />
          </div>

          {/* 期限日時 */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              期限日時
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200
                         rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400
                         focus:border-transparent focus:bg-white transition-colors"
            />
            {dueDate && (
              <button
                onClick={() => setDueDate("")}
                className="mt-1 text-xs text-slate-400 hover:text-rose-400 transition-colors"
              >
                期限日時を削除
              </button>
            )}
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              URL（Google Docなど）
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://docs.google.com/..."
              className="w-full px-3 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200
                         rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400
                         focus:border-transparent focus:bg-white transition-colors placeholder:text-slate-300"
            />
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                ドキュメントを開く
              </a>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="px-6 pb-5 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="px-3 py-2 text-sm text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
          >
            削除
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg
                         hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
