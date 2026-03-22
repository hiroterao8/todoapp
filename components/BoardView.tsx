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
  onReorderCard: (cardId: string, toListId: string, targetCardId: string | null, insertAfter: boolean) => void;
};

type DropTarget = { cardId: string; position: "above" | "below" } | null;

export function BoardView({ lists, cards, onCardClick, onAddCard, onAddList, onDeleteList, onReorderCard }: Props) {
  const [addingCardTo, setAddingCardTo] = useState<string | null>(null);
  const [addingList, setAddingList] = useState(false);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [dragOverListId, setDragOverListId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget>(null);

  const handleDrop = (listId: string) => {
    if (!draggingCardId) return;
    if (dropTarget) {
      onReorderCard(draggingCardId, listId, dropTarget.cardId, dropTarget.position === "below");
    } else {
      onReorderCard(draggingCardId, listId, null, true);
    }
    setDragOverListId(null);
    setDraggingCardId(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDraggingCardId(null);
    setDragOverListId(null);
    setDropTarget(null);
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
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setDragOverListId(null);
                setDropTarget(null);
              }
            }}
            onDrop={() => handleDrop(list.id)}
            className={`w-72 flex-shrink-0 rounded-xl p-3 flex flex-col gap-1 transition-colors
              ${isOver ? "bg-blue-100/80 ring-2 ring-blue-300" : "bg-slate-100/80"}`}
          >
            {/* リストヘッダー */}
            <div className="flex items-center justify-between px-1 mb-1">
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
            <div className="flex flex-col min-h-[8px]">
              {listCards.map((card) => {
                const isAbove = dropTarget?.cardId === card.id && dropTarget.position === "above";
                const isBelow = dropTarget?.cardId === card.id && dropTarget.position === "below";
                return (
                  <div key={card.id}>
                    {/* 上のインジケーター */}
                    {isAbove && (
                      <div className="h-1 mx-1 mb-1 bg-blue-400 rounded-full" />
                    )}
                    <div className="mb-2">
                      <KanbanCard
                        card={card}
                        onClick={onCardClick}
                        onDragStart={setDraggingCardId}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e, position) => {
                          if (draggingCardId !== card.id) {
                            setDropTarget({ cardId: card.id, position });
                          }
                        }}
                        isDragging={draggingCardId === card.id}
                      />
                    </div>
                    {/* 下のインジケーター（最後のカードの下） */}
                    {isBelow && (
                      <div className="h-1 mx-1 mb-1 bg-blue-400 rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>

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
