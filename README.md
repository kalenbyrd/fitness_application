# fitness_application

This is a Flask local API.

## Setup
1. there is a requirements.txt where you can download the dependencies.

   pip install -r requirements.txt
   
3. API.py is the API application using Flask.
4. fitness_database.ipynb is just a jupyter notebook code showing what I did in order to create my database. You dont have to do anything with it, just as a reference.
5. fitness_dump.sql is the copy of the database that I created running fitness_database.ipynb. You can do

   mysql -u root -p fitness < fitness_dump.sql

   in order to import it to your local MySQL. if it ever asks for a password, its just "yummy". If not, then its going to be your password that you create for the server.
6. Install MySQL Server in order for you to use the database
7. You can then run the Flask API locally

   flask run

8. On your frontend, you can setup the base url to simplify API calls. It would look something like,

   const BASE_URL = "http://127.0.0.1:5000";

# API Endpoints

## Users

| HTTP Method | Endpoint         | Description                |
|-------------|------------------|----------------------------|
| GET         | `/users`         | Fetch all users.           |
| GET         | `/users/<id>`    | Fetch a single user by ID. |
| POST        | `/users`         | Add a new user.            |
| PUT         | `/users/<id>`    | Update user details.       |
| DELETE      | `/users/<id>`    | Delete a user by ID.       |
   
## Workouts

| HTTP Method | Endpoint                | Description                       |
|-------------|-------------------------|-----------------------------------|
| GET         | `/workouts/<id>`       | Fetch a single workouts by user_id.    |
| GET         | `/workout_by_id/<id>`       | Fetch a single workout by workout_id.    |
| POST        | `/workouts`            | Procedure. Add a new workout. Should increment workout in progress table Must specify user id              |
| POST        | `/workouts_with_exercises` | Transaction. Add a workout with exercises.   |
| PUT         | `/workouts/<id>`       | Update workout details.          |
| DELETE      | `/workouts/<id>`       | Delete a workout by ID.          |

## Exercises

| HTTP Method | Endpoint                | Description                       |
|-------------|-------------------------|-----------------------------------|
| GET         | `/exercises/<id>`      | Fetch a single exercise by ID.   |
| POST        | `/exercises`           | Add a new exercise. Must specify user id             |
| PUT         | `/exercises/<id>`      | Update exercise details.         |
| DELETE      | `/exercises/<id>`      | Delete an exercise by ID.        |

## Diet

| HTTP Method | Endpoint                | Description                       |
|-------------|-------------------------|-----------------------------------|
| GET         | `/diet/<user_id>`      | Fetch diet entries by user ID.   |
| GET         | `/diet_by_id/<user_id>`      | Fetch a single diet entry by diet ID.   |
| POST        | `/diet`                | Add a new diet entry. Must specify user id          |
| PUT         | `/diet/<id>`           | Update diet entry details.       |
| DELETE      | `/diet/<id>`           | Delete a diet entry by ID.       |

## Goals

| HTTP Method | Endpoint                | Description                       |
|-------------|-------------------------|-----------------------------------|
| GET         | `/goals/<user_id>`     | Fetch goals by user ID.          |
| GET         | `/goal_by_id/<user_id>`     | Fetch a single goal by goal ID.          |
| POST        | `/goals`               | Add a new goal. Must specify user id                  |
| PUT         | `/goals/<id>`          | Update goal details.             |
| DELETE      | `/goals/<id>`          | Delete a goal by ID.             |

## Progress

| HTTP Method | Endpoint                | Description                       |
|-------------|-------------------------|-----------------------------------|
| GET         | `/progress/<user_id>`  | Fetch progress entries by user ID.|
| GET         | `/progress_by_id/<user_id>`  | Fetch a progress entry by progress ID.|
| POST        | `/progress`            | Add a new progress entry. Must specify user id        |
| PUT         | `/progress/<id>`       | Update progress entry details.   |
| DELETE      | `/progress/<id>`       | Delete a progress entry by ID.   |


## Example fetch

```javascript
async function fetchUsers() {
    try {
        const response = await fetch(`${BASE_URL}/users`, {
            method: "GET"
        });
        const users = await response.json();
        console.log("Users:", users);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}
fetchUsers();
'''

this should fetch all users in our database.
