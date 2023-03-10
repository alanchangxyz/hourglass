# Recommendation Features
# Start Time
# End Time
# Min Offset
# Task Type

from datetime import datetime, timedelta
import json
import random
from db import query_pandas

import requests
import numpy as np
from sklearn.neighbors import KNeighborsRegressor

API_URL = "https://hourglass.alanchang.xyz/api"

def get_recommendations(tid):
    get_recommendation_query = f"SELECT * FROM recommendations WHERE tid = {tid};"
    return query_pandas(get_recommendation_query)

def get_task_window(tid):
    get_task_window_query = f"SELECT start_range, end_range, duration FROM tasks WHERE tid = {tid};"
    return query_pandas(get_task_window_query)

def create_time_lists(start_time, end_time, duration, step_size = 10):
    duration = timedelta(minutes=int(duration))
    start_time = datetime.strptime(start_time, "%H:%M:%S")
    end_time = datetime.strptime(end_time, "%H:%M:%S") - duration
    step = timedelta(minutes = step_size)
    times, times_seconds = [], []
    while start_time <= end_time:
        times.append((start_time.strftime("%H:%M:%S"), (start_time + duration).strftime("%H:%M:%S")))
        times_seconds.append((start_time.hour * 60 + start_time.minute) * 60 + start_time.second)
        start_time += step
    return (times, times_seconds)

def get_recommendations_data(tid):
    df_recs = get_recommendations(tid)
    start_times = df_recs["start_time"].dt
    df_recs["start_time"] = ((start_times.hour * 60 + start_times.minute) * 60 + start_times.second)
    df_recs["chosen"] = df_recs["chosen"].astype(int)
    return df_recs

def get_task_data(tid):
    df_tasks = get_task_window(tid)
    df_tasks["start_range"] = df_tasks['start_range'].dt.time
    df_tasks["end_range"] = df_tasks['end_range'].dt.time
    return df_tasks

def get_lists_to_rank(df_tasks, start_range, end_range):
    duration = df_tasks["duration"].astype("string")[0]
    times, times_seconds = create_time_lists(start_range, end_range, duration)
    return (times, np.array(times_seconds).reshape(-1, 1))

def get_unfiltered_ranking(tid, start_range, end_range):
    # Get the data for recommendations and tasks
    df_recs = get_recommendations_data(tid)
    df_tasks = get_task_data(tid)

    if len(df_recs) > 10:
        # Set the X and Y Labels
        X_train = df_recs["start_time"].values.reshape(-1, 1)
        Y_train = df_recs["chosen"].values.reshape(-1, 1)

        # Get the times that will be ranked
        X_times, X_times_seconds = get_lists_to_rank(df_tasks, start_range, end_range)

        # Create the regression
        knn_regressor = KNeighborsRegressor(n_neighbors=10, weights="distance")
        knn_regressor.fit(X_train, Y_train)

        # Calculate the values from KNN regressing
        ranking_values = knn_regressor.predict(X_times_seconds)

        # Order times based on the values regressed from the knn regressor
        ranked_times = [time for _, time in sorted(zip(ranking_values, X_times), reverse=True)]
        return ranked_times
    else:
        X_times, _ = get_lists_to_rank(df_tasks, start_range, end_range)
        random.shuffle(X_times)
        return X_times

def convert_to_json(ranking):
    rankingsList = []
    for start, end in ranking:
        rankingDict = dict()
        rankingDict["startTime"] = start
        rankingDict["endTime"] = end
        rankingsList.append(rankingDict)

    return json.dumps(rankingsList)

def filter_by_calendar(unfiltered_rankings, date):
    # minutes scheduled
    minutes_scheduled = set()

    # Date in the format M/D/YEAR
    date = date.replace("/", "-")
    response = requests.get(f"{API_URL}/calendar/{date}")
    body = response.json()
    for item in body:
        start_hour, start_minute, _ = item["start"]["dateTime"].split("T")[1].split("-")[0].split(":")
        scheduled_start_minutes = int(start_hour) * 60 + int(start_minute)

        end_hour, end_minute, _ = item["end"]["dateTime"].split("T")[1].split("-")[0].split(":")
        scheduled_end_minutes = int(end_hour) * 60 + int(end_minute)
        for scheduled_minute in range(scheduled_start_minutes, scheduled_end_minutes):
            minutes_scheduled.add(scheduled_minute)

    overlapping_times = []
    nonoverlapping_times = []
    for start_time, end_time in unfiltered_rankings:
        start_hour, start_minute, _ = start_time.split(":")
        recommended_start_minutes = int(start_hour) * 60 + int(start_minute)

        end_hour, end_minute, _ = end_time.split(":")
        recommended_end_minutes = int(end_hour) * 60 + int(end_minute)
        for recommended_minute in range(recommended_start_minutes, recommended_end_minutes):
            if recommended_minute in minutes_scheduled:
                overlapping_times.append((start_time, end_time))
                break
        else:
            nonoverlapping_times.append((start_time, end_time))
    # concatonate lists so that overlapping times are at the end
    recommendations_ranked = nonoverlapping_times + overlapping_times
    return recommendations_ranked


def get_ranking(tid, start_date, end_date):
    date, start_range = start_date.split(" ")
    _, end_range = end_date.split(" ")
    unfiltered_rankings = get_unfiltered_ranking(tid, start_range, end_range)
    filtered_rankings = filter_by_calendar(unfiltered_rankings, date)
    return filtered_rankings


if __name__ == "__main__":
    rankings = get_ranking(tid = 845422236096167937, start_date = "03/08/2023 12:00:00", end_date = "03/08/2023 14:00:00")
    rankingsJSON = convert_to_json(rankings)
    print(rankingsJSON)
