# utils/supabase.py
from supabase import create_client
import os

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

# TODOS
def get_todos():
    try:
        todos = supabase.table("todos").select("id", "name").order("id").execute()
        return todos.data if todos.data else []
    except Exception as e:
        raise RuntimeError(f"Error fetching todos: {str(e)}")

def add_todo(todo_name):
    try:
        supabase.table("todos").insert({"name": todo_name}).execute()
    except Exception as e:
        raise RuntimeError(f"Error adding todo: {str(e)}")

def update_todo(data):
    try:
        todo_id = data.get('id')
        todo_name = data.get('name')
        supabase.table("todos").update({"name": todo_name}).eq("id", todo_id).execute()
    except Exception as e:
        raise RuntimeError(f"Error updating todo: {str(e)}")

def delete_todo(todo_id):
    try:
        supabase.table("todos").delete().eq("id", todo_id).execute()
    except Exception as e:
        raise RuntimeError(f"Error deleting todo: {str(e)}")

# CHATS
def get_chat():
    try:
        chat = supabase.table("chat").select("*").order("id").execute()
        return chat.data if chat.data else []
    except Exception as e:
        raise RuntimeError(f"Error deleting todo: {str(e)}")

def add_chat(data):
    try:
        # Extract 'role' and 'prompt' from the request data
        prompt = data.get('prompt')
        role = data.get('role')
        supabase.table("chat").insert({ "role": role, "content": prompt }).execute()
    except Exception as e:
        raise RuntimeError(f"Error deleting todo: {str(e)}")
