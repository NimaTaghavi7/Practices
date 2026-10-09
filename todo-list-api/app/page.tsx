"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

type TrashTodo = {
  todo: Todo;
  deletedAt: string;
};

const API = "https://practice.amirm.me/todos";
const TRASH_KEY = "my-todos-trash";
const LOCKED_TODOS = [17, 22];
const EDIT_PASSWORD = "Nima@123";

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [trash, setTrash] = useState<TrashTodo[]>([]);
  const [view, setView] = useState<"active" | "trash">("active");

  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [permanentDeleteId, setPermanentDeleteId] = useState<number | null>(
    null,
  );

  const [passwordId, setPasswordId] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [unlockedIds, setUnlockedIds] = useState<number[]>([]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const completedTodos = todos.filter((todo) => todo.completed).length;

  const progress = todos.length
    ? Math.round((completedTodos / todos.length) * 100)
    : 0;

  const saveTrash = (items: TrashTodo[]) => {
    setTrash(items);

    try {
      localStorage.setItem(TRASH_KEY, JSON.stringify(items));
    } catch {
      setError("Could not save Trash in this browser.");
    }
  };

  const getTodos = async () => {
    try {
      const res = await fetch(API);

      if (!res.ok) throw new Error();

      const data = await res.json();
      setTodos(Array.isArray(data.data) ? data.data : []);
      setError("");
    } catch {
      setError("Failed to load todos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    try {
      setTrash(JSON.parse(localStorage.getItem(TRASH_KEY) || "[]"));
    } catch {
      setTrash([]);
    }

    getTodos();
  }, []);

  const request = async (url: string, method: string, body?: object) => {
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      if (!res.ok) throw new Error();

      setError("");
      await getTodos();

      return true;
    } catch {
      setError("Request failed. Please try again.");
      return false;
    }
  };

  const addTodo = async () => {
    if (!title.trim()) {
      setError("Todo title cannot be empty.");
      return;
    }

    if (busy) return;

    setBusy(true);

    try {
      if (await request(API, "POST", { title: title.trim() })) {
        setTitle("");
      }
    } finally {
      setBusy(false);
    }
  };

  const updateTodo = async (todo: Todo) => {
    if (!editTitle.trim()) {
      setError("Todo title cannot be empty.");
      return;
    }

    if (busy) return;

    setBusy(true);

    try {
      if (
        await request(`${API}/${todo.id}`, "PUT", {
          title: editTitle.trim(),
          completed: todo.completed,
        })
      ) {
        setEditId(null);
        setEditTitle("");
      }
    } finally {
      setBusy(false);
    }
  };

  const toggleStatus = async (todo: Todo) => {
    if (busy) return;

    setBusy(true);

    try {
      await request(`${API}/${todo.id}`, "PATCH", {
        completed: !todo.completed,
      });
    } finally {
      setBusy(false);
    }
  };

  const deleteTodo = async (id: number) => {
    const todo = todos.find((item) => item.id === id);

    if (!todo || busy) return;

    const previousTrash = trash;

    const nextTrash = [
      { todo, deletedAt: new Date().toISOString() },
      ...trash.filter((item) => item.todo.id !== id),
    ];

    saveTrash(nextTrash);
    setBusy(true);

    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error();

      setTodos((prev) => prev.filter((item) => item.id !== id));
      setDeleteId(null);
      setError("");
    } catch {
      saveTrash(previousTrash);
      setError("Could not delete task. It was not moved to Trash.");
    } finally {
      setBusy(false);
    }
  };

  const restoreTodo = async (item: TrashTodo) => {
    if (busy) return;

    setBusy(true);

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.todo.title,
          completed: item.todo.completed,
        }),
      });

      if (!res.ok) throw new Error();

      saveTrash(trash.filter((t) => t.todo.id !== item.todo.id));
      setError("");
      await getTodos();
    } catch {
      setError("Could not restore task. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const permanentlyDelete = (id: number) => {
    saveTrash(trash.filter((item) => item.todo.id !== id));
    setPermanentDeleteId(null);
    setError("");
  };

  const emptyTrash = () => {
    saveTrash([]);
    setPermanentDeleteId(null);
  };

  const isLocked = (id: number) =>
    LOCKED_TODOS.includes(id) && !unlockedIds.includes(id);

  const unlockTodo = (id: number) => {
    if (password !== EDIT_PASSWORD) {
      setError("Incorrect password.");
      return;
    }

    setUnlockedIds((prev) => [...prev, id]);
    setPasswordId(null);
    setPassword("");
    setError("");
  };

  const visibleTodos = view === "active" ? todos : [];

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="mb-3 text-sm font-semibold tracking-widest text-[#8875ed]">
            MY WORKSPACE
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My Todo List<span className="text-[#8875ed]"></span>
          </h1>

          <p className="mt-3 text-sm text-gray-400">
            Keep things simple. Get things done.
          </p>
        </header>

        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => {
              setView("active");
              setError("");
            }}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              view === "active"
                ? "bg-[#7866d5] text-white"
                : "border border-[#302b42] bg-[#111] text-gray-300 hover:border-[#8875ed]"
            }`}
          >
            Tasks ({todos.length})
          </button>

          <button
            onClick={() => {
              setView("trash");
              setError("");
            }}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
              view === "trash"
                ? "bg-[#7866d5] text-white"
                : "border border-[#302b42] bg-[#111] text-gray-300 hover:border-[#8875ed]"
            }`}
          >
            <span>Trash</span>

            <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">
              {trash.length}
            </span>
          </button>
        </div>

        {error && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-400">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="text-lg"
              aria-label="Close error"
            >
              ×
            </button>
          </div>
        )}

        {view === "active" && (
          <>
            <section className="mb-8 rounded-2xl border border-[#302b42] bg-[#111] p-4 sm:p-6">
              <label
                htmlFor="todo-title"
                className="mb-3 block text-sm font-semibold"
              >
                Add a new task
              </label>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addTodo();
                }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <input
                  id="todo-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="min-w-0 flex-1 rounded-xl border border-[#302b42] bg-[#181818] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-[#8875ed]"
                />

                <button
                  type="submit"
                  disabled={busy || !title.trim()}
                  className="rounded-xl bg-[#7866d5] px-6 py-3 text-sm font-semibold hover:bg-[#6653c4] disabled:opacity-50"
                >
                  {busy ? "Please wait..." : "+ Add task"}
                </button>
              </form>
            </section>

            <section className="mb-8 rounded-2xl border border-[#302b42] bg-[#111] p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Your Progress
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    {completedTodos} of {todos.length} tasks completed
                  </p>
                </div>

                <span className="text-2xl font-bold text-[#a99afc]">
                  {progress}%
                </span>
              </div>

              <div
                className="h-3 overflow-hidden rounded-full bg-[#282333]"
                role="progressbar"
                aria-label="Task completion progress"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-[#8875ed] transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-3 text-xs text-gray-500">
                {progress === 100
                  ? "All tasks completed. Great job!"
                  : progress === 0
                    ? "Let's get started!"
                    : "Keep going. You're making progress!"}
              </p>
            </section>

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">Your tasks</h2>

              <span className="rounded-full bg-[#211b35] px-3 py-1.5 text-xs font-semibold text-[#a99afc]">
                {todos.length} tasks
              </span>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[#302b42] bg-[#111] py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#302b42] border-t-[#8875ed]" />

                <p className="text-sm font-medium text-[#8875ed]">
                  Loading tasks...
                </p>
              </div>
            ) : visibleTodos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#383047] bg-[#111] px-5 py-16 text-center">
                <p className="font-semibold">No tasks yet</p>

                <p className="mt-2 text-sm text-gray-400">
                  Add your first task and get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {todos.map((todo) => (
                  <article
                    key={todo.id}
                    className="rounded-2xl border border-[#302b42] bg-[#111] p-5 transition hover:border-[#514477] hover:shadow-lg hover:shadow-[#7866d5]/5"
                  >
                    <div className="mb-5 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="mb-1 text-xs text-gray-500">
                          TASK #{todo.id}
                        </p>

                        <h3 className="break-words text-sm font-semibold leading-6">
                          {todo.title}
                        </h3>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          todo.completed
                            ? "bg-[#153324] text-[#6ee7a0]"
                            : "bg-[#211b35] text-[#a99afc]"
                        }`}
                      >
                        {todo.completed ? "Done" : "Pending"}
                      </span>
                    </div>

                    <div className="space-y-2 border-t border-[#282333] pt-4 text-xs text-gray-400">
                      <p className="break-words">
                        <span className="text-gray-200">Created:</span>{" "}
                        {todo.created_at}
                      </p>

                      <p className="break-words">
                        <span className="text-gray-200">Updated:</span>{" "}
                        {todo.updated_at}
                      </p>
                    </div>

                    {isLocked(todo.id) ? (
                      passwordId === todo.id ? (
                        <div className="mt-5 rounded-xl border border-[#383047] bg-[#181818] p-3">
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && unlockTodo(todo.id)
                            }
                            placeholder="Enter password"
                            className="w-full rounded-xl border border-[#302b42] bg-black px-3 py-2.5 text-sm outline-none focus:border-[#8875ed]"
                          />

                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => unlockTodo(todo.id)}
                              className="flex-1 rounded-xl bg-[#7866d5] px-3 py-2 text-xs font-semibold"
                            >
                              Unlock
                            </button>

                            <button
                              onClick={() => {
                                setPasswordId(null);
                                setPassword("");
                                setError("");
                              }}
                              className="rounded-xl border border-[#383047] px-3 py-2 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setPasswordId(todo.id);
                            setPassword("");
                            setError("");
                          }}
                          className="mt-5 w-full rounded-xl border border-orange-500/40 bg-orange-500/10 px-3 py-2.5 text-xs font-semibold text-orange-300 hover:bg-orange-500/20"
                        >
                          Locked · Unlock to manage
                        </button>
                      )
                    ) : (
                      <>
                        <div className="mt-5 grid grid-cols-3 gap-2">
                          <button
                            onClick={() => {
                              setEditId(todo.id);
                              setEditTitle(todo.title);
                              setError("");
                            }}
                            disabled={busy}
                            className="rounded-xl border border-[#383047] px-2 py-2.5 text-xs hover:border-[#8875ed] hover:bg-[#211b35] disabled:opacity-50"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => toggleStatus(todo)}
                            disabled={busy}
                            className="rounded-xl border border-[#383047] px-2 py-2.5 text-xs hover:border-[#8875ed] hover:bg-[#211b35] disabled:opacity-50"
                          >
                            Toggle
                          </button>

                          <button
                            onClick={() => setDeleteId(todo.id)}
                            disabled={busy}
                            className="rounded-xl border border-red-900/60 px-2 py-2.5 text-xs text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>

                        {editId === todo.id && (
                          <div className="mt-3 rounded-xl border border-[#383047] bg-[#181818] p-3">
                            <input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && updateTodo(todo)
                              }
                              placeholder="Enter new title"
                              className="w-full rounded-xl border border-[#302b42] bg-black px-3 py-2.5 text-sm outline-none focus:border-[#8875ed]"
                            />

                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={() => updateTodo(todo)}
                                disabled={busy}
                                className="rounded-xl bg-[#7866d5] px-4 py-2 text-xs font-semibold disabled:opacity-50"
                              >
                                Save
                              </button>

                              <button
                                onClick={() => {
                                  setEditId(null);
                                  setEditTitle("");
                                }}
                                className="rounded-xl border border-[#383047] px-4 py-2 text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {deleteId === todo.id && (
                          <div className="mt-3 rounded-xl border border-red-900/50 bg-red-950/20 p-3">
                            <p className="text-sm">Move this task to Trash?</p>

                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={() => deleteTodo(todo.id)}
                                disabled={busy}
                                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold hover:bg-red-500 disabled:opacity-50"
                              >
                                {busy ? "Moving..." : "Yes, move"}
                              </button>

                              <button
                                onClick={() => setDeleteId(null)}
                                className="rounded-xl border border-[#383047] px-4 py-2 text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {view === "trash" && (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Trash</h2>

                <p className="mt-1 text-sm text-gray-400">
                  Deleted tasks are stored in this browser.
                </p>
              </div>

              {trash.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm("Permanently remove all tasks from Trash?")) {
                      emptyTrash();
                    }
                  }}
                  className="rounded-xl border border-red-900/60 px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10"
                >
                  Empty Trash
                </button>
              )}
            </div>

            {trash.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#383047] bg-[#111] px-5 py-16 text-center">
                <p className="font-semibold">Trash is empty</p>

                <p className="mt-2 text-sm text-gray-400">
                  Deleted tasks will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {trash.map((item) => (
                  <article
                    key={`${item.todo.id}-${item.deletedAt}`}
                    className="rounded-2xl border border-[#302b42] bg-[#111] p-5 transition hover:border-[#514477]"
                  >
                    <div className="mb-5 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="mb-1 text-xs text-gray-500">
                          TASK #{item.todo.id}
                        </p>

                        <h3 className="break-words text-sm font-semibold leading-6">
                          {item.todo.title}
                        </h3>
                      </div>

                      <span className="shrink-0 rounded-full bg-[#211b35] px-2.5 py-1 text-[10px] font-semibold text-[#a99afc]">
                        {item.todo.completed ? "Done" : "Pending"}
                      </span>
                    </div>

                    <p className="border-t border-[#282333] pt-4 text-xs text-gray-400">
                      Deleted: {new Date(item.deletedAt).toLocaleString()}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => restoreTodo(item)}
                        disabled={busy}
                        className="rounded-xl bg-[#7866d5] px-3 py-2.5 text-xs font-semibold hover:bg-[#6653c4] disabled:opacity-50"
                      >
                        Restore
                      </button>

                      <button
                        onClick={() => setPermanentDeleteId(item.todo.id)}
                        className="rounded-xl border border-red-900/60 px-3 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10"
                      >
                        Delete forever
                      </button>
                    </div>

                    {permanentDeleteId === item.todo.id && (
                      <div className="mt-3 rounded-xl border border-red-900/50 bg-red-950/20 p-3">
                        <p className="text-sm">
                          Permanently delete this item from Trash?
                        </p>

                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => permanentlyDelete(item.todo.id)}
                            className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold hover:bg-red-500"
                          >
                            Confirm
                          </button>

                          <button
                            onClick={() => setPermanentDeleteId(null)}
                            className="rounded-xl border border-[#383047] px-3 py-2 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        <footer className="mt-10 text-center text-xs text-gray-500">
          Simple space. Clear mind. Better days.
        </footer>
      </div>
    </main>
  );
}
