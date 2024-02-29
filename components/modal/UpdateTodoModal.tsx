import { UpdateTodoModal } from "@/models/modal";
import { Button, Input, Modal } from "antd";
import { useEffect, useState } from "react";

const UpdateTodoModal = ({ openUpdateTodoModal, setOpenUpdateTodoModal, todoToUpdate, setTodos }: UpdateTodoModal) => {
  const [todoName, setTodoName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Used this to make sure we set the default value of the input.
  // Adding it directly to useState declaration above does not get the updated todoToUpdate.
  useEffect(() => {
    setTodoName(todoToUpdate.name);
  }, [todoToUpdate.name])

  const handleUpdateTodo = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setLoading(true);
    e.preventDefault();
  
    if (todoName === "") {
      console.error("Error: Name Field Required.");
      setLoading(false);
      return;
    }

    const res = await fetch('http://localhost:8080/api/updatetodo', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: todoToUpdate.id, name: todoName }),
    })

    const { todos: todosFromAPI, error } = await res.json()

    if (error) {
      console.error(`Error encountered: ${error}`);
      return;
    }

    setLoading(false);
    setTodos(todosFromAPI);
    setOpenUpdateTodoModal(false);
  }

  return (
    <Modal
      className='ant-modal-custom'
      open={openUpdateTodoModal}
      title="UPDATE TODO"
      onCancel={() => setOpenUpdateTodoModal(false)}
      footer={[
        <Button
          key="link"
          href="https://google.com"
          type="primary"
          loading={loading}
          onClick={(e) => handleUpdateTodo(e)}
          className='mt-[16px] flex items-center justify-center py-[12px] px-[24px] bg-transparent border-[#64FFDA] text-white hover:!border-[#64FFDA] hover:!bg-[#64FFDA26] hover:!text-white'
        >
          Update
        </Button>
      ]}
    >
      <p> Update your todo item in the todo list. </p>
      <Input
        placeholder='Todo name...'
        value={todoName}
        onChange={(e) => setTodoName(e.target.value)}
        className='text-black h-[40px]'
      />
    </Modal>
  )
}

export default UpdateTodoModal
