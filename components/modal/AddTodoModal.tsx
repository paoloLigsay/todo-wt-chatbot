import { AddTodoModal } from '@/models/modal';
import { Button, Input, Modal, message } from 'antd';
import React, { useState } from 'react'

const AddTodoModal = ({ openModal, setOpenModal, setTodos }: AddTodoModal) => {
  const [todoName, setTodoName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleAddTodo = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setLoading(true);
    e.preventDefault();

    if (todoName === "") {
      message.error("Todo name field is required.");
      setLoading(false);
      return;
    }

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
        console.error(`Error encountered: ${error}`);
        return;
      }
  
      setTodos(todosFromAPI);
      const emailResponse = await fetch('http://localhost:8080/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          todo: todoName
        }),
      })

      const { error: emailResponseError } = await emailResponse.json()
  
      if (emailResponseError) {
        console.error(`Error encountered: ${error}`);
        return;
      }

    } catch (e) {
      console.error(e);
    } finally {
      setOpenModal(false);
      setLoading(false);
    }
  }

  return (
    <Modal
      className='ant-modal-custom'
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
          className='mt-[16px] flex items-center justify-center py-[12px] px-[24px] bg-transparent border-[#64FFDA] text-white hover:!border-[#64FFDA] hover:!bg-[#64FFDA26] hover:!text-white'
        >
          Add
        </Button>
      ]}
    >
      <p> Add your new action item in the todo list. </p>
      <Input
        placeholder='Type your todo name here...'
        value={todoName}
        onChange={(e) => setTodoName(e.target.value)}
        className='text-black h-[40px]'
      />
    </Modal>
  )
}

export default AddTodoModal