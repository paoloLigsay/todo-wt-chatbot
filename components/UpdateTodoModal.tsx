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
      console.log(`Error encountered: ${error}`);
      return;
    }

    setLoading(false);
    setTodos(todosFromAPI);
    setOpenUpdateTodoModal(false);
  }

  return (
    <Modal
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
        >
          Update
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

export default UpdateTodoModal
