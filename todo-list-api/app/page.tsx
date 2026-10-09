"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

const API = "https://practice.amirm.me/todos";
const LOCKED_TODOS = [17, 22];
const EDIT_PASSWORD = "Nima@123";

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [passwordId, setPasswordId] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [unlockedIds, setUnlockedIds] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getTodos = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      if (!res.ok) throw new Error();
      setTodos(data.data);
      setError("");
    } catch {
      setError("Failed to load todos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const request = async (
    url: string,
    method: string,
    body?: object
  ) => {
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
    if (!title.trim()) return setError("Todo title cannot be empty.");
    if (await request(API, "POST", { title: title.trim() })) setTitle("");
  };

  const updateTodo = async (todo: Todo) => {
    if (!editTitle.trim()) return setError("Todo title cannot be empty.");
    if (await request(`${API}/${todo.id}`, "PUT", {
      title: editTitle.trim(),
      completed: todo.completed,
    })) {
      setEditId(null);
      setEditTitle("");
    }
  };

  const toggleStatus = (todo: Todo) =>
    request(`${API}/${todo.id}`, "PATCH", {
      completed: !todo.completed,
    });

  const deleteTodo = async (id: number) => {
    if (await request(`${API}/${id}`, "DELETE")) setDeleteId(null);
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

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <input
        className="m-5 rounded border border-gray-300 px-3 py-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter your todo"
      />
      <button onClick={addTodo} className="rounded border px-4 py-2">
        Add
      </button>

      {error && <p className="mx-5 mt-2 text-sm text-red-500">{error}</p>}

      <div className="m-5 mt-4 grid grid-cols-3 gap-4">
        {todos.map((todo) => (
          <div key={todo.id} className="border border-gray-300 p-4">
            <p>ID: #{todo.id}</p>
            <p>Title: {todo.title}</p>
            <p>Completed: {todo.completed.toString()}</p>
            <p>Created at: {todo.created_at}</p>
            <p>Updated at: {todo.updated_at}</p>

            {isLocked(todo.id) ? (
              passwordId === todo.id ? (
                <div className="mt-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && unlockTodo(todo.id)}
                    placeholder="Enter password"
                    className="w-full rounded border px-3 py-2"
                  />
                  <button onClick={() => unlockTodo(todo.id)} className="mt-2 rounded border px-3 py-1">
                    Unlock
                  </button>
                  <button onClick={() => { setPasswordId(null); setPassword(""); setError(""); }} className="ml-2 rounded border px-3 py-1">
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => { setPasswordId(todo.id); setPassword(""); setError(""); }} className="mt-2 rounded border border-orange-500 px-3 py-1">
                  Locked 🔒
                </button>
              )
            ) : (
              <>
                <button onClick={() => { setEditId(todo.id); setEditTitle(todo.title); setError(""); }} className="mt-2 mr-2 rounded border px-3 py-1">
                  Edit
                </button>
                <button onClick={() => toggleStatus(todo)} className="mt-2 mr-2 rounded border px-3 py-1">
                  Toggle Status
                </button>
                <button onClick={() => setDeleteId(todo.id)} className="mt-2 rounded border px-3 py-1">
                  Delete
                </button>

                {editId === todo.id && (
                  <div className="mt-3 border p-3">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Enter new title"
                      className="w-full rounded border px-3 py-2"
                    />
                    <button onClick={() => updateTodo(todo)} className="mt-2 rounded border px-3 py-1">
                      Save
                    </button>
                    <button onClick={() => { setEditId(null); setEditTitle(""); }} className="ml-2 rounded border px-3 py-1">
                      Cancel
                    </button>
                  </div>
                )}

                {deleteId === todo.id && (
                  <div className="mt-3 border p-3">
                    <p>Are you sure you want to delete this todo?</p>
                    <button onClick={() => deleteTodo(todo.id)} className="mt-2 rounded border border-red-500 px-3 py-1 text-red-500">
                      Yes, delete
                    </button>
                    <button onClick={() => setDeleteId(null)} className="ml-2 rounded border px-3 py-1">
                      Cancel
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

