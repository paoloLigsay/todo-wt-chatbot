from openai import OpenAI
from flask import Blueprint, jsonify, request, Response
from utils.supabase import get_chat, add_chat
import sys, time

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/api/generate', methods=['POST'])
def generate_chat():
  data = request.get_json()
  prompts = data.get('prompts')

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
@chat_bp.route('/api/chat', methods=['GET'])
def return_chat():
    try:
      # Get todo items from supabase
      chat = get_chat()
      return jsonify({
        'chat': chat if chat else []
      })
    except Exception as e:
      print(f"Error fetching data: {str(e)}")
      return jsonify({'error': 'Internal Server Error'})

# /api/todos: insert chat
@chat_bp.route('/api/addchat', methods=['POST'])
def return_addchat():
    try:
      # add chat to supabase
      data = request.get_json()
      add_chat(data)
      # Get todo items from supabase
      chat = get_chat()
      return jsonify({
        'chat': chat if chat else []
      })
    except Exception as e:
      print(f"Error fetching data: {str(e)}")
      return jsonify({'error': 'Internal Server Error'})