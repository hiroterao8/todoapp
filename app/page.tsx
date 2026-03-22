"use client";

import { useState, useRef } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text, completed: false },
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <main className="min-h-screen flex items-start justify-center pt-16 pb-16 px-4">
      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            やること
          </h1>
          {todos.length > 0 && (
            <p className="mt-1 text-sm text-slate-400">
              残り{" "}
              <span className="font-semibold text-slate-500">{remaining}</span>{" "}
              件
            </p>
          )}
        </div>

        {/* 入力エリア */}
        <div className="flex gap-2 mb-6">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && addTodo()}
            placeholder="タスクを入力..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition"
          />
          <button
            onClick={addTodo}
            disabled={!input.trim()}
            className="px-5 py-3 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            追加
          </button>
        </div>

        {/* タスクリスト */}
        {todos.length === 0 ? (
          <div className="text-center py-16 text-slate-300">
            <div className="text-4xl mb-3">✓</div>
            <p className="text-sm">タスクがありません</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-white border transition-all ${
                  todo.completed
                    ? "border-slate-100 opacity-50"
                    : "border-slate-200 shadow-sm"
                }`}
              >
                {/* チェックボックス */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    todo.completed
                      ? "bg-emerald-400 border-emerald-400"
                      : "border-slate-300 hover:border-emerald-400"
                  }`}
                  aria-label={todo.completed ? "未完了に戻す" : "完了にする"}
                >
                  {todo.completed && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>

                {/* テキスト */}
                <span
                  className={`flex-1 text-sm leading-relaxed ${
                    todo.completed
                      ? "line-through text-slate-400"
                      : "text-slate-700"
                  }`}
                >
                  {todo.text}
                </span>

                {/* 削除ボタン */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-400 hover:bg-rose-50 transition-all"
                  aria-label="削除"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* 完了タスクを一括削除 */}
        {todos.some((t) => t.completed) && (
          <button
            onClick={() => setTodos((prev) => prev.filter((t) => !t.completed))}
            className="mt-4 w-full py-2 text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            完了済みをすべて削除
          </button>
        )}
      </div>
    </main>
  );
}
