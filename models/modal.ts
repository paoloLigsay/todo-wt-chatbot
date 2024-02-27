import { Todo } from "./todo";

export interface UpdateTodoModal {
  openUpdateTodoModal: boolean;
  setOpenUpdateTodoModal: React.Dispatch<React.SetStateAction<boolean>>;
  todoToUpdate: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export interface AddTodoModal {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}
