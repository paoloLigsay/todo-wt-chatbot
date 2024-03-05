from flask import Blueprint
from flask import Blueprint, jsonify, request
from utils.supabase_fn import handle_user_active_status, get_groups, get_users_by_ids, get_users_by_username, get_users, insert_user, get_user_by_id
from models.user import User
from models.list_response import ListResponse
from constants.scim import error_schema, list_response_schema, user_schema
import re

scim_code_bp = Blueprint('scim_code', __name__)

def scim_error(message, status_code=500):
  rv = {
    "schemas": [error_schema],
    "detail": message,
    "status": str(status_code),
  }

  return rv, status_code

@scim_code_bp.route("/scim/v2/Groups", methods=['GET'])
def handle_groups():
  groups_response = get_groups()
  groups = groups_response.data
  total_results = len(groups)

  resources = []
  for group in groups:
    user_ids = [int(user_id) for user_id in group["memberUserIds"].split(',') if user_id.strip()]

    group_members = []

    # Fetch users in a single query
    users_response = get_users_by_ids(user_ids)
    users = users_response.data

    # Process the results
    group_members = []
    for member in users:
        group_members.append({
            "value": member["id"],
            "display": member["givenName"] + member["familyName"]
        })

    resource = {
      "id": group["id"],
      "displayName": group["groupName"],
      "members": group_members
    }
    resources.append(resource)

  groups_response = {
    "schemas": [list_response_schema],
    "totalResults": total_results,
    "startIndex": 1,
    "itemsPerPage": 10,
    "Resources": resources
  }

  return groups_response, 200

@scim_code_bp.route("/scim/v2/Users/<id>", methods=['PATCH'])
def handle_user(id):
  if request.method == 'PATCH':
    response = handle_user_active_status(id, False)
    print(response)

@scim_code_bp.route("/scim/v2/Users", methods=['GET', 'POST'])
def handle_users():
  if request.method == 'GET':
    filter_param = request.args.get('filter')

    # Only expecting userName as of the moment.
    if filter_param:
      match = re.search(r'"([^"]*)"', filter_param)
      filter_value = match.group(1)
      users = get_users_by_username(filter_value)
    else:
      users = get_users()

    total_results = len(users.data)
    found = users.data
    count = 1
    start_index = 1

    rv = ListResponse(
      found,
      start_index=start_index,
      count=count,
      total_results=total_results
    )

    response = jsonify(rv.to_scim_resource_list())
    return response, 200
  elif request.method == 'POST':
    user_data = request.json
    
    # Extract relevant information
    username = user_data.get('userName')
    schemas = user_data.get('schemas', [])
    user_id = user_data.get('id')
    active = user_data.get('active', False)

    emails = user_data.get('emails', [])
    email = emails[0].get('value', {})

    name = user_data.get('name', {})
    family_name = name.get('familyName')
    given_name = name.get('givenName')
    middle_name = name.get('middleName')

    # Validate required fields
    if username is None or family_name is None or given_name is None or user_schema not in schemas:
        return jsonify({'error': 'Invalid or incomplete data in the request'}), 400

    new_user = {
      "userName": username,
      "active": active,
      "email": email,
      "familyName": family_name,
      "givenName": given_name,
      "middleName": middle_name,
    }

    # Check if the username/email already exists
    existing_username = get_users_by_username(new_user["userName"])
    existing_email = get_users_by_username(new_user["email"])
    print("is Existing user active: ", existing_username.data.active)

    if existing_username.data or existing_email.data and existing_username.data.active:
       return {"error": "account already exists."}, 409
    elif existing_username.data or existing_email.data and not existing_username.data.active:
      response = handle_user_active_status(id, True)
      return {"error": "account already exists."}, 409
    else:
      response = insert_user(new_user)
      new_inserted_user = response.data[0] 
      restructured_new_inserted_user = User(new_inserted_user).to_scim_resource()

      return restructured_new_inserted_user, 201

@scim_code_bp.route("/scim/v2/Users/<user_id>")
def get_user(user_id):
  try:
    response = get_user_by_id(user_id)
    user = response.data[0] if len(response.data) > 0 else []
    restructured_user = User(user).to_scim_resource_filtered_by_id()
  except:
    return scim_error("User not found", 404)
  return jsonify(restructured_user)
