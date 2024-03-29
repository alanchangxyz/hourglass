from flask import Flask, request
from psycopg2.errors import UniqueViolation
import pytz
from db import query, connection, cursor
from gcal import credential_authorization, save_credentials, request_events
from knn import get_ranking

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
  res = cursor.fetchall()
  for rec in res:
    rec['rid'] = str(rec['rid'])
    rec['start_time'] = rec['start_time'].strftime(f"%a, %d %b %Y %H:%M:%S PST")
    rec['end_time'] = rec['end_time'].strftime(f"%a, %d %b %Y %H:%M:%S PST")
  return util.status200(res)

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
    res['rid'] = str(res['rid'])
    res['start_time'] = res['start_time'].strftime(f"%a, %d %b %Y %H:%M:%S PST")
    res['end_time'] = res['end_time'].strftime(f"%a, %d %b %Y %H:%M:%S PST")
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
    res['rid'] = str(res['rid'])
    res['start_time'] = res['start_time'].strftime(f"%a, %d %b %Y %H:%M:%S PST")
    res['end_time'] = res['end_time'].strftime(f"%a, %d %b %Y %H:%M:%S PST")
    return util.status200(res)
  except:
    return util.error500("Internal server error")

@app.route('/recommendations/homepage/<id>', methods=['GET'])
def recs_get_homepage(id):
  # try:
  cursor.execute(f'SELECT * FROM recommendations r, tasks t WHERE r.chosen = True AND r.added_to_cal = False AND t.tid = r.tid AND r.uid = {id}')
  res = cursor.fetchall()
  for rec in res:
    rec['rid'] = str(rec['rid'])
    rec['uid'] = str(rec['uid'])
    rec['tid'] = str(rec['tid'])
    rec['start_time'] = rec['start_time'].strftime(f"%a, %d %b %Y %H:%M:%S PST")
    rec['end_time'] = rec['end_time'].strftime(f"%a, %d %b %Y %H:%M:%S PST")
  sorted_res = sorted(res, key = lambda rec: datetime.strptime(rec["start_time"], f"%a, %d %b %Y %H:%M:%S PST"))
  return util.status200(sorted_res)
  # except:
  #   return util.error500("Internal server error")

@app.route('/recommendations', methods=['POST'])
def recommendations_create_one():
  js = request.get_json() #start_time, #end_time, chosen, added_to_cal, uid, tid

  try:
    cursor.execute(f'INSERT INTO recommendations\
      (start_time, end_time, chosen, added_to_cal, uid, tid)\
      VALUES ((TIMESTAMP %s), (TIMESTAMP %s), %s, %s, %s, %s) RETURNING *', (js['start_time'], js['end_time'], js['chosen'], js['added_to_cal'], js['uid'], js['tid']))
    connection.commit()
    res = cursor.fetchone()
    res['rid'] = str(res['rid'])
    res['start_time'] = res['start_time'].strftime(f"%a, %d %b %Y %H:%M:%S PST")
    res['end_time'] = res['end_time'].strftime(f"%a, %d %b %Y %H:%M:%S PST")
    return util.status200(res)
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
    res['rid'] = str(res['rid'])
    res['start_time'] = res['start_time'].strftime(f"%a, %d %b %Y %H:%M:%S PST")
    res['end_time'] = res['end_time'].strftime(f"%a, %d %b %Y %H:%M:%S PST")
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
    return util.status200({'deleted': str(rid)})
  except:
    return util.error500("Internal server error")


# Tasks routes
@app.route('/tasks', methods=['GET'])
def tasks_get_all():
  cursor.execute('SELECT * from tasks')
  res = cursor.fetchall()

  for task in res:
    task['tid'] = str(task['tid'])
    task['uid'] = str(task['uid'])

  return util.status200(res)

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

    res['tid'] = str(res['tid'])
    res['uid'] = str(res['uid'])

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
    cursor.execute(f'SELECT * from tasks WHERE uid = %s ORDER BY tasks.tid', (uid,))
    res = cursor.fetchall()
    if not res:
      return util.status200(None)

    for task in res:
      task['tid'] = str(task['tid'])
      task['uid'] = str(task['uid'])

    return util.status200(res)
  except:
    return util.error500("Internal server error")

