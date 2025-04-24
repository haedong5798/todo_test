'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export default function Todo() {
  const { data: session } = useSession();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchTodos();
    }
  }, [session]);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodo }),
      });

      if (response.ok) {
        const todo = await response.json();
        setTodos([...todos, todo]);
        setNewTodo('');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, completed: !completed }),
      });

      if (response.ok) {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !completed } : todo
          )
        );
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to manage your todos.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Todo List</h1>
      
      <form onSubmit={addTodo} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
      </form>

      <ul className="space-y-3">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 p-4 bg-white rounded-lg shadow"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, todo.completed)}
              className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span
              className={`flex-1 ${
                todo.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-600 focus:outline-none"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 