import os.path, os
from dotenv import load_dotenv
load_dotenv()

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
SUCCESS_MESSAGE = "Hourglass has successfully connected to your Google Calendar"


def credential_authorization():
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists(os.getenv('GCAL_TOKEN')):
        creds = Credentials.from_authorized_user_file(os.getenv('GCAL_TOKEN'), SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                os.getenv('GCAL_CREDS'), SCOPES)
            creds = flow.run_local_server(port=8001, success_message=SUCCESS_MESSAGE)
        # Save the credentials for the next run
        with open(os.getenv('GCAL_TOKEN'), 'w') as token:
            token.write(creds.to_json())

def request_events(start_time, end_time):
    creds = None
    if os.path.exists(os.getenv('GCAL_TOKEN')):
        creds = Credentials.from_authorized_user_file(os.getenv('GCAL_TOKEN'), SCOPES)
    try:
        service = build('calendar', 'v3', credentials=creds)
        events = service.events().list(calendarId='primary', timeMin=start_time,
                                              timeMax= end_time,
                                              singleEvents=True,
                                              orderBy='startTime').execute()
        return events["items"]
    except HttpError as error:
        print('Error: %s' % error)
