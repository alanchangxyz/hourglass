import os.path, os
from dotenv import load_dotenv
from flask import url_for, redirect, request
load_dotenv()

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

import util

SCOPES = ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/userinfo.email']
SUCCESS_MESSAGE = "Hourglass has successfully connected to your Google Calendar"


def credential_authorization():
    # The file token.json stores the token for gcal
    flow = InstalledAppFlow.from_client_secrets_file(
        os.getenv('GCAL_CREDS'), SCOPES)
    # flow.redirect_uri = url_for('finishAuth', _external=True)
    rdLink = url_for('finishAuth', _external=True)
    flow.redirect_uri = os.getenv('API_URL') + '/' + rdLink[rdLink.find('finishAuth'):]
    authorization_url, _ = flow.authorization_url(access_type='offline', include_granted_scopes='true')
    return redirect(authorization_url)

def save_credentials():
  flow = InstalledAppFlow.from_client_secrets_file(os.getenv('GCAL_CREDS'), scopes = None)
  rdLink = url_for('finishAuth', _external=True)
  flow.redirect_uri = os.getenv('API_URL') + '/' + rdLink[rdLink.find('finishAuth'):]

  authorization_response = request.url
  # Use authorisation code to request credentials from Google
  flow.fetch_token(authorization_response=authorization_response)
  credentials = flow.credentials

  # Get user email for deeplink
  email = build('oauth2', 'v2', credentials=credentials).userinfo().get().execute().get("email")
  deeplink = f"hourglass://profile/{email}"

  # Check if previous token file exists
  creds = None
  if os.path.exists(f"{email}_{os.getenv('GCAL_TOKEN')}"):
    creds = Credentials.from_authorized_user_file(f"{email}_{os.getenv('GCAL_TOKEN')}", SCOPES)

  # Refresh token if needed
  if creds and creds.expired and creds.refresh_token:
    creds.refresh(Request())
  # Create new token
  elif not creds:
    with open(f"{email}_{os.getenv('GCAL_TOKEN')}", 'w') as token:
      token.write(credentials.to_json())

  return redirect(deeplink) if deeplink else util.status200({'status': 'Success!'})

def request_events(start_time, end_time, email):
    creds = None
    if os.path.exists(f"{email}_{os.getenv('GCAL_TOKEN')}"):
        creds = Credentials.from_authorized_user_file(f"{email}_{os.getenv('GCAL_TOKEN')}", SCOPES)
    try:
        service = build('calendar', 'v3', credentials=creds)
        events = service.events().list(calendarId='primary', timeMin=start_time,
                                              timeMax= end_time,
                                              singleEvents=True,
                                              orderBy='startTime').execute()
        return events["items"]
    except HttpError as error:
        print('Error: %s' % error)
