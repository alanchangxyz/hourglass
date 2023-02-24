from flask import Flask, request
from psycopg2.errors import UniqueViolation
from db import query, connection, cursor
from gcal import credential_authorization, request_events
import util

import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()
app = Flask(os.getenv('FLASK_APP_NAME'))


@app.route('/', methods=['GET'])
def home():
  return 'ping'


# Recommendations routes
@app.route('/recommendations', methods=['GET'])
def recs_get_all():
  cursor.execute('SELECT * from recommendations')
  return cursor.fetchall()


# Tasks routes
@app.route('/tasks', methods=['GET'])
def tasks_get_all():
  cursor.execute('SELECT * from tasks')
  return cursor.fetchall()


# Users routes
@app.route('/users', methods=['GET'])
def users_get_all():
  try:
    cursor.execute('SELECT * from users ORDER BY users.id')
    return cursor.fetchall()
  except:
    return util.error500("Internal server error")

@app.route('/users/<id>', methods=['GET'])
def users_get_one(id):
  try:
    id = int(id)
  except:
    return util.error400('Invalid user ID supplied')
  if not id or not isinstance(id, int):
    return util.error400('Invalid user ID supplied')

  try:
    cursor.execute(f'SELECT * from users WHERE id = %s', (id,))
    res = cursor.fetchone()
    if not res:
      return util.status200(None)
    return util.status200(res)
  except:
    return util.error500("Internal server error")

@app.route('/users', methods=['POST'])
def users_create_one():
  js = request.get_json()
  if util.doesNotContain(js, ['id']) or not isinstance(js['id'], int):
    return util.error400('Invalid user ID supplied')
  if util.doesNotContain(js, ['fname', 'lname']) or not isinstance(js['fname'], str) or not isinstance(js['lname'], str):
    return util.error400('Invalid user name supplied')

  try:
    cursor.execute(f'INSERT INTO users (id, fname, lname) VALUES (%s, %s, %s)', (js['id'], js['fname'], js['lname']))
    connection.commit()
    cursor.execute(f'SELECT * from users WHERE id = %s', (js['id'],))
    return util.status200(cursor.fetchone())
  except UniqueViolation:
    return util.error400(f"User ID {js['id']} already exists")
  except:
    return util.error500("Internal server error")

@app.route('/users/<id>', methods=['PUT'])
def users_edit_one(id):
  try:
    uid = int(id)
  except:
    return util.error400('Invalid user ID supplied')
  if not uid or not isinstance(uid, int):
    return util.error400('Invalid user ID supplied')
  js = request.get_json()
  if ('fname' not in js or not isinstance(js['fname'], str)) or ('lname' not in js or not isinstance(js['lname'], str)):
    return util.error400('Invalid user name supplied')

  try:
    cursor.execute(f'UPDATE users SET fname = %s, lname = %s WHERE id = %s', (js['fname'], js['lname'], uid))
    connection.commit()
    cursor.execute(f'SELECT * from users WHERE id = %s', (uid,))
    res = cursor.fetchone()
    if not res:
      return util.status200(None)
    return util.status200(res)
  except:
    return util.error500("Internal server error")

@app.route('/users/<id>', methods=['DELETE'])
def users_delete_one(id):
  try:
    id = int(id)
  except:
    return util.error400('Invalid user ID supplied')
  if not id or not isinstance(id, int):
    return util.error400('Invalid user ID supplied')

  try:
    cursor.execute(f'SELECT * from users WHERE id = %s', (id,))
    res = cursor.fetchone()
    if not res:
      return util.status200({'deleted': None})
    cursor.execute(f'DELETE from users WHERE id = %s', (id,))
    connection.commit()
    return util.status200({'deleted': id})
  except:
    return util.error500("Internal server error")


# Google Calendar Credential Authorization
@app.route('/authorize', methods=['GET'])
def google_authorization():
  return credential_authorization()

# Google Calendar Credential Authorization
@app.route('/calendar/<date>', methods=['GET'])
def calendar_get_one(date):
  start_date = datetime.strptime(date,"%m-%d-%Y").isoformat() + 'Z'
  end_date = (datetime.strptime(date,"%m-%d-%Y") + timedelta(days = 1)).isoformat() + 'Z'
  return request_events(start_date, end_date)

if __name__ == '__main__':
  if os.getenv('DEV_ENV') == 'production':
    from waitress import serve
    serve(app, host='0.0.0.0', port=8080)

  else:
    app.run(host="localhost", port=os.getenv('FLASK_RUN_PORT'), debug=os.getenv('FLASK_RUN_DEBUG'), threaded=True)
