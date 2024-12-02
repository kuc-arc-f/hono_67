// TodoDialog.tsx
import React from 'react';
import { Todo } from '../types/todo';

interface TodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: Partial<Todo>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
  selectedTodo: Todo | null;
}

export const TodoDialog: React.FC<TodoDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  handleInputChange,
  errors,
  selectedTodo,
}) => {
  if (!isOpen) return null;
console.log("#formData");
console.log(formData);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {selectedTodo ? 'TODO編集' : 'TODO作成'}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* タイトル */}
          <div>
            <label className="block mb-1">タイトル*</label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                errors.title ? 'border-red-500' : ''
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* 内容 */}
          <div>
            <label className="block mb-1">内容*</label>
            <input
              type="text"
              name="content"
              value={formData.content || ''}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                errors.content ? 'border-red-500' : ''
              }`}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content}</p>
            )}
          </div>

          {/* コンテンツタイプ */}
          <div>
            <label className="block mb-1">コンテンツタイプ</label>
            <input
              type="text"
              name="content_type"
              value={formData.content_type || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* 年齢 */}
          <div>
            <label className="block mb-1">年齢</label>
            <input
              type="text"
              name="age"
              value={formData.age || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* 公開設定 */}
          <div>
            <label className="flex items-center">
              <input
                type="radio"
                name="public"
                checked={formData.public}
                onChange={handleInputChange}
                className="mr-2"
              />
              公開
            </label>
          </div>

          {/* 食べ物チェックボックス */}
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="food_orange"
                checked={formData.food_orange}
                onChange={handleInputChange}
                className="mr-2"
              />
              オレンジ
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="food_apple"
                checked={formData.food_apple}
                onChange={handleInputChange}
                className="mr-2"
              />
              りんご
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="food_banana"
                checked={formData.food_banana}
                onChange={handleInputChange}
                className="mr-2"
              />
              バナナ
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="food_melon"
                checked={formData.food_melon}
                onChange={handleInputChange}
                className="mr-2"
              />
              メロン
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="food_grape"
                checked={formData.food_grape}
                onChange={handleInputChange}
                className="mr-2"
              />
              ぶどう
            </label>
          </div>

          {/* 日付 */}
          <div>
            <label className="block mb-1">公開日</label>
            <input
              type="date"
              name="date_publish"
              value={formData.date_publish || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">更新日</label>
            <input
              type="date"
              name="date_update"
              value={formData.date_update || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* 郵便番号 */}
          <div>
            <label className="block mb-1">郵便番号</label>
            <input
              type="text"
              name="post_number"
              value={formData.post_number || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* 住所 */}
          <div>
            <label className="block mb-1">国</label>
            <input
              type="text"
              name="address_country"
              value={formData.address_country || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">都道府県</label>
            <input
              type="text"
              name="address_pref"
              value={formData.address_pref || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">市区町村</label>
            <input
              type="text"
              name="address_city"
              value={formData.address_city || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">住所1</label>
            <input
              type="text"
              name="address_1"
              value={formData.address_1 || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">住所2</label>
            <input
              type="text"
              name="address_2"
              value={formData.address_2 || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">住所3</label>
            <input
              type="text"
              name="address_3"
              value={formData.address_3 || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* オプションテキスト */}
          <div>
            <label className="block mb-1">オプション1</label>
            <input
              type="text"
              name="text_option1"
              value={formData.text_option1 || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">オプション2</label>
            <input
              type="text"
              name="text_option2"
              value={formData.text_option2 || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">オプション3</label>
            <input
              type="text"
              name="text_option3"
              value={formData.text_option3 || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* ボタン */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {selectedTodo ? '更新' : '作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
