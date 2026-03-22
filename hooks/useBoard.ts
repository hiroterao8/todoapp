"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { BoardState, Card, List } from "@/types";

const INITIAL_STATE: BoardState = {
  lists: [
    { id: "list-1", name: "KEY MTG：全社" },
    { id: "list-2", name: "KEY MTG：田岡" },
    { id: "list-3", name: "KEY MTG：舘川" },
  ],
  cards: [],
};

export function useBoard() {
  const [state, setState] = useState<BoardState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstLoad = useRef(true);

  // 初回ロード時にAPIからデータを取得
  useEffect(() => {
    fetch("/api/board")
      .then((res) => res.json())
      .then((data: BoardState) => {
        setState(data);
        setHydrated(true);
      })
      .catch(() => {
        setHydrated(true);
      });
  }, []);

  // 状態が変わったらAPIに保存（デバウンス500ms）
  useEffect(() => {
    if (!hydrated) return;
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
    }, 500);
  }, [state, hydrated]);

  const addList = useCallback((name: string) => {
    const newList: List = { id: `list-${Date.now()}`, name };
    setState((prev) => ({ ...prev, lists: [...prev.lists, newList] }));
  }, []);

  const deleteList = useCallback((listId: string) => {
    setState((prev) => ({
      lists: prev.lists.filter((l) => l.id !== listId),
      cards: prev.cards.filter((c) => c.listId !== listId),
    }));
  }, []);

  const addCard = useCallback((listId: string, title: string) => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      title,
      dueDate: null,
      url: "",
      listId,
    };
    setState((prev) => ({ ...prev, cards: [...prev.cards, newCard] }));
  }, []);

  const updateCard = useCallback((updated: Card) => {
    setState((prev) => ({
      ...prev,
      cards: prev.cards.map((c) => (c.id === updated.id ? updated : c)),
    }));
  }, []);

  const deleteCard = useCallback((cardId: string) => {
    setState((prev) => ({
      ...prev,
      cards: prev.cards.filter((c) => c.id !== cardId),
    }));
  }, []);

  const reorderCard = useCallback(
    (cardId: string, toListId: string, targetCardId: string | null, insertAfter: boolean) => {
      setState((prev) => {
        const cards = [...prev.cards];
        const draggedIndex = cards.findIndex((c) => c.id === cardId);
        if (draggedIndex === -1) return prev;

        const draggedCard = { ...cards[draggedIndex], listId: toListId };
        cards.splice(draggedIndex, 1);

        if (targetCardId) {
          const targetIndex = cards.findIndex((c) => c.id === targetCardId);
          if (targetIndex !== -1) {
            cards.splice(insertAfter ? targetIndex + 1 : targetIndex, 0, draggedCard);
          } else {
            cards.push(draggedCard);
          }
        } else {
          cards.push(draggedCard);
        }

        return { ...prev, cards };
      });
    },
    []
  );

  return {
    lists: state.lists,
    cards: state.cards,
    hydrated,
    addList,
    deleteList,
    addCard,
    updateCard,
    deleteCard,
    reorderCard,
  };
}
