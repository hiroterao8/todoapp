"use client";

import { useState } from "react";
import type { Card, List } from "@/types";
import { KanbanCard } from "./KanbanCard";
import { AddCardForm } from "./AddCardForm";
import { AddListForm } from "./AddListForm";

type Props = {
  lists: List[];
  cards: Card[];
  onCardClick: (card: Card) => void;
  onAddCard: (listId: string, title: string) => void;
  onAddList: (name: string) => void;
  onDeleteList: (listId: string) => void;
  onMoveCard: (cardId: string, toListId: string) => void;
};

export function BoardView({ lists, cards, onCardClick, onAddCard, onAddList, onDeleteList, onMoveCard }: Props) {
  const [addingCardTo, setAddingCardTo] = useState<string | null>(null);
  const [addingList, setAddingList] = useState(false);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [dragOverListId, setDragOverListId] = useState<string | null>(null);

  const handleDrop = (listId: string) => {
    if (draggingCardId) {
      onMoveCard(draggingCardId, listId);
    }
    setDragOverListId(null);
    setDraggingCardId(null);
  };

  return (
    <div className="flex gap-4 items-start overflow-x-auto pb-6 px-6 pt-5 min-h-[calc(100vh-64px)]">
      {lists.map((list) => {
        const listCards = cards.filter((c) => c.listId === list.id);
        const isOver = dragOverListId === list.id;

        return (
          <div
            key={list.id}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              setDragOverListId(list.id);
            }}
            onDragLeave={(e) => {
              // 子要素へのleaveは無視する
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setDragOverListId(null);
              }
            }}
            onDrop={() => handleDrop(list.id)}
            className={`w-72 flex-shrink-0 rounded-xl p-3 flex flex-col gap-2 transition-colors
              ${isOver
                ? "bg-blue-100/80 ring-2 ring-blue-300"
                : "bg-slate-100/80"
              }`}
          >
            {/* リストヘッダー */}
            <div className="flex items-center justify-between px-1 mb-0.5">
              <h3 className="text-sm font-semibold text-slate-700">
                {list.name}
                <span className="ml-2 text-xs font-normal text-slate-400">{listCards.length}</span>
              </h3>
              <button
                onClick={() => {
                  if (confirm(`"${list.name}" を削除しますか？\nカードも全て削除されます。`)) {
                    onDeleteList(list.id);
                  }
                }}
                className="p-1 text-slate-300 hover:text-slate-500 hover:bg-slate-200 rounded transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* カード一覧 */}
            <div className="flex flex-col gap-2 min-h-[8px]">
              {listCards.map((card) => (
                <KanbanCard
                  key={card.id}
                  card={card}
                  onClick={onCardClick}
                  onDragStart={setDraggingCardId}
                  onDragEnd={() => {
                    setDraggingCardId(null);
                    setDragOverListId(null);
                  }}
                  isDragging={draggingCardId === card.id}
                />
              ))}
            </div>

            {/* ドロップヒント */}
            {isOver && draggingCardId && (
              <div className="h-10 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/50" />
            )}

            {/* カード追加 */}
            {addingCardTo === list.id ? (
              <AddCardForm
                listId={list.id}
                onAdd={(lid, title) => {
                  onAddCard(lid, title);
                  setAddingCardTo(null);
                }}
                onCancel={() => setAddingCardTo(null)}
              />
            ) : (
              <button
                onClick={() => setAddingCardTo(list.id)}
                className="flex items-center gap-1.5 w-full px-2 py-1.5 text-sm text-slate-500
                           hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors mt-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                カードを追加
              </button>
            )}
          </div>
        );
      })}

      {/* リスト追加 */}
      {addingList ? (
        <AddListForm
          onAdd={(name) => { onAddList(name); setAddingList(false); }}
          onCancel={() => setAddingList(false)}
        />
      ) : (
        <button
          onClick={() => setAddingList(true)}
          className="w-72 flex-shrink-0 flex items-center gap-2 px-4 py-3
                     bg-white/60 hover:bg-white/90 border border-slate-200 border-dashed
                     text-slate-500 hover:text-slate-700 text-sm font-medium
                     rounded-xl transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          リストを追加
        </button>
      )}
    </div>
  );
}
