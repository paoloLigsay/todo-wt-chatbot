from flask import Blueprint, jsonify, request
from utils.supabase_fn import get_users, get_todos, update_todo, delete_todo, add_todo

user_bp = Blueprint('users', __name__)

@user_bp.route('/api/users', methods=['GET'])
def return_todostry():
    try:
        users = get_users()
        return jsonify({'users': users.data if users.data else []})
    except Exception as e:
        return jsonify({'error': 'Internal Server Error'}), 500
