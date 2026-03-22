"use client";

import { useState } from "react";
import type { Card, ViewMode } from "@/types";
import { useBoard } from "@/hooks/useBoard";
import { BoardView } from "@/components/BoardView";
import { TimelineView } from "@/components/TimelineView";
import { CardModal } from "@/components/CardModal";

export default function Home() {
  const { lists, cards, hydrated, addList, deleteList, addCard, updateCard, deleteCard } = useBoard();
  const [view, setView] = useState<ViewMode>("board");
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-sm text-slate-400">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* ナビゲーション */}
      <header className="h-16 bg-blue-700 flex items-center px-6 gap-4 shadow-md flex-shrink-0">
        <h1 className="text-white font-bold text-lg tracking-tight mr-2">
          プロジェクトボード
        </h1>

        {/* ビュー切り替え */}
        <div className="flex items-center gap-1 bg-blue-800/50 rounded-lg p-1">
          <button
            onClick={() => setView("board")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
              ${view === "board"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-blue-100 hover:text-white hover:bg-blue-700/50"
              }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            ボード
          </button>
          <button
            onClick={() => setView("timeline")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
              ${view === "timeline"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-blue-100 hover:text-white hover:bg-blue-700/50"
              }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            タイムライン
          </button>
        </div>
      </header>

      {/* メイン */}
      <main className="flex-1 overflow-hidden">
        {view === "board" ? (
          <BoardView
            lists={lists}
            cards={cards}
            onCardClick={setEditingCard}
            onAddCard={addCard}
            onAddList={addList}
            onDeleteList={deleteList}
          />
        ) : (
          <TimelineView
            lists={lists}
            cards={cards}
            onCardClick={setEditingCard}
          />
        )}
      </main>

      {/* カード編集モーダル */}
      {editingCard && (
        <CardModal
          card={editingCard}
          lists={lists}
          onSave={updateCard}
          onDelete={deleteCard}
          onClose={() => setEditingCard(null)}
        />
      )}
    </div>
  );
}
