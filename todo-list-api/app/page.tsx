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
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");

  const getTodos = async () => {
    setIsLoading(true);

    const res = await fetch("https://practice.amirm.me/todos");
    const data = await res.json();

    setTodos(data.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const addTodo = async () => {
    await fetch("https://practice.amirm.me/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
      }),
    });

    setTitle("");
    getTodos();
  };

  const deleteTodo = async (id: number) => {
    const res = await fetch(`https://practice.amirm.me/todos/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      getTodos();
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter your todo"/>

      <button onClick={addTodo}>Add</button>

      {todos.map((todo) => (
        <div key={todo.id}>
          <p>title: {todo.title}</p>
          <p>completed: {todo.completed.toString()}</p>
          <p>created_at: {todo.created_at}</p>
          <p>updated_at: {todo.updated_at}</p>

          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Todos;