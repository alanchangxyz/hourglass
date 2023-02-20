from flask import Flask

import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(os.getenv('FLASK_APP_NAME'))


@app.route('/')
def home():
  return 'ping'

if __name__ == '__main__':
  app.run(host="localhost", port=os.getenv('FLASK_RUN_PORT'), debug=os.getenv('FLASK_RUN_DEBUG'))
