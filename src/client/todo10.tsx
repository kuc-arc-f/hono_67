// src/types/todo.ts
import { z } from 'zod';

export const todoSchema = z.object({
  title: z.string().min(1, { message: "タイトルは必須です" }),
  content: z.string().min(1, { message: "内容は必須です" }),
  content_type: z.string().optional(),
  age: z.string().optional(),
  public: z.boolean(),
  food_orange: z.boolean(),
  food_apple: z.boolean(),
  food_banana: z.boolean(),
  food_melon: z.boolean(),
  food_grape: z.boolean(),
  date_publish: z.string().optional(),
  date_update: z.string().optional(),
  post_number: z.string().optional(),
  address_country: z.string().optional(),
  address_pref: z.string().optional(),
  address_city: z.string().optional(),
  address_1: z.string().optional(),
  address_2: z.string().optional(),
  address_3: z.string().optional(),
  text_option1: z.string().optional(),
  text_option2: z.string().optional(),
  text_option3: z.string().optional(),
});

export type Todo = z.infer<typeof todoSchema>;

// src/components/TodoList.tsx
import React, { useState, useEffect } from 'react';
//import { Todo, todoSchema } from '../types/todo';
import { TodoDialog } from './todo10/TodoDialog';
import Head from '../components/Head';

/*
*/
const initialData = {
  title: '',
  content: '',
  content_type: '',
  age: '',
  public: false,
  food_orange: false,
  food_apple: false,
  food_banana: false,
  food_melon: false,
  food_grape: false,
  date_publish: '',
  date_update: '',
  post_number: '',
  address_country: '',
  address_pref: '',
  address_city: '',
  address_1: '',
  address_2: '',
  address_3: '',
  text_option1: '',
  text_option2: '',
  text_option3: '',
};

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
 //const [formData, setFormData] = useState<Partial<Todo>>({
  const [formData, setFormData] = useState(initialData);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`/api/todo10?searchQuery=${searchQuery}`);
      const data = await response.json();
      console.log(data);
      setTodos(data.todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' || type === 'radio' ? checked : value
    }));
    //console.log(formData);
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    try {
      todoSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach(err => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
        console.error(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
console.log("handleSubmit.");
console.log(formData);

    try {
      const url = selectedTodo ? `/api/todo10/${selectedTodo.id}` : '/api/todo10';
      const method = selectedTodo ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchTodos();
        setIsDialogOpen(false);
        setSelectedTodo(null);
        setFormData(initialData);
      }
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setFormData(todo);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('本当に削除しますか？')) return;

    try {
      const response = await fetch(`/api/todo10/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
  <>
    <Head />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">todo10</h1>
      {/* 検索フォーム */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      {/* 新規作成ボタン */}
      <button
        onClick={() => {
          setSelectedTodo(null);
          setFormData(initialData);
          setIsDialogOpen(true);
        }}
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        新規作成
      </button>

      {/* TODOリスト */}
      <div className="grid gap-4">
        {todos.map((todo) => (
          <div key={todo.id} className="border p-4 rounded-lg">
            <h3 className="text-xl font-bold">{todo.title}</h3>
            <p>{todo.content}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleEdit(todo)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                編集
              </button>
              <button
                onClick={() => handleDelete(todo.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ダイアログ */}
      <TodoDialog 
      isOpen={isDialogOpen}
      onClose={null}
      onSubmit={handleSubmit}
      formData={formData}
      handleInputChange={handleInputChange}
      errors={errors}
      selectedTodo={selectedTodo}
      />
    </div>  
  </>

  )
}
export default TodoList;
/*
*/