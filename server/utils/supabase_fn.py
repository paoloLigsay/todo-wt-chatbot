from dotenv import load_dotenv
load_dotenv()

from supabase import create_client, Client
import os

# creating supabase client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
api_key: str = os.environ.get("OPENAI_API_KEY")
supabase: Client = create_client(url, key)

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

# SCIM
def get_groups():
    try:
        response = supabase.table("groups").select("*").order("id").execute()
        return response
    except Exception as e:
        raise RuntimeError(f"Error getting groups: {str(e)}")

def get_users():
    try:
        print("RUNNING")
        user_response = supabase.table("users").select("*").order("id").execute()
        print("user_response", user_response)
        return user_response
    except Exception as e:
        raise RuntimeError(f"Error getting users by ids: {str(e)}")

def get_users_by_ids(user_ids):
    try:
        response = supabase.table("users").select("*").in_("id", user_ids).order("id").execute()
        return response
    except Exception as e:
        raise RuntimeError(f"Error getting users by ids: {str(e)}")

def get_user_with_filter(column, filter):
    try:
        response = supabase.table("users").select("*").eq(column, filter).order("id").execute()
        return response
    except Exception as e:
        raise RuntimeError(f"Error getting users by ids: {str(e)}")

def get_users_by_username(username):
    try:
        response = supabase.table("users").select("*").eq("userName", username).order("id").execute()
        return response
    except Exception as e:
        raise RuntimeError(f"Error getting users by ids: {str(e)}")

def get_users_by_email(email):
    try:
        response = supabase.table("users").select("*").eq("email", email).order("id").execute()
        return response
    except Exception as e:
        raise RuntimeError(f"Error getting users by ids: {str(e)}")

def get_user_by_id(user_id):
    try:
        response = supabase.table("users").select("*").eq("id", user_id).execute()
        return response
    except Exception as e:
        raise RuntimeError(f"Error getting users by ids: {str(e)}")

def insert_user(user):
    try:
        response = supabase.table("users").insert(user).execute() 
        return response
    except Exception as e:
        raise RuntimeError(f"Error getting users by ids: {str(e)}")

def handle_user_active_status(id, is_active):
    try:
        response = supabase.table("users").update({ "active": is_active }).eq("id", id).execute() 
        return response
    except Exception as e:
        raise RuntimeError(f"Error getting users by ids: {str(e)}")