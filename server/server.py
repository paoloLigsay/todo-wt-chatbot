from dotenv import load_dotenv
load_dotenv()

import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client
from send_email import send_email
from routes.todo_route import todo_bp
from routes.chat_route import chat_bp

# creating supabase client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
api_key: str = os.environ.get("OPENAI_API_KEY")
supabase: Client = create_client(url, key)

# app instance
app = Flask(__name__)
CORS(app)

app.register_blueprint(todo_bp)
app.register_blueprint(chat_bp)

# Email Sender
@app.route('/api/email', methods=['POST'])
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

if __name__ == "__main__":
  app.run(debug=True, port=8080)

