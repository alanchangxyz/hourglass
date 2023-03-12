from flask import Flask, request
from psycopg2.errors import UniqueViolation
import pytz
from db import query, connection, cursor
from gcal import credential_authorization, save_credentials, request_events

import util

import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
load_dotenv()

SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
SUCCESS_MESSAGE = "Hourglass has successfully connected to your Google Calendar"


app = Flask(os.getenv('FLASK_APP_NAME'))


@app.route('/', methods=['GET'])
def home():
  return 'ping'


# Recommendations routes
@app.route('/recommendations', methods=['GET'])
def recs_get_all():
  cursor.execute('SELECT * from recommendations')
  return cursor.fetchall()

@app.route('/recommendations/<rid>', methods=['GET'])
def recs_get_one_by_id(rid):
  try:
    rid = int(rid)
  except:
    return util.error400('Invalid recommendation ID supplied')
  if not rid or not isinstance(rid, int):
    return util.error400('Invalid recommendation ID supplied')

  try:
    cursor.execute(f'SELECT * from recommendations WHERE rid = %s ORDER BY recommendations.rid', (rid,))
    res = cursor.fetchone()
    if not res:
      return util.status200(None)
    return util.status200(res)
  except:
    return util.error500("Internal server error")

@app.route('/recommendations/<uid>/<tid>', methods=['GET'])
def recs_get_all_by_user_and_task(uid, tid):
  try:
    uid = int(uid)
    tid = int(tid)
  except:
    return util.error400('Invalid user or task ID supplied')
  if not uid or not tid or not isinstance(uid, int) or not isinstance(tid, int):
    return util.error400('Invalid user or task ID supplied')

  try:
    cursor.execute(f'SELECT * from recommendations WHERE uid = %s AND tid = %s', (uid, tid))
    res = cursor.fetchone()
    if not res:
      return util.status200(None)
    return util.status200(res)
  except:
    return util.error500("Internal server error")

@app.route('/recommendations/homepage', methods=['GET'])
def recs_get_homepage():
  try:
    cursor.execute(f'SELECT * FROM recommendations r, tasks t WHERE r.chosen = True AND r.added_to_cal = False AND t.tid = r.tid')
    return cursor.fetchall()
  except:
    return util.error500("Internal server error")

@app.route('/recommendations', methods=['POST'])
def recommendations_create_one():
  js = request.get_json() #start_time, #end_time, min_offset, chosen, added_to_cal, uid, tid

  try:
    cursor.execute(f'INSERT INTO recommenations\
      (start_time, end_time, min_offset, chosen, added_to_cal, uid, tid)\
      VALUES (%s, %s, %d, %d, %s, %s) RETURNING *', (js['start_time'], js['end_time'], js['min_offset'], js['chosen'], js['added_to_cal'], js['uid'], js['tid']))
    connection.commit()
    return util.status200(cursor.fetchone())
  except:
    return util.error500("Internal server error")

@app.route('/recommendations/<rid>', methods=['PUT'])
def recommendations_edit_one(rid):
  try:
    rid = int(rid)
  except:
    return util.error400('Invalid user ID supplied')
  if not rid or not isinstance(rid, int):
    return util.error400('Invalid user ID supplied')
  js = request.get_json() #start_time, #end_time, min_offset, chosen, added_to_cal, uid, tid

  try:
    cursor.execute(f'UPDATE recommendations\
      SET start_time = %s, end_time = %s, min_offset = %d, chosen = %s, added_to_cal = %s, uid = %s, tid = %s WHERE rid = %s',\
      (js['start_time'], js['end_time'], js['min_offset'], js['chosen'], js['added_to_cal'], js['uid'], js['tid'], rid)
    )
    connection.commit()
    cursor.execute(f'SELECT * from recommendations WHERE rid = %s', (rid,))
    res = cursor.fetchone()
    if not res:
      return util.status200(None)
    return util.status200(res)
  except:
    return util.error500("Internal server error")

