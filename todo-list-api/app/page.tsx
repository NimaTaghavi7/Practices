"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

const Learn = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getTodos = async () => {
      setIsLoading(true);

      const response = await fetch("https://practice.amirm.me/todos");
      const data = await response.json();

      setTodos(data.data);
      setIsLoading(false);
    };

    getTodos();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>
          <p>title: {todo.title}</p>
          <p>completed: {todo.completed.toString()}</p>
          <p>created_at: {todo.created_at}</p>
          <p>updated_at: {todo.updated_at}</p>
        </div>
      ))}
    </div>
  );
};

export default Learn;