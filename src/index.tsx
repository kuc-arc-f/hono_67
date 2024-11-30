import { Hono } from 'hono'
import { renderToString } from 'react-dom/server'
import { renderer } from './renderer'
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
//import { Todo } from './types/todo';

export interface Todo {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
}

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// バリデーションスキーマ
const todoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['pending', 'completed']).optional(),
});

// 全TODOの取得 (検索機能付き)
app.get('/api/todo8', async (c) => {
  const { search } = c.req.query();
  const db = c.env.DB;

  try {
    let query = 'SELECT * FROM todo8';
    const params: string[] = [];

    if (search) {
      query += ' WHERE title LIKE ? OR description LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';
    
    const todos = await db.prepare(query)
      .bind(...params)
      .all<Todo>();
console.log(todos.results)
    return c.json(todos.results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch todos' }, 500);
  }
});

// 単一TODOの取得
app.get('/api/todo8/:id', async (c) => {
  const id = c.req.param('id');
  const db = c.env.DB;

  try {
    const todo = await db.prepare('SELECT * FROM todo8 WHERE id = ?')
      .bind(id)
      .first<Todo>();

    if (!todo) {
      return c.json({ error: 'Todo not found' }, 404);
    }

    return c.json(todo);
  } catch (error) {
    return c.json({ error: 'Failed to fetch todo' }, 500);
  }
});

// TODOの作成
app.post('/api/todo8', zValidator('json', todoSchema), async (c) => {
  const data = c.req.valid('json');
  const db = c.env.DB;

  try {
    const result = await db.prepare(
      'INSERT INTO todo8 (title, description, status) VALUES (?, ?, ?)'
    )
      .bind(data.title, data.description || '', data.status || 'pending')
      .run();

    if (!result.success) {
      throw new Error('Failed to create todo');
    }

    //const todo = await db.prepare('SELECT * FROM todo8 WHERE id = ?')
    //  .bind(result.lastRowId)
    //  .first<Todo>();

    return c.json({}, 201);
    //return c.json(todo, 201);
  } catch (error) {
    console.log(error);
    return c.json({ error: 'Failed to create todo' }, 500);
  }
});

// TODOの更新
app.put('/api/todo8/:id', zValidator('json', todoSchema), async (c) => {
  const id = c.req.param('id');
  const data = c.req.valid('json');
  const db = c.env.DB;

  try {
    const result = await db.prepare(
      'UPDATE todo8 SET title = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    )
      .bind(data.title, data.description || '', data.status || 'pending', id)
      .run();

    if (!result.success) {
      return c.json({ error: 'Todo not found' }, 404);
    }

    const todo = await db.prepare('SELECT * FROM todo8 WHERE id = ?')
      .bind(id)
      .first<Todo>();

    return c.json(todo);
  } catch (error) {
    return c.json({ error: 'Failed to update todo' }, 500);
  }
});

// TODOの削除
app.delete('/api/todo8/:id', async (c) => {
  const id = c.req.param('id');
  const db = c.env.DB;

  try {
    const result = await db.prepare('DELETE FROM todo8 WHERE id = ?')
      .bind(id)
      .run();

    if (!result.success) {
      return c.json({ error: 'Todo not found' }, 404);
    }

    return c.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete todo' }, 500);
  }
});

//
// 全件取得 (検索機能付き)
app.get('/api/todo9', async (c) => {
  const { search } = c.req.query();
  const db = c.env.DB;

  try {
    let query = 'SELECT * FROM todo9';
    const params: string[] = [];

    if (search) {
      query += ' WHERE title LIKE ? OR content LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY createdAt DESC';
    
    const todos = await db.prepare(query).bind(...params).all();
    return c.json({ todos: todos.results });
  } catch (e) {
    return c.json({ error: 'Failed to fetch todos' }, 500);
  }
});

// 1件取得
app.get('/api/todo9/:id', async (c) => {
  const id = c.req.param('id');
  const db = c.env.DB;

  try {
    const todo = await db.prepare('SELECT * FROM todo9 WHERE id = ?').bind(id).first();
    if (!todo) {
      return c.json({ error: 'Todo not found' }, 404);
    }
    return c.json({ todo });
  } catch (e) {
    return c.json({ error: 'Failed to fetch todo' }, 500);
  }
});

// 新規作成
app.post('/api/todo9', async (c) => {
  const db = c.env.DB;

  try {
    const body = await c.req.json();
    //const parsedBody = todoSchema.parse(body);
    const parsedBody = body;
    console.log(body);
    const { results } = await db.prepare(`
      INSERT INTO todo9 (
        title, content, public, 
        foodOrange, foodApple, foodBanana,
        pubDate, qty1, qty2, qty3
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      parsedBody.title,
      parsedBody.content,
      parsedBody.public,
      parsedBody.foodOrange,
      parsedBody.foodApple,
      parsedBody.foodBanana,
      parsedBody.pubDate,
      parsedBody.qty1,
      parsedBody.qty2,
      parsedBody.qty3
    ).all();

    return c.json({ todo: results[0] }, 201);
  } catch (e) {
    console.log(e);
    return c.json({ error: 'Failed to create todo' }, 500);
  }
});

// 更新
app.put('/api/todo9/:id', async (c) => {
  const id = c.req.param('id');
  const db = c.env.DB;

  try {
    const body = await c.req.json();
    const parsedBody = todoSchema.parse(body);

    const { results } = await db.prepare(`
      UPDATE todo9 SET
        title = ?,
        content = ?,
        public = ?,
        foodOrange = ?,
        foodApple = ?,
        foodBanana = ?,
        pubDate = ?,
        qty1 = ?,
        qty2 = ?,
        qty3 = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
      RETURNING *
    `).bind(
      parsedBody.title,
      parsedBody.content,
      parsedBody.public,
      parsedBody.foodOrange,
      parsedBody.foodApple,
      parsedBody.foodBanana,
      parsedBody.pubDate,
      parsedBody.qty1,
      parsedBody.qty2,
      parsedBody.qty3,
      id
    ).all();

    if (results.length === 0) {
      return c.json({ error: 'Todo not found' }, 404);
    }

    return c.json({ todo: results[0] });
  } catch (e) {
    return c.json({ error: 'Failed to update todo' }, 500);
  }
});

// 削除
app.delete('/api/todo9/:id', async (c) => {
  const id = c.req.param('id');
  const db = c.env.DB;

  try {
    const { results } = await db.prepare('DELETE FROM todo9 WHERE id = ? RETURNING *').bind(id).all();
    
    if (results.length === 0) {
      return c.json({ error: 'Todo not found' }, 404);
    }

    return c.json({ message: 'Todo deleted successfully' });
  } catch (e) {
    return c.json({ error: 'Failed to delete todo' }, 500);
  }
});
//
app.get('*', (c) => {
  return c.html(
    renderToString(
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          {import.meta.env.PROD ? (
            <link href="/static/style.css" rel="stylesheet" />
          ) : null}
        </head>
        <body>
          <div id="app"></div>
          {import.meta.env.PROD ? (
            <script type="module" src="/static/client.js"></script>
          ) : (
            <script type="module" src="/src/client.tsx"></script>
          )}
        </body>
      </html>
    )
  )
})

export default app