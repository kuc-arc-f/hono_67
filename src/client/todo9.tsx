// src/types.ts
export interface Todo {
    id: number;
    title: string;
    content: string;
    public: boolean;
    foodOrange: boolean;
    foodApple: boolean;
    foodBanana: boolean;
    pubDate: string;
    qty1: string;
    qty2: string;
    qty3: string;
    createdAt: string;
    updatedAt: string;
  }

// src/schema.ts
import { z } from 'zod';

export const todoSchema = z.object({
  title: z.string().min(1, { message: 'タイトルは必須です' }),
  content: z.string().min(1, { message: '内容は必須です' }),
  public: z.boolean(),
  foodOrange: z.boolean(),
  foodApple: z.boolean(),
  foodBanana: z.boolean(),
  pubDate: z.string(),
  qty1: z.string(),
  qty2: z.string(),
  qty3: z.string(),
});

export type TodoInput = z.infer<typeof todoSchema>;

// src/components/TodoDialog.tsx
import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
//import { todoSchema, type TodoInput } from '../schema';

interface TodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TodoInput) => void;
  initialData?: Partial<TodoInput>;
  title: string;
}

export function TodoDialog(
  { 
    isOpen, onClose, onSubmit, initialData, title , setIsDialogOpen 
  }: TodoDialogProps) 
{
  const [formData, setFormData] = useState<Partial<TodoInput>>(initialData || {
    title: '',
    content: '',
    public: false,
    foodOrange: false,
    foodApple: false,
    foodBanana: false,
    pubDate: '',
    qty1: '',
    qty2: '',
    qty3: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  console.log("isOpen=", isOpen);
  console.log(formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = todoSchema.parse(formData);
      onSubmit(validatedData);
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
            <DialogTitle>{title}</DialogTitle>            
        </DialogHeader>
        {/*
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        */}
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              {/* value={formData.title || ''} */}
              <label className="block mb-1">
                タイトル
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </label>
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            <div>
              <label className="block mb-1">
                内容
                <input
                  type="text"
                  name="content"
                  value={formData.content || ''}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </label>
              {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="public"
                  checked={formData.public === true}
                  onChange={() => setFormData(prev => ({ ...prev, public: true }))}
                  className="mr-2"
                />
                公開
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="public"
                  checked={formData.public === false}
                  onChange={() => setFormData(prev => ({ ...prev, public: false }))}
                  className="mr-2"
                />
                非公開
              </label>
            </div>

            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="foodOrange"
                  checked={formData.foodOrange || false}
                  onChange={handleChange}
                  className="mr-2"
                />
                オレンジ
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="foodApple"
                  checked={formData.foodApple || false}
                  onChange={handleChange}
                  className="mr-2"
                />
                りんご
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="foodBanana"
                  checked={formData.foodBanana || false}
                  onChange={handleChange}
                  className="mr-2"
                />
                バナナ
              </label>
            </div>

            <div>
              <label className="block mb-1">
                公開日
                <input
                  type="date"
                  name="pubDate"
                  value={formData.pubDate || ''}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-1">
                  数量1
                  <input
                    type="text"
                    name="qty1"
                    value={formData.qty1 || ''}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                </label>
              </div>
              <div>
                <label className="block mb-1">
                  数量2
                  <input
                    type="text"
                    name="qty2"
                    value={formData.qty2 || ''}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                </label>
              </div>
              <div>
                <label className="block mb-1">
                  数量3
                  <input
                    type="text"
                    name="qty3"
                    value={formData.qty3 || ''}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              {/* onClose setIsDialogOpen */}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// src/App.tsx
import { useState, useEffect } from 'react';
import type { Todo, TodoInput } from './types';
import Head from '../components/Head';
const API_URL = '/api';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/todo9${searchQuery ? `?search=${searchQuery}` : ''}`);
      const data = await response.json();
      setTodos(data.todos);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [searchQuery]);

  const handleCreate = async (data: TodoInput) => {
    try {
      console.log("#handleCreate");
      const response = await fetch(`${API_URL}/todo9`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const handleUpdate = async (data: TodoInput) => {
    if (!editingTodo) return;
    try {
      const response = await fetch(`${API_URL}/todo9/${editingTodo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        fetchTodos();
        setEditingTodo(null);
      }
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      const response = await fetch(`${API_URL}/todo9/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  return (
  <>
    <Head />
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">TODOリスト</h1>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
          className="w-full border rounded p-2"
        />
      </div>

      <div className="grid gap-4">
        {todos.map((todo) => (
          <div key={todo.id} className="border rounded p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{todo.title}</h3>
                <p className="text-gray-600">{todo.content}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <p>公開状態: {todo.public ? '公開' : '非公開'}</p>
                  <p>
                    フルーツ: 
                    {[
                      todo.foodOrange && 'オレンジ',
                      todo.foodApple && 'りんご',
                      todo.foodBanana && 'バナナ'
                    ].filter(Boolean).join(', ') || 'なし'}
                  </p>
                  <p>公開日: {todo.pubDate}</p>
                  <p>数量: {todo.qty1}, {todo.qty2}, {todo.qty3}</p>
                </div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setEditingTodo(todo);
                    setIsDialogOpen(true);
                  }}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="px-3 py-1 border rounded hover:bg-gray-100 text-red-500"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <TodoDialog
        isOpen={isDialogOpen}
        setIsDialogOpen= {setIsDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={editingTodo ? handleUpdate : handleCreate}
        initialData={editingTodo || undefined}
        title={editingTodo ? 'TODO編集' : 'TODO作成'}
      />      
    </div>
  
  </>
);
}
  