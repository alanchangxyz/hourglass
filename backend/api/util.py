from flask import Response
import json

# Errors
def status200(ret):
  return Response(json.dumps(ret), status=200, mimetype='application/json')

def error400(msg):
  return Response(json.dumps({'error': msg}), status=400, mimetype='application/json')

def error500(msg):
  return Response(json.dumps({'error': msg}), status=500, mimetype='application/json')

# Utils
def doesNotContain(obj, things):
  for thing in things:
    if thing not in obj:
      return True
  return False

def firstMissing(obj, things):
  for thing in things:
    if thing not in obj:
      return thing
  return None