@app.route('/recommendations/<rid>', methods=['DELETE'])
def recommendations_delete_one(rid):
  try:
    rid = int(rid)
  except:
    return util.error400('Invalid recommendation ID supplied')
  if not rid or not isinstance(rid, int):
    return util.error400('Invalid recommendation ID supplied')

  try:
    cursor.execute(f'SELECT * from recommendations WHERE rid = %s', (rid,))
    res = cursor.fetchone()
    if not res:
      return util.status200({'deleted': None})
    cursor.execute(f'DELETE from recommendations WHERE rid = %s', (rid,))
    connection.commit()
    return util.status200({'deleted': rid})
  except:
    return util.error500("Internal server error")


# Tasks routes
@app.route('/tasks', methods=['GET'])
def tasks_get_all():
  cursor.execute('SELECT * from tasks')
  return cursor.fetchall()

@app.route('/tasks/<tid>', methods=['GET'])
def tasks_get_one_by_id(tid):
  try:
    tid = int(tid)
  except:
    return util.error400('Invalid task ID supplied')
  if not tid or not isinstance(tid, int):
    return util.error400('Invalid task ID supplied')

  try:
    cursor.execute(f'SELECT * from tasks WHERE tid = %s ORDER BY tasks.tid', (tid,))
    res = cursor.fetchone()
    if not res:
      return util.status200(None)

    res['start_range'] = res['start_range'].strftime(f"%a, %d %b %Y %H:%M:%S PST")
    res['end_range'] = res['end_range'].strftime(f"%a, %d %b %Y %H:%M:%S PST")

    return util.status200(res)
  except:
    return util.error500("Internal server error")

@app.route('/tasks/by-user/<uid>', methods=['GET'])
def tasks_get_all_by_user(uid):
  try:
    uid = int(uid)
  except:
    return util.error400('Invalid user ID supplied')
  if not uid or not isinstance(uid, int):
    return util.error400('Invalid user ID supplied')

  try:
    cursor.execute(f'SELECT * from tasks WHERE uid = %s', (uid,))
    res = cursor.fetchall()
    if not res:
      return util.status200(None)

    for task in res:
      task['start_range'] = task['start_range'].strftime(f"%a, %d %b %Y %H:%M:%S PST")
      task['end_range'] = task['end_range'].strftime(f"%a, %d %b %Y %H:%M:%S PST")

    return util.status200(res)
  except:
    return util.error500("Internal server error")

@app.route('/tasks', methods=['POST'])
def tasks_create_one():
  js = request.get_json() #uid, name, priority, duration, start_range, end_range

  try:
    cursor.execute(f'INSERT INTO tasks (uid, name, priority, duration, start_range, end_range)\
      VALUES (%s, %s, %d, %d, %s, %s) RETURNING *', (js['uid'], js['name'], js['priority'], js['duration'], js['start_range'], js['end_range']))
    connection.commit()
    return util.status200(cursor.fetchone())
  except:
    return util.error500("Internal server error")

@app.route('/tasks/<tid>', methods=['PUT'])
def tasks_edit_one(tid):
  try:
    tid = int(tid)
  except:
    return util.error400('Invalid task ID supplied')
  if not tid or not isinstance(tid, int):
    return util.error400('Invalid task ID supplied')
  js = request.get_json() #uid, name, priority, duration, start_range, end_range

  try:
    cursor.execute(f'UPDATE tasks\
      SET name = %s, priority = %s, duration = %d, start_range = %s, end_range = %s WHERE tid = %s',\
      (js['name'], js['priority'], js['duration'], js['start_range'], js['end_range'], tid)
    )
    connection.commit()
    cursor.execute(f'SELECT * from tasks WHERE tid = %s', (tid,))
    res = cursor.fetchone()
    if not res:
      return util.status200(None)
    return util.status200(res)
  except:
    return util.error500("Internal server error")

@app.route('/tasks/<tid>', methods=['DELETE'])
def tasks_delete_one(tid):
  try:
    tid = int(tid)
  except:
    return util.error400('Invalid task ID supplied')
  if not tid or not isinstance(tid, int):
    return util.error400('Invalid task ID supplied')

  try:
    cursor.execute(f'SELECT * from tasks WHERE tid = %s', (tid,))
    res = cursor.fetchone()
    if not res:
      return util.status200({'deleted': None})
    cursor.execute(f'DELETE from tasks WHERE tid = %s', (tid,))
    connection.commit()
    return util.status200({'deleted': tid})
  except:
    return util.error500("Internal server error")


