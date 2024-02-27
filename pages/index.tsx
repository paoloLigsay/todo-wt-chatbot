import { Button } from 'antd';
import React, { useEffect, useState } from 'react'
import AddTodoModal from '../components/AddTodoModal';
import UpdateTodoModal from '@/components/UpdateTodoModal';
import { Todo } from '@/models/todo';
import ListItem from '@/components/ListItem';

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
          console.log(`Error encountered: ${error}`);
          return;
        }
  
        setTodos(todosFromAPI);
      } catch (e) {
        console.log(e);
      }
    }

    fetchData();
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: 'Say this is a test', // Your input data
          }),
        });
  
        if (response && response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let completeResponse = "";
    
            while (true) {
              const { done, value } = await reader.read();
    
              if (done) {
                console.log("DONE!");
                break;
              }
    
              const chunkValue = decoder.decode(value);
              completeResponse += chunkValue;
    
              // Update your state or perform any action with the chunk data
              console.log("response chunk: ", chunkValue);
            }
    
            // You can also use completeResponse after the stream is finished
            console.log("complete response: ", completeResponse);
        }
      } catch (e) {
        console.log(e);
      }
    };

  fetchData();
  }, []);

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
      {/* <Chatbot /> */}
    </div>
  )
}

export default index
