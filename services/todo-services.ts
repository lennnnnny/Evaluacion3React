import api from '@/services/api';

export interface TodoPayload {
  title: string;
  completed?: boolean;
  location?: { latitude: number; longitude: number };
  photoUri?: string;
}

export interface TodoItem {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  location?: { latitude: number; longitude: number };
  photoUri?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetTodosResponse {
  success: boolean;
  data: TodoItem[];
  count: number;
}

export interface CreateTodoResponse {
  success: boolean;
  data: TodoItem;
}

export interface UpdateTodoResponse {
  success: boolean;
  data: TodoItem;
}

export interface DeleteTodoResponse {
  success: boolean;
  data: TodoItem;
  message: string;
}

export default function getTodoService() {
  async function getTodos(): Promise<GetTodosResponse> {
    return await api.get('/todos');
  }

  async function createTodo(payload: TodoPayload) {
    return await api.post('/todos', payload);
  }

  async function updateTodo(id: string, payload: TodoPayload) {
    return await api.put(`/todos/${id}`, payload);
  }

  async function patchTodo(id: string, payload: Partial<TodoPayload>) {
    return await api.patch(`/todos/${id}`, payload);
  }

  async function deleteTodo(id: string) {
    return await api.del(`/todos/${id}`);
  }

  return {
    getTodos,
    createTodo,
    updateTodo,
    patchTodo,
    deleteTodo,
  };
}
/*ejemplo body response get all
{
  "success": true,
  "data": [
    {
      "id": "Yx5PNLFF7tu1xSQdCSk8_",
      "userId": "fyeFisqiR1ohtTsNZxpC3",
      "title": "Comprar merca",
      "completed": false,
      "location": {
        "latitude": 90,
        "longitude": 180
      },
      "photoUri": "https://example.com/photo.jpg",
      "createdAt": "2025-12-13T06:55:55.333Z",
      "updatedAt": "2025-12-13T06:55:55.333Z"
    }
  ],
  "count": 1
}
*/
