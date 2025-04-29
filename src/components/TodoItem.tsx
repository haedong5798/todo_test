import { Todo } from '@/types/todo';
import { format } from 'date-fns';

interface TodoItemProps {
    todo: Todo;
    onToggleComplete: (id: string) => void;
    onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggleComplete, onDelete }: TodoItemProps) => {
    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-4">
            <div className="flex items-center space-x-4">
                <input
                    type="checkbox"
                    checked={todo.is_completed}
                    onChange={() => onToggleComplete(todo.id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div>
                    <h3 className={`text-lg font-medium ${todo.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {todo.title}
                    </h3>
                    {todo.description && (
                        <p className="text-gray-600 text-sm">{todo.description}</p>
                    )}
                    <div className="flex space-x-4 text-sm text-gray-500 mt-1">
                        {todo.due_date && (
                            <p>Due: {format(new Date(todo.due_date), 'PPP')}</p>
                        )}
                        <p>Created: {format(new Date(todo.created_at), 'PPP')}</p>
                    </div>
                </div>
            </div>
            <button
                onClick={() => onDelete(todo.id)}
                className="text-red-600 hover:text-red-800"
            >
                Delete
            </button>
        </div>
    );
}; 