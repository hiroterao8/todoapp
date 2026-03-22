"use client";

import { useState, useMemo } from "react";
import type { Card, List } from "@/types";

type Props = {
  lists: List[];
  cards: Card[];
  onCardClick: (card: Card) => void;
};

const WEEKDAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"];

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function TimelineView({ lists, cards, onCardClick }: Props) {
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(new Date()));

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const weekDayStrings = useMemo(() => weekDays.map(toDateStr), [weekDays]);
  const todayStr = toDateStr(new Date());

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const lastDay = weekDays[6];
  const weekLabel =
    `${weekStart.getFullYear()}年 ${weekStart.getMonth() + 1}月${weekStart.getDate()}日` +
    ` 〜 ${lastDay.getMonth() + 1}月${lastDay.getDate()}日`;

  const unscheduledCards = useMemo(() => cards.filter((c) => !c.dueDate), [cards]);

  const getCardsForCell = (listId: string, dateStr: string): Card[] =>
    cards.filter((c) => c.listId === listId && c.dueDate === dateStr);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* 週ナビゲーション */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-slate-200 bg-white flex-shrink-0">
        <button
          onClick={prevWeek}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-medium text-slate-700 min-w-[240px] text-center">
          {weekLabel}
        </span>
        <button
          onClick={nextWeek}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          onClick={() => setWeekStart(getWeekStart(new Date()))}
          className="px-3 py-1.5 text-xs font-medium text-slate-500 border border-slate-200
                     hover:bg-slate-50 rounded-lg transition-colors"
        >
          今週
        </button>
      </div>

      {/* グリッド */}
      <div className="overflow-auto flex-1">
        <table className="w-full border-collapse table-fixed min-w-[860px]">
          <colgroup>
            <col style={{ width: "160px" }} />
            {weekDays.map((_, i) => <col key={i} />)}
          </colgroup>

          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-slate-200">
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 border-r border-slate-200 bg-white">
                リスト
              </th>
              {weekDays.map((day, i) => {
                const ds = weekDayStrings[i];
                const isToday = ds === todayStr;
                const isWeekend = i >= 5;
                return (
                  <th
                    key={ds}
                    className={`px-2 py-2.5 text-center text-xs font-semibold border-r border-slate-100
                      ${isToday ? "bg-blue-50" : isWeekend ? "bg-slate-50" : "bg-white"}`}
                  >
                    <span className={`block text-base font-bold leading-none mb-0.5
                      ${isToday ? "text-blue-600" : isWeekend ? "text-slate-400" : "text-slate-700"}`}>
                      {day.getDate()}
                    </span>
                    <span className={isWeekend ? "text-slate-400" : "text-slate-400"}>
                      {WEEKDAY_LABELS[i]}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {lists.map((list) => (
              <tr key={list.id} className="border-b border-slate-100">
                <td className="px-3 py-2.5 text-xs font-semibold text-slate-600 border-r border-slate-200
                               align-top sticky left-0 bg-white/95 backdrop-blur-sm whitespace-nowrap">
                  {list.name}
                </td>
                {weekDayStrings.map((ds, i) => {
                  const cellCards = getCardsForCell(list.id, ds);
                  const isToday = ds === todayStr;
                  const isWeekend = i >= 5;
                  return (
                    <td
                      key={ds}
                      className={`px-1.5 py-1.5 align-top border-r border-slate-100 min-h-[56px]
                        ${isToday ? "bg-blue-50/50" : isWeekend ? "bg-slate-50/50" : ""}`}
                    >
                      <div className="flex flex-col gap-1">
                        {cellCards.map((card) => (
                          <button
                            key={card.id}
                            onClick={() => onCardClick(card)}
                            title={card.title}
                            className="w-full text-left px-2 py-1 bg-white border border-slate-200
                                       rounded-lg text-xs text-slate-700 shadow-sm
                                       hover:shadow-md hover:border-blue-300 hover:text-blue-700
                                       transition-all truncate"
                          >
                            {card.title}
                            {card.url && (
                              <span className="ml-1 text-blue-300">↗</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* 未スケジュール */}
            {unscheduledCards.length > 0 && (
              <tr className="border-b border-slate-200">
                <td className="px-3 py-2.5 text-xs font-semibold text-amber-600 border-r border-slate-200
                               align-top sticky left-0 bg-amber-50/80 whitespace-nowrap">
                  未スケジュール
                </td>
                <td colSpan={7} className="px-3 py-2.5 align-top bg-amber-50/20">
                  <div className="flex flex-wrap gap-1.5">
                    {unscheduledCards.map((card) => (
                      <button
                        key={card.id}
                        onClick={() => onCardClick(card)}
                        title={card.title}
                        className="px-2.5 py-1 bg-white border border-amber-200 rounded-lg
                                   text-xs text-slate-600 shadow-sm hover:shadow-md
                                   hover:border-amber-400 transition-all max-w-[200px] truncate"
                      >
                        {card.title}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
