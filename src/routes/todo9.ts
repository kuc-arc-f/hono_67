
// バリデーションスキーマ
const todoSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  public: z.boolean(),
  foodOrange: z.boolean(),
  foodApple: z.boolean(),
  foodBanana: z.boolean(),
  pubDate: z.string(),
  qty1: z.string(),
  qty2: z.string(),
  qty3: z.string(),
});