# Users routes
@app.route('/users', methods=['GET'])
def users_get_all():
  try:
    cursor.execute('SELECT * from users ORDER BY users.id')
    return cursor.fetchall()
  except Exception as e:
    return util.error500(f"Internal server error - {e}")

@app.route('/users/by-id/<uid>', methods=['GET'])
def users_get_one_by_id(uid):
  try:
    uid = int(uid)
  except:
    return util.error400('Invalid user ID supplied')
  if not uid or not isinstance(uid, int):
    return util.error400('Invalid user ID supplied')

  try:
    cursor.execute(f'SELECT * from users WHERE id = %s', (uid,))
    res = cursor.fetchone()
    if not res:
      return util.status200(None)
    return util.status200(res)
  except:
    return util.error500("Internal server error")

@app.route('/users/by-email/<email>', methods=['GET'])
def users_get_one_by_email(email):
  try:
    cursor.execute(f'SELECT * from users WHERE email = %s', (email,))
    res = cursor.fetchone()
    if not res:
      return util.status200(None)
    return util.status200(res)
  except:
    return util.error500("Internal server error")

@app.route('/users', methods=['POST'])
def users_create_one():
  js = request.get_json() # email, fname, lname
  if util.doesNotContain(js, ['fname', 'lname']) or not isinstance(js['fname'], str) or not isinstance(js['lname'], str):
    return util.error400('Invalid user name supplied')

  try:
    cursor.execute(f'INSERT INTO users (email, fname, lname) VALUES (%s, %s, %s) RETURNING *', (js['email'], js['fname'], js['lname']))
    connection.commit()
    return util.status200(cursor.fetchone())
  except:
    return util.error500("Internal server error")

@app.route('/users/<uid>', methods=['PUT'])
def users_edit_one(uid):
  try:
    uid = int(uid)
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

@app.route('/users/<uid>', methods=['DELETE'])
def users_delete_one(uid):
  try:
    uid = int(uid)
  except:
    return util.error400('Invalid user ID supplied')
  if not uid or not isinstance(uid, int):
    return util.error400('Invalid user ID supplied')

  try:
    cursor.execute(f'SELECT * from users WHERE id = %s', (uid,))
    res = cursor.fetchone()
    if not res:
      return util.status200({'deleted': None})
    cursor.execute(f'DELETE from users WHERE id = %s', (uid,))
    connection.commit()
    return util.status200({'deleted': uid})
  except:
    return util.error500("Internal server error")


# Google Calendar Credential Authorization
@app.route('/authorize', methods=['GET'])
def google_authorization():
  return credential_authorization()

@app.route('/finishAuth')
def finishAuth():
  return save_credentials()

# Google Calendar Get Events at Date
@app.route('/calendar/<date>', methods=['GET'])
def calendar_get_one(date):
  start_date_pst = datetime.strptime(f"{date} 00:00:00","%m-%d-%Y %H:%M:%S")
  end_date_pst = datetime.strptime(f"{date} 00:00:00","%m-%d-%Y %H:%M:%S")+ timedelta(days = 1)
  pst_time = pytz.timezone("America/Los_Angeles")
  start_date_utc = pst_time.localize(start_date_pst, is_dst=None).astimezone(pytz.utc).isoformat().replace("+00:00", "Z")
  end_date_utc = pst_time.localize(end_date_pst, is_dst=None).astimezone(pytz.utc).isoformat().replace("+00:00", "Z")
  return request_events(start_date_utc, end_date_utc)

if __name__ == '__main__':
  if os.getenv('DEV_ENV') == 'production':
    from waitress import serve
    serve(app, host='0.0.0.0', port=os.getenv('FLASK_RUN_PORT'))

  else:
    app.run(host="localhost", port=os.getenv('FLASK_RUN_PORT'), debug=os.getenv('FLASK_RUN_DEBUG'), threaded=True)
