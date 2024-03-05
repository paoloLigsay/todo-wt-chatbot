import { Button } from 'antd';
import React, { useEffect, useState } from 'react'
import AddTodoModal from '../components/modal/AddTodoModal';
import UpdateTodoModal from '@/components/modal/UpdateTodoModal';
import { Todo } from '@/models/todo';
import ListItem from '@/components/ListItem';
import Chatbot from '@/components/chatbot/Chatbot';

function index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoToUpdate, setTodoToUpdate] = useState<Todo>({} as Todo);
  const [openAddTodoModal, setOpenAddTodoModal] = useState(false);
  const [openUpdateTodoModal, setOpenUpdateTodoModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/todos')
        const { todos: todosFromAPI, error } = await res.json()
  
        if (error) {
          console.error(`Error encountered: ${error}`);
          return;
        }
  
        setTodos(todosFromAPI);
      } catch (e) {
        console.error(e);
      }
    }

    fetchData();
  }, [])

  return (
    <div className='mx-auto mt-[120px] w-[60vw]'>
      <AddTodoModal
        openModal={openAddTodoModal}
        setOpenModal={setOpenAddTodoModal}
        setTodos={setTodos}
      />
      <UpdateTodoModal
        openUpdateTodoModal={openUpdateTodoModal}
        setOpenUpdateTodoModal={setOpenUpdateTodoModal}
        setTodos={setTodos}
        todoToUpdate={todoToUpdate}
      />
      <div className='flex justify-between'>
        <h1 className='text-2xl'> TODO LIST APP </h1>
        <Button
          className='flex items-center justify-center py-[12px] px-[24px] bg-transparent border-[#64FFDA] text-white hover:!border-[#64FFDA] hover:!bg-[#64FFDA26] hover:!text-white'
          onClick={() => setOpenAddTodoModal(true)}
        >
          ADD TODO
        </Button>
      </div>
      <ul className='mt-[64px]'>
        {todos.map((todo: Todo) => <ListItem key={todo.id} todo={todo} setTodos={setTodos} setTodoToUpdate={setTodoToUpdate} setOpenUpdateTodoModal={setOpenUpdateTodoModal} />)}
      </ul>
      <Chatbot todos={todos} />
    </div>
  )
}

export default index