@app.route('/tasks', methods=['POST'])
def tasks_create_one():
  js = request.get_json() #uid, name, duration

  try:
    cursor.execute(f'INSERT INTO tasks (uid, name, duration)\
      VALUES (%s, %s, %s) RETURNING *', (js['uid'], js['name'], js['duration']))
    connection.commit()
    res = cursor.fetchone()
    res['tid'] = str(res['tid'])
    res['uid'] = str(res['uid'])
    return util.status200(res)
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
  js = request.get_json() #uid, name, duration

  try:
    cursor.execute(f'UPDATE tasks\
      SET uid = %s, name = %s, duration = %d WHERE tid = %s',\
      (js['uid'], js['name'], js['duration'], tid)
    )
    connection.commit()
    cursor.execute(f'SELECT * from tasks WHERE tid = %s', (tid,))
    res = cursor.fetchone()
    if not res:
      return util.status200(None)
    res['tid'] = str(res['tid'])
    res['uid'] = str(res['uid'])
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
    return util.status200({'deleted': str(tid)})
  except:
    return util.error500("Internal server error")


# Users routes
@app.route('/users', methods=['GET'])
def users_get_all():
  try:
    cursor.execute('SELECT * from users ORDER BY users.id')
    res = cursor.fetchall()
    for row in res:
      row['id'] = str(row['id'])

    return util.status200(res)
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
    res['id'] = str(res['id'])
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
    res['id'] = str(res['id'])
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
    res = cursor.fetchone()
    res['id'] = str(res['id'])
    return util.status200(res)
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
    res['id'] = str(res['id'])
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
    return util.status200({'deleted': str(uid)})
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
@app.route('/calendar/<email>/<date>', methods=['GET'])
def calendar_get_one(email, date):
  try:
    dt = datetime.strptime(date, "%m-%d-%Y")
  except:
    return util.error400('Invalid datetime format supplied')
  start_date_pst = datetime.strptime(f"{date} 00:00:00","%m-%d-%Y %H:%M:%S")
  end_date_pst = datetime.strptime(f"{date} 00:00:00","%m-%d-%Y %H:%M:%S")+ timedelta(days = 1)
  pst_time = pytz.timezone("America/Los_Angeles")
  start_date_utc = pst_time.localize(start_date_pst, is_dst=None).astimezone(pytz.utc).isoformat().replace("+00:00", "Z")
  end_date_utc = pst_time.localize(end_date_pst, is_dst=None).astimezone(pytz.utc).isoformat().replace("+00:00", "Z")
  return request_events(start_date_utc, end_date_utc, email)

# Generate Recommendation List
@app.route('/recommendations/generate/<tid>/<date>/<time1>/<time2>', methods=['GET'])
def recommendations_generate(tid, date, time1, time2):
  try:
    tid = int(tid)
  except:
    return util.error400('Invalid task ID supplied')
  if not tid or not isinstance(tid, int):
    return util.error400('Invalid task ID supplied')

  try:
    datetime1 = f"{date} {time1}"
    dt1 = datetime.strptime(datetime1, "%m-%d-%Y %H:%M:%S")
  except:
    return util.error400('Invalid datetime format supplied')
  try:
    datetime2 = f"{date} {time2}"
    dt2 = datetime.strptime(datetime2, "%m-%d-%Y %H:%M:%S")
  except:
    return util.error400('Invalid datetime format supplied')

  if dt1 >= dt2:
    return util.error400('Invalid window for datetimes supplied')

  cursor.execute(f'SELECT u.email FROM users u, tasks t WHERE tid = %s AND u.id = t.uid', (tid,))
  res = cursor.fetchone()

  return get_ranking(tid, datetime1, datetime2, res["email"])

if __name__ == '__main__':
  if os.getenv('DEV_ENV') == 'production':
    from waitress import serve
    serve(app, host='0.0.0.0', port=os.getenv('FLASK_RUN_PORT'))

  else:
    app.run(host="localhost", port=os.getenv('FLASK_RUN_PORT'), debug=os.getenv('FLASK_RUN_DEBUG'), threaded=True)
