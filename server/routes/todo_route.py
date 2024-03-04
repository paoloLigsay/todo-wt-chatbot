# todo_routes.py
from flask import Blueprint, jsonify, request
from utils.supabase import get_todos, update_todo, delete_todo, add_todo

todo_bp = Blueprint('todos', __name__)

@todo_bp.route('/api/todos', methods=['GET'])
def return_todos():
    try:
        todos_data = get_todos()
        return jsonify({'todos': todos_data if todos_data else []})
    except Exception as e:
        return jsonify({'error': 'Internal Server Error'}), 500

@todo_bp.route('/api/updatetodo', methods=['PUT'])
def return_updatetodo():
    try:
        data = request.get_json()
        update_todo(data)
        todos_data = get_todos()
        return jsonify({'todos': todos_data if todos_data else []})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@todo_bp.route('/api/deletetodo', methods=['DELETE'])
def return_deletetodo():
    try:
        data = request.get_json()
        todo_id = data.get('id')
        delete_todo(todo_id)
        todos_data = get_todos()
        return jsonify({'todos': todos_data if todos_data else []})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@todo_bp.route('/api/addtodo', methods=['POST'])
def return_addtodo():
    try:
        data = request.get_json()
        todo_name = data.get('name')
        add_todo(todo_name)
        todos_data = get_todos()
        return jsonify({'todos': todos_data if todos_data else []})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
