// src/types/todo.ts
export interface Todo {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
}

// src/lib/validations.ts
import { z } from 'zod';

export const todoSchema = z.object({
  title: z.string().min(1, '必須項目です'),
  description: z.string().optional(),
  status: z.enum(['pending', 'completed']).default('pending'),
});

export type TodoFormData = z.infer<typeof todoSchema>;

// src/components/TodoDialog.tsx
import { useState , useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
//import { todoSchema, type TodoFormData } from '@/lib/validations';
import { Todo } from '@/types/todo';

interface TodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TodoFormData) => Promise<void>;
  todo?: Todo;
  mode: 'create' | 'edit';
}

export function TodoDialog({ 
  isOpen, onClose, onSubmit, todo, mode , idName
  }: TodoDialogProps) 
{
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<TodoFormData>({
    title: todo?.title ?? '',
    description: todo?.description ?? '',
    status: todo?.status ?? 'pending',
  });
console.log("idName=" , idName);
console.log("mode=" , mode);
//console.log(todo);
  useEffect(() => {
    if(mode === "edit"){
      setFormData({
        title: todo?.title,
        description: todo?.description,
        status: todo?.status,
      })
    }
  }, [todo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = todoSchema.parse(formData);
      await onSubmit(validatedData);
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            formattedErrors[err.path[0]] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
    }
  };

  const closeForm = function(){
    const dlg = document.getElementById(idName);
    if(dlg) {
      //@ts-ignore
      dlg.close();
    }
  }

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4">
            {mode === 'create' ? 'TODOを追加' : 'TODOを編集'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                タイトル
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border rounded-md p-2"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                説明
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded-md p-2 h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                ステータス
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'completed' })}
                className="w-full border rounded-md p-2"
              >
                <option value="pending">未完了</option>
                <option value="completed">完了</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={()=>closeForm()}
                className="px-4 py-2 border rounded-md"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {mode === 'create' ? '追加' : '更新'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// src/components/TodoList.tsx
import { useState , useEffect } from 'react';
import { Todo } from '@/types/todo';
import { TodoFormData } from '@/lib/validations';

const DIALOG_CREATE = "dialog_create";
const DIALOG_EDIT = "dialog_edit";
const API_BASE_URL = '/api';

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>();
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTodos();
  }, [searchQuery]);

  const fetchTodos = async () => {
    const response = await fetch(`${API_BASE_URL}/todo8${searchQuery ? `?query=${searchQuery}` : ''}`);
    const data = await response.json();
    setTodos(data);
  };

  const handleCreate = async (data: TodoFormData) => {
    await fetch(`${API_BASE_URL}/todo8`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    fetchTodos();
  };

  const handleUpdate = async (data: TodoFormData) => {
    if (!selectedTodo) return;
    await fetch(`${API_BASE_URL}/todo8/${selectedTodo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    fetchTodos();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return;
    await fetch(`${API_BASE_URL}/todo8/${id}`, {
      method: 'DELETE',
    });
    fetchTodos();
  };

  const openCreateDialog = () => {
    setSelectedTodo(undefined);
    setDialogMode('create');
    //setIsDialogOpen(true);
    const modalDialog = document.getElementById(DIALOG_CREATE);
    if(modalDialog) {
      modalDialog.showModal();
    }
  };

  const openEditDialog = (todo: Todo) => {
    setSelectedTodo(todo);
    setDialogMode('edit');
    //setIsDialogOpen(true);
    const modalDialog = document.getElementById(DIALOG_EDIT);
    if(modalDialog) {
      modalDialog.showModal();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">TODOリスト</h1>
        <button
          onClick={openCreateDialog}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          新規作成
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchTodos()}
          className="w-full border rounded-md p-2"
        />
      </div>

      <div className="space-y-4">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{todo.title}</h3>
              <p className="text-gray-600">{todo.description}</p>
              <span className={`text-sm ${
                todo.status === 'completed' ? 'text-green-500' : 'text-yellow-500'
              }`}>
                {todo.status === 'completed' ? '完了' : '未完了'}
              </span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => openEditDialog(todo)}
                className="px-3 py-1 border rounded-md hover:bg-gray-100"
              >
                編集
              </button>
              <button
                onClick={() => handleDelete(todo.id)}
                className="px-3 py-1 border rounded-md hover:bg-gray-100 text-red-500"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
      <dialog id={DIALOG_CREATE} className="dialog shadow-lg rounded-lg p-2">
        <TodoDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={dialogMode === 'create' ? handleCreate : handleUpdate}
          todo={selectedTodo}
          mode={dialogMode}
          idName={DIALOG_CREATE}
        />
      </dialog>
      {/* edit_dialog */}
      <dialog id={DIALOG_EDIT} className="dialog shadow-lg rounded-lg p-2">
        <TodoDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={dialogMode === 'create' ? handleCreate : handleUpdate}
          todo={selectedTodo}
          mode={dialogMode}
          idName={DIALOG_EDIT}
        />
      </dialog>

    </div>
  );
}
import Head from '../components/Head';
// src/App.tsx
export default function App() {
  return (
  <>
    <Head />
    <div className="min-h-screen bg-gray-50">
      <TodoList />
    </div>
  </>
  );
}
