from dotenv import load_dotenv
load_dotenv()

from urllib.parse import urlparse
from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client
from routes.todo_route import todo_bp
from routes.chat_route import chat_bp
from routes.email_route import email_bp
from routes.scim_route import scim_code_bp
import os

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
app.register_blueprint(email_bp)
app.register_blueprint(scim_code_bp)

if __name__ == "__main__":
  app.run(debug=True, port=8080)

