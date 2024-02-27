import { Dispatch, SetStateAction } from "react";

export interface Todo {
  id: string;
  name: string;
}
  
export interface ListItem {
  todo: Todo;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setTodoToUpdate: Dispatch<SetStateAction<Todo>>;
  setOpenUpdateTodoModal: Dispatch<SetStateAction<boolean>>;
}
