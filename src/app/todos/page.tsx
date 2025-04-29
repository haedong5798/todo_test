'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function TodosPage() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        checkUser();
        fetchTodos();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/');
            return;
        }
        setUser(user);
    };

    const fetchTodos = async () => {
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching todos:', error);
            return;
        }

        setTodos(data || []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        const { error } = await supabase
            .from('todos')
            .insert([
                {
                    content: newTodo,
                    user_id: user.id,
                    is_completed: false
                }
            ]);

        if (error) {
            console.error('Error creating todo:', error);
            return;
        }

        setNewTodo('');
        fetchTodos();
    };

    const toggleTodo = async (id, is_completed) => {
        const { error } = await supabase
            .from('todos')
            .update({ is_completed: !is_completed })
            .eq('id', id);

        if (error) {
            console.error('Error updating todo:', error);
            return;
        }

        fetchTodos();
    };

    const deleteTodo = async (id) => {
        const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting todo:', error);
            return;
        }

        fetchTodos();
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">할 일 목록</h1>
                <button
                    onClick={() => supabase.auth.signOut()}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    로그아웃
                </button>
            </div>

            <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="새로운 할 일을 입력하세요..."
                        className="flex-1 p-2 border rounded-md"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        추가
                    </button>
                </div>
            </form>

            <div className="space-y-2">
                {todos.map((todo) => (
                    <div
                        key={todo.id}
                        className="flex items-center justify-between p-4 bg-white border rounded-lg"
                    >
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={todo.is_completed}
                                onChange={() => toggleTodo(todo.id, todo.is_completed)}
                                className="w-5 h-5"
                            />
                            <span className={todo.is_completed ? 'line-through text-gray-500' : ''}>
                                {todo.content}
                            </span>
                        </div>
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            className="px-3 py-1 text-red-500 hover:text-red-700"
                        >
                            삭제
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
} 