import psycopg2
from psycopg2 import Error
from psycopg2.extras import RealDictCursor

import os
from dotenv import load_dotenv
load_dotenv()

db_url = f"postgresql://{os.getenv('CDB_USER')}:{os.getenv('CDB_PASSWORD')}@{os.getenv('CDB_HOST')}:{os.getenv('CDB_PORT')}/{os.getenv('CDB_DB_NAME')}?sslmode=prefer"

connection = psycopg2.connect(db_url, cursor_factory=RealDictCursor)
cursor = connection.cursor()

def query(q):
  try:
    cursor.execute(q)
    connection.commit()
    print ('Query executed')
  except (Exception, Error) as error:
    print ('Error:', error)

def rollback():
  try:
    connection.rollback()
    print ('Connection rolled back')
  except (Exception, Error) as error:
    print ('Error:', error)
