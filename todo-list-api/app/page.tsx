"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getTodos = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("https://practice.amirm.me/todos");
      const data = await res.json();

      if (!res.ok) throw new Error();

      setTodos(data.data);
      setError("");
    } catch {
      setError("Failed to load todos.");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const addTodo = async () => {
    if (!title.trim()) {
      setError("Todo title cannot be empty.");
      return;
    }

    try {
      const res = await fetch("https://practice.amirm.me/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) throw new Error();

      setTitle("");
      getTodos();
    } catch {
      setError("Failed to add todo.");
    }
  };

  const updateTodo = async (id: number) => {
    if (!editTitle.trim()) {
      setError("Todo title cannot be empty.");
      return;
    }

    try {
      const todo = todos.find((item) => item.id === id);

      const res = await fetch(`https://practice.amirm.me/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          completed: todo?.completed,
        }),
      });

      if (!res.ok) throw new Error();

      setEditId(null);
      setEditTitle("");
      getTodos();
    } catch {
      setError("Failed to update todo.");
    }
  };

  const toggleStatus = async (todo: Todo) => {
    try {
      const res = await fetch(`https://practice.amirm.me/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!res.ok) throw new Error();

      getTodos();
    } catch {
      setError("Failed to change todo status.");
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const res = await fetch(`https://practice.amirm.me/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setDeleteId(null);
      getTodos();
    } catch {
      setError("Failed to delete todo.");
    }
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

      <button
        onClick={addTodo}
        className="ml-2 rounded border border-gray-300 px-4 py-2"
      >
        Add
      </button>

      {error && <p className="mx-5 mt-2 text-sm text-red-500">{error}</p>}

      <div className="m-5 mt-4 grid grid-cols-3 gap-4">
        {todos.map((todo) => (
          <div key={todo.id} className="border border-gray-300 p-4">
            {editId === todo.id ? (
              <div>
                <p>ID: #{todo.id}</p>

                <input
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Enter new title"
                />

                <button
                  onClick={() => updateTodo(todo.id)}
                  className="mt-2 rounded border border-gray-300 px-3 py-1"
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    setEditId(null);
                    setEditTitle("");
                  }}
                  className="ml-2 rounded border border-gray-300 px-3 py-1"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <p>ID: #{todo.id}</p>
                <p>Title: {todo.title}</p>
                <p>Completed: {todo.completed.toString()}</p>
                <p>Created at: {todo.created_at}</p>
                <p>Updated at: {todo.updated_at}</p>

                <button
                  onClick={() => {
                    setEditId(todo.id);
                    setEditTitle(todo.title);
                  }}
                  className="mt-2 mr-2 rounded border border-gray-300 px-3 py-1"
                >
                  Edit
                </button>

                <button
                  onClick={() => toggleStatus(todo)}
                  className="mt-2 mr-2 rounded border border-gray-300 px-3 py-1"
                >
                  Toggle Status
                </button>

                <button
                  onClick={() => setDeleteId(todo.id)}
                  className="mt-2 rounded border border-gray-300 px-3 py-1"
                >
                  Delete
                </button>

                {deleteId === todo.id && (
                  <div className="mt-3 border border-gray-300 p-3">
                    <p>Are you sure you want to delete this todo?</p>

                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="mt-2 rounded border border-red-500 px-3 py-1 text-red-500"
                    >
                      Yes, delete
                    </button>

                    <button
                      onClick={() => setDeleteId(null)}
                      className="ml-2 rounded border border-gray-300 px-3 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todos;
