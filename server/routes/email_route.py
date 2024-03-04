from flask import Blueprint, jsonify, request
from utils.send_email import send_email

email_bp = Blueprint('email', __name__)

# Email Sender
@email_bp.route('/api/email', methods=['POST'])
def return_email():
    try:
      # Get id and name
      data = request.get_json()

      # Extract 'name' from the request data
      todo_name = data.get('todo')

      send_email(todo_name)
      return jsonify({"success": True, "message": "Email sent successfully"})
    except Exception as e:
      return jsonify({"success": False, "error": str(e)})
