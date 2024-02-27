import { AddTodoModal } from '@/models/modal';
import { Button, Input, Modal } from 'antd';
import React, { useState } from 'react'

const AddTodoModal = ({ openModal, setOpenModal, setTodos }: AddTodoModal) => {
  const [todoName, setTodoName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleAddTodo = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8080/api/addtodo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: todoName
        }),
      })
      const { todos: todosFromAPI, error } = await res.json()
  
      if (error) {
        console.log(`Error encountered: ${error}`);
        return;
      }
  
      setTodos(todosFromAPI);
    } catch (e) {
      console.log(e);
    } finally {
      setOpenModal(false);
      setLoading(false);
    }
  }

  return (
    <Modal
      open={openModal}
      title="ADD TODO"
      onCancel={() => setOpenModal(false)}
      footer={[
        <Button
          key="link"
          href="https://google.com"
          type="primary"
          loading={loading}
          onClick={(e) => handleAddTodo(e)}
        >
          Add
        </Button>
      ]}
    >
      <p> add your new todo item. </p>
      <Input
        placeholder='Todo name...'
        value={todoName}
        onChange={(e) => setTodoName(e.target.value)}
        className='text-black'
      />
    </Modal>
  )
}

export default AddTodoModal