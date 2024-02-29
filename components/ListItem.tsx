import { ListItem } from "@/models/todo";
import { DeleteFilled, EditFilled, TagFilled } from "@ant-design/icons";

const ListItem = ({ todo, setTodos, setTodoToUpdate, setOpenUpdateTodoModal }: ListItem) => {
  const handleDelete = async () => {
    const res = await fetch('http://localhost:8080/api/deletetodo', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: todo.id,
      }),
    })

    const { todos: todosFromAPI, error } = await res.json()

    if (error) {
      console.error(`Error encountered: ${error}`);
      return;
    }

    setTodos(todosFromAPI);
  }

  const handleUpdateTodo = () => {
    setTodoToUpdate(todo);
    setOpenUpdateTodoModal(true)
  }

  return (
    <div className='w-full flex items-center justify-between px-[8px] py-[16px] hover:!bg-[#64FFDA0D] border-b hover:!border-[#64FFDA]'>
      <div className='flex items-center'>
        <TagFilled />
        <p className='ml-[16px] w-[calc(100% - 100px)] whitespace-nowrap text-ellipsis overflow-hidden'> {todo.name} </p>
      </div>
      <div className='flex'>
        <button className='mx-[8px] hover:rotate-[20deg] transition' onClick={handleUpdateTodo}>
          <EditFilled />
        </button>
        <button className='mx-[8px] hover:rotate-[20deg] transition' onClick={handleDelete}>
          <DeleteFilled />
        </button>
      </div>
    </div>
  )
}

export default ListItem
