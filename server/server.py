from dotenv import load_dotenv
load_dotenv()

import os
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from supabase import create_client, Client
from openai import OpenAI
import time
import sys

# creating supabase client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# app instance
app = Flask(__name__)
CORS(app)

api_key: str = os.environ.get("OPENAI_API_KEY")

@app.route('/api/generate', methods=['POST'])
def generate_chat():
  # Get id and name
  data = request.get_json()

  # Extract 'id' from the request data
  prompts = data.get('prompts')
  print("NEW PROMPT TEST: ", prompts)

  client = OpenAI()
  response = client.chat.completions.create(
      model="gpt-3.5-turbo",
      messages=prompts,
      stream=True,
  )

  def generate():
    for chunk in response:
        print(chunk)
        if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
            delta_content = chunk.choices[0].delta.content
            yield delta_content.encode('utf-8')
            sys.stdout.flush()
            time.sleep(0.05)

  return Response(generate(), content_type='text/plain;charset=utf-8')

# /api/todos: get chat
@app.route('/api/chat', methods=['GET'])
def return_chat():
    try:
      # Get todo items from supabase
      chat = supabase.table("chat").select("*").order("id").execute()
      return jsonify({
        'chat': chat.data if chat.data else []
      })
    except Exception as e:
      print(f"Error fetching data: {str(e)}")
      return jsonify({'error': 'Internal Server Error'})

# /api/todos: insert chat
@app.route('/api/addchat', methods=['POST'])
def return_addchat():
    try:
      # Get id and name
      data = request.get_json()

      # Extract 'role' and 'prompt' from the request data
      prompt = data.get('prompt')
      role = data.get('role')
      supabase.table("chat").insert({ "role": role, "content": prompt }).execute()

      # Get todo items from supabase
      chat = supabase.table("chat").select("*").order("id").execute()
      return jsonify({
        'chat': chat.data if chat.data else []
      })
    except Exception as e:
      print(f"Error fetching data: {str(e)}")
      return jsonify({'error': 'Internal Server Error'})

# /api/todos: get todos
@app.route('/api/todos', methods=['GET'])
def return_todos():
    try:
      # Get todo items from supabase
      todos = supabase.table("todos").select("id,name").order("id").execute()
      return jsonify({
        'todos': todos.data if todos.data else []
      })
    except Exception as e:
      print(f"Error fetching data: {str(e)}")
      return jsonify({'error': 'Internal Server Error'})

# /api/todos: update todos
@app.route('/api/updatetodo', methods=['PUT'])
def return_updatetodo():
    try:
      # Get id and name
      data = request.get_json()

      # Extract 'id' and 'name' from the request data
      todo_id = data.get('id')
      todo_name = data.get('name')
      print('TODO', todo_id, todo_name)

      # Update todo item
      supabase.table("todos").update({"name": todo_name}).eq("id", todo_id).execute()

      # Get latest todo items from supabase to return
      todos = supabase.table("todos").select("id,name").order("id").execute()

      return jsonify({
        'todos': todos.data if todos.data else []
      })
    except Exception as e:
      print(f"Error fetching data: {str(e)}")
      return jsonify({'error': 'Internal Server Error'})

# /api/todos: delete todo
@app.route('/api/deletetodo', methods=['DELETE'])
def return_deletetodo():
    try:
      # Get id and name
      data = request.get_json()

      # Extract 'id' from the request data
      todo_id = data.get('id')

      # Update todo item
      supabase.table("todos").delete().eq("id", todo_id).execute()

      # Get latest todo items from supabase to return
      todos = supabase.table("todos").select("id,name").order("id").execute()

      return jsonify({
        'todos': todos.data if todos.data else []
      })
    except Exception as e:
      print(f"Error fetching data: {str(e)}")
      return jsonify({'error': 'Internal Server Error'})

# /api/todos: add todo
@app.route('/api/addtodo', methods=['POST'])
def return_addtodo():
    try:
      # Get id and name  
      data = request.get_json()

      # Extract 'name' from the request data
      todo_name = data.get('name')

      # Add todo item
      supabase.table("todos").insert({"name": todo_name}).execute()

      # Get latest todo items from supabase to return
      todos = supabase.table("todos").select("id,name").order("id").execute()

      return jsonify({
        'todos': todos.data if todos.data else []
      })
    except Exception as e:
      print(f"Error fetching data: {str(e)}")
      return jsonify({'error': 'Internal Server Error'})

if __name__ == "__main__":
  app.run(debug=True, port=8080)
