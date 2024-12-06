# %%
"""
#### CRUD Operations Using Flask API
"""

# %%
from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import bcrypt

app = Flask(__name__)

CORS(app)

# Function to get DB connection
def get_db():
    return pymysql.connect(
        host='localhost',
        user='root',
        password='yummy',
        database='fitness'
    )

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data['email']
    name = data['name']
    age = data['age']
    height = data['height']
    weight = data['weight']
    password = data['password']

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    db = get_db()
    cursor = db.cursor()

    # Insert user into the database
    try:
        sql = """
        INSERT INTO Users (email, name, age, height, weight, password_hash)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (email, name, age, height, weight, hashed_password.decode('utf-8')))
        db.commit()
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to create user"}), 400
    finally:
        cursor.close()
        db.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']
    
    sql = "SELECT user_id, email, name, password_hash FROM Users WHERE email = %s"

    db = get_db()
    cursor = db.cursor()

    cursor.execute(sql, (email,))
    result = cursor.fetchone()

    if result:
        stored_hash = result[3]  
        user_data = {
            "user_id": result[0],  
            "email": result[1],    
            "name": result[2],     
        }

        # Check the password
        if bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8')):
            return jsonify({
                "message": "Login successful",
                "user": user_data,
                "token": "your_jwt_token_here"  # You can add a token if you plan to use JWT
            }), 200
        else:
            return jsonify({"error": "Invalid password"}), 401
    else:
        return jsonify({"error": "User not found"}), 404
    
    cursor.close()
    db.close()




# CREATE: Add a new user
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()  # Get data from the frontend
    email = data.get('email')
    name = data.get('name')
    age = data.get('age')
    height = data.get('height')
    weight = data.get('weight')

    db = get_db()
    cursor = db.cursor()
    try:
        sql = "INSERT INTO Users (email, name, age, height, weight) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(sql, (email, name, age, height, weight))
        db.commit()
        return jsonify({"message": "User created successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()
        
# CREATE: Add a new workout
@app.route('/workouts', methods=['POST'])
def create_workout():
    data = request.get_json()
    user_id = data.get('user_id')
    workout_type = data.get('workout_type')
    duration = data.get('duration')
    calories_burned = data.get('calories_burned')

    db = get_db()
    cursor = db.cursor()
    try:
        sql = """
            INSERT INTO Workouts (user_id, workout_type, duration, calories_burned)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(sql, (user_id, workout_type, duration, calories_burned))
        db.commit()
        return jsonify({"message": "Workout added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()

# CREATE: Add a new exercise
@app.route('/exercises', methods=['POST'])
def create_exercise():
    data = request.get_json()
    workout_id = data.get('workout_id')
    exercise_name = data.get('exercise_name')
    sets = data.get('sets')
    reps_per_set = data.get('reps_per_set')
    duration = data.get('duration')
    calories_burned_per_exercise = data.get('calories_burned_per_exercise')

    db = get_db()
    cursor = db.cursor()
    try:
        sql = """
            INSERT INTO Exercises (workout_id, exercise_name, sets, reps_per_set, duration, calories_burned_per_exercise)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (workout_id, exercise_name, sets, reps_per_set, duration, calories_burned_per_exercise))
        db.commit()
        return jsonify({"message": "Exercise added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()

# CREATE: Add a new goal
@app.route('/goals', methods=['POST'])
def create_goal():
    data = request.get_json()
    user_id = data.get('user_id')
    goal_type = data.get('goal_type')
    target_value = data.get('target_value')
    current_progress = data.get('current_progress')
    deadline = data.get('deadline')
    status = data.get('status')
    

    db = get_db()
    cursor = db.cursor()
    try:
        sql = """
            INSERT INTO Goals (user_id, goal_type, target_value, current_progress, deadline, status)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (user_id, goal_type, target_value, current_progress, deadline, status))
        db.commit()
        return jsonify({"message": "Goal added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()

# CREATE: Add a new diet entry
@app.route('/diet', methods=['POST'])
def create_diet():
    data = request.get_json()
    user_id = data.get('user_id')
    meal_type = data.get('meal_type')
    calories = data.get('calories')
    protein = data.get('protein')
    carbs = data.get('carbs')
    fats = data.get('fats')

    db = get_db()
    cursor = db.cursor()
    try:
        sql = """
            INSERT INTO Diet (user_id, meal_type, calories, protein, carbs, fats)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (user_id, meal_type, calories, protein, carbs, fats))
        db.commit()
        return jsonify({"message": "Diet entry added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()

# CREATE: Add a new progress entry
@app.route('/progress', methods=['POST'])
def create_progress():
    data = request.get_json()
    user_id = data.get('user_id')
    weight = data.get('weight')
    workout_count = data.get('workout_count')
    calories_burned = data.get('calories_burned')
    goal_id = data.get('goal_id')

    db = get_db()
    cursor = db.cursor()
    try:
        sql = """
            INSERT INTO Progress (user_id, weight, workout_count, calories_burned, goal_id)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (user_id, weight, workout_count, calories_burned, goal_id))
        db.commit()
        return jsonify({"message": "Progress entry added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()



# DELETE: Remove a user by ID and all related data
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    db = get_db()
    cursor = db.cursor()

    try:
        # Option 1: Check if the user exists before trying to delete
        cursor.execute("SELECT * FROM Users WHERE user_id = %s", (user_id,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": f"User with ID {user_id} not found."}), 404

        # Option 2: Delete related data first (if you want more control over the deletion)
        cursor.execute("DELETE FROM Diet WHERE user_id = %s", (user_id,))
        cursor.execute("DELETE FROM Progress WHERE user_id = %s", (user_id,))
        cursor.execute("DELETE FROM Goals WHERE user_id = %s", (user_id,))
        cursor.execute("DELETE FROM Workouts WHERE user_id = %s", (user_id,))

        # Option 3: Now delete the user
        cursor.execute("DELETE FROM Users WHERE user_id = %s", (user_id,))

        db.commit()  # Commit changes

        return jsonify({"message": f"User with ID {user_id} and all related data deleted successfully."}), 200

    except Exception as e:
        db.rollback()  # Rollback in case of error
        return jsonify({"error": str(e)}), 400

    finally:
        cursor.close()
        db.close()

        
# DELETE: Remove a workout by ID
@app.route('/workouts/<int:workout_id>', methods=['DELETE'])
def delete_workout(workout_id):
    db = get_db()
    cursor = db.cursor()
    try:
        sql = "DELETE FROM Workouts WHERE workout_id = %s"
        cursor.execute(sql, (workout_id,))
        db.commit()
        return jsonify({"message": f"Workout with ID {workout_id} deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()


# DELETE: Delete an exercise by ID
@app.route('/exercises/<int:exercise_id>', methods=['DELETE'])
def delete_exercise(exercise_id):
    db = get_db()
    cursor = db.cursor()
    try:
        sql = "DELETE FROM Exercises WHERE exercise_id = %s"
        cursor.execute(sql, (exercise_id,))
        db.commit()
        return jsonify({"message": f"Exercise with ID {exercise_id} deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()

# DELETE: Delete a goal by ID
@app.route('/goals/<int:goal_id>', methods=['DELETE'])
def delete_goal(goal_id):
    db = get_db()
    cursor = db.cursor()
    try:
        sql = "DELETE FROM Goals WHERE goal_id = %s"
        cursor.execute(sql, (goal_id,))
        db.commit()
        return jsonify({"message": f"Goal with ID {goal_id} deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()

# DELETE: Delete a diet entry by ID
@app.route('/diet/<int:diet_id>', methods=['DELETE'])
def delete_diet(diet_id):
    db = get_db()
    cursor = db.cursor()
    try:
        sql = "DELETE FROM Diet WHERE diet_id = %s"
        cursor.execute(sql, (diet_id,))
        db.commit()
        return jsonify({"message": f"Diet entry with ID {diet_id} deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()

# DELETE: Delete a progress entry by ID
@app.route('/progress/<int:progress_id>', methods=['DELETE'])
def delete_progress(progress_id):
    db = get_db()
    cursor = db.cursor()
    try:
        sql = "DELETE FROM Progress WHERE progress_id = %s"
        cursor.execute(sql, (progress_id,))
        db.commit()
        return jsonify({"message": f"Progress entry with ID {progress_id} deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()


# READ: Get list of users
@app.route('/users', methods=['GET'])
def get_users():
    db = get_db()
    cursor = db.cursor()
    try:
        sql = "SELECT * FROM Users"
        cursor.execute(sql)
        results = cursor.fetchall()
        
       
        column_names = [desc[0] for desc in cursor.description]
        
        
        formatted_results = []
        for row in results:
            formatted_results.append(dict(zip(column_names, row)))

        return jsonify(formatted_results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()


# Read: Get user by user id
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    db = get_db()
    cursor = db.cursor()
    try:
       
        sql = "SELECT * FROM Users WHERE user_id = %s"
        cursor.execute(sql, (user_id,))
        result = cursor.fetchone()  # Fetch a single row

        if result:
           
            user = {
                "user_id": result[0],
                "email": result[2],
                "name": result[3],
                "age": result[4],
                "height": result[5],
                "weight": result[6]
            }
            return jsonify(user), 200
        else:
            return jsonify({"message": f"User with ID {user_id} not found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()


# READ: Get exercises by workout ID
@app.route('/exercises/<int:workout_id>', methods=['GET'])
def get_exercises(workout_id):
    db = get_db()
    cursor = db.cursor()
    try:
        sql = "SELECT * FROM Exercises WHERE workout_id = %s"
        cursor.execute(sql, (workout_id,))
        results = cursor.fetchall()
        
        column_names = [desc[0] for desc in cursor.description]
        
        formatted_results = []
        for row in results:
            formatted_results.append(dict(zip(column_names, row)))
        
        if formatted_results:
            return jsonify(formatted_results), 200
        else:
            return jsonify({"message": "No exercises found for this workout."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()


# READ: Get goals by user ID
@app.route('/goals/<int:user_id>', methods=['GET'])
def get_goals(user_id):
    db = get_db()
    cursor = db.cursor()
    try:
        sql = "SELECT * FROM Goals WHERE user_id = %s"
        cursor.execute(sql, (user_id,))
        results = cursor.fetchall()
        
        column_names = [desc[0] for desc in cursor.description]
        
        formatted_results = []
        for row in results:
            formatted_results.append(dict(zip(column_names, row)))
        
        if formatted_results:
            return jsonify(formatted_results), 200
        else:
            return jsonify({"message": "No goals found for this user."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()

@app.route('/goal_by_id/<int:goal_id>', methods=['GET'])
def get_goal_by_id(goal_id):
    db = get_db()
    cursor = db.cursor()
    try:
        sql = "SELECT * FROM Goals WHERE goal_id = %s"
        cursor.execute(sql, (goal_id,))
        result = cursor.fetchone()

        if result:
            column_names = [desc[0] for desc in cursor.description]
            goal_entry = dict(zip(column_names, result))
            return jsonify(goal_entry), 200
        else:
            return jsonify({"message": "No goal found with this ID."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()


# READ: Get diet entries by user ID
@app.route('/diet/<int:user_id>', methods=['GET'])
def get_diet(user_id):
    db = get_db()
    cursor = db.cursor()
    try:
        sql = "SELECT * FROM Diet WHERE user_id = %s"
        cursor.execute(sql, (user_id,))
        results = cursor.fetchall()
        
        if results:
            formatted_results = [
                {
                    "diet_id": result[0],
                    "user_id": result[1],
                    "meal_type": result[2],
                    "calories": result[3],
                    "protein": result[4],
                    "carbs": result[5],
                    "fats": result[6],
                    "date": result[7]
                }
                for result in results
            ]
            return jsonify(formatted_results), 200
        else:
            return jsonify({"message": "No diet entries found for this user."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()


@app.route('/diet_by_id/<int:diet_id>', methods=['GET'])
def get_diet_by_id(diet_id):
    db = get_db()
    cursor = db.cursor()
    try:
        sql = "SELECT * FROM Diet WHERE diet_id = %s"
        cursor.execute(sql, (diet_id,))
        result = cursor.fetchone()

        if result:
            column_names = [desc[0] for desc in cursor.description]
            diet_entry = dict(zip(column_names, result))
            return jsonify(diet_entry), 200
        else:
            return jsonify({"message": "No diet entry found with this ID."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()


# READ: Get progress entries by user ID
@app.route('/progress/<int:user_id>', methods=['GET'])
def get_progress(user_id):
    db = get_db()
    cursor = db.cursor()
    try:
        sql = "SELECT * FROM Progress WHERE user_id = %s"
        cursor.execute(sql, (user_id,))
        results = cursor.fetchall()
        
        if results:
            formatted_results = [
                {
                    "progress_id": result[0],
                    "user_id": result[1],
                    "date": result[2],
                    "weight": result[3],
                    "workout_count": result[4],
                    "calories_burned": result[5],
                    "goal_id": result[6]
                }
                for result in results
            ]
            return jsonify(formatted_results), 200
        else:
            return jsonify({"message": "No progress entries found for this user."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()


@app.route('/progress_by_id/<int:progress_id>', methods=['GET'])
def get_progress_by_id(progress_id):
    db = get_db()
    cursor = db.cursor()
    try:
        sql = "SELECT * FROM Progress WHERE progress_id = %s"
        cursor.execute(sql, (progress_id,))
        result = cursor.fetchone()

        if result:
            column_names = [desc[0] for desc in cursor.description]
            progress_entry = dict(zip(column_names, result))
            return jsonify(progress_entry), 200
        else:
            return jsonify({"message": "No progress entry found with this ID."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()


# UPDATE: Update user details
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json() 

    fields_to_update = []
    values = []
    
    if 'email' in data:
        fields_to_update.append('email = %s')
        values.append(data['email'])
    
    if 'name' in data:
        fields_to_update.append('name = %s')
        values.append(data['name'])
    
    if 'age' in data:
        fields_to_update.append('age = %s')
        values.append(data['age'])
    
    if 'height' in data:
        fields_to_update.append('height = %s')
        values.append(data['height'])
    
    if 'weight' in data:
        fields_to_update.append('weight = %s')
        values.append(data['weight'])
    
    if not fields_to_update:
        return jsonify({"message": "No fields to update"}), 400

    # Add user_id to the values to match the WHERE clause
    values.append(user_id)
    
    # Create the SQL query dynamically
    sql = f"""
        UPDATE Users 
        SET {', '.join(fields_to_update)} 
        WHERE user_id = %s
    """

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute(sql, tuple(values))
        db.commit()

        if cursor.rowcount > 0:
            return jsonify({"message": "User updated successfully!"}), 200
        else:
            return jsonify({"message": f"User with ID {user_id} not found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()


#Update workout
@app.route('/workouts/<int:workout_id>', methods=['PUT'])
def update_workout(workout_id):
    data = request.get_json()

    fields_to_update = []
    values = []

    if 'workout_type' in data:
        fields_to_update.append('workout_type = %s')
        values.append(data['workout_type'])

    if 'duration' in data:
        fields_to_update.append('duration = %s')
        values.append(data['duration'])

    if 'calories_burned' in data:
        fields_to_update.append('calories_burned = %s')
        values.append(data['calories_burned'])

    if not fields_to_update:
        return jsonify({"message": "No fields to update"}), 400

    values.append(workout_id)
    
    sql = f"""
        UPDATE Workouts
        SET {', '.join(fields_to_update)}
        WHERE workout_id = %s
    """

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute(sql, tuple(values))
        db.commit()

        if cursor.rowcount > 0:
            return jsonify({"message": "Workout updated successfully!"}), 200
        else:
            return jsonify({"message": f"Workout with ID {workout_id} not found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()

#Update exercise
@app.route('/exercises/<int:exercise_id>', methods=['PUT'])
def update_exercise(exercise_id):
    data = request.get_json()

    fields_to_update = []
    values = []

    if 'exercise_name' in data:
        fields_to_update.append('exercise_name = %s')
        values.append(data['exercise_name'])

    if 'sets' in data:
        fields_to_update.append('sets = %s')
        values.append(data['sets'])

    if 'reps_per_set' in data:
        fields_to_update.append('reps_per_set = %s')
        values.append(data['reps_per_set'])

    if 'duration' in data:
        fields_to_update.append('duration = %s')
        values.append(data['duration'])

    if 'calories_burned_per_exercise' in data:
        fields_to_update.append('calories_burned_per_exercise = %s')
        values.append(data['calories_burned_per_exercise'])

    if not fields_to_update:
        return jsonify({"message": "No fields to update"}), 400

    values.append(exercise_id)
    
    sql = f"""
        UPDATE Exercises
        SET {', '.join(fields_to_update)}
        WHERE exercise_id = %s
    """

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute(sql, tuple(values))
        db.commit()

        if cursor.rowcount > 0:
            return jsonify({"message": "Exercise updated successfully!"}), 200
        else:
            return jsonify({"message": f"Exercise with ID {exercise_id} not found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()

#Update goal
@app.route('/goals/<int:goal_id>', methods=['PUT'])
def update_goal(goal_id):
    data = request.get_json()

    fields_to_update = []
    values = []

    if 'goal_type' in data:
        fields_to_update.append('goal_type = %s')
        values.append(data['goal_type'])

    if 'target_value' in data:
        fields_to_update.append('target_value = %s')
        values.append(data['target_value'])

    if 'current_progress' in data:
        fields_to_update.append('current_progress = %s')
        values.append(data['current_progress'])

    if 'deadline' in data:
        fields_to_update.append('deadline = %s')
        values.append(data['deadline'])

    if 'status' in data:
        fields_to_update.append('status = %s')
        values.append(data['status'])

    if not fields_to_update:
        return jsonify({"message": "No fields to update"}), 400

    values.append(goal_id)
    
    sql = f"""
        UPDATE Goals
        SET {', '.join(fields_to_update)}
        WHERE goal_id = %s
    """

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute(sql, tuple(values))
        db.commit()

        if cursor.rowcount > 0:
            return jsonify({"message": "Goal updated successfully!"}), 200
        else:
            return jsonify({"message": f"Goal with ID {goal_id} not found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()

#Update diet
@app.route('/diet/<int:diet_id>', methods=['PUT'])
def update_diet(diet_id):
    data = request.get_json()

    fields_to_update = []
    values = []

    if 'meal_type' in data:
        fields_to_update.append('meal_type = %s')
        values.append(data['meal_type'])

    if 'calories' in data:
        fields_to_update.append('calories = %s')
        values.append(data['calories'])

    if 'protein' in data:
        fields_to_update.append('protein = %s')
        values.append(data['protein'])

    if 'carbs' in data:
        fields_to_update.append('carbs = %s')
        values.append(data['carbs'])

    if 'fats' in data:
        fields_to_update.append('fats = %s')
        values.append(data['fats'])

    if not fields_to_update:
        return jsonify({"message": "No fields to update"}), 400

    values.append(diet_id)
    
    sql = f"""
        UPDATE Diet
        SET {', '.join(fields_to_update)}
        WHERE diet_id = %s
    """

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute(sql, tuple(values))
        db.commit()

        if cursor.rowcount > 0:
            return jsonify({"message": "Diet entry updated successfully!"}), 200
        else:
            return jsonify({"message": f"Diet entry with ID {diet_id} not found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()

#Update progress
@app.route('/progress/<int:progress_id>', methods=['PUT'])
def update_progress(progress_id):
    data = request.get_json()

    fields_to_update = []
    values = []

    if 'workout_count' in data:
        fields_to_update.append('workout_count = %s')
        values.append(data['workout_count'])

    if 'calories_burned' in data:
        fields_to_update.append('calories_burned = %s')
        values.append(data['calories_burned'])

    if 'weight' in data:
        fields_to_update.append('weight = %s')
        values.append(data['weight'])

    if not fields_to_update:
        return jsonify({"message": "No fields to update"}), 400

    values.append(progress_id)
    
    sql = f"""
        UPDATE Progress
        SET {', '.join(fields_to_update)}
        WHERE progress_id = %s
    """

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute(sql, tuple(values))
        db.commit()

        if cursor.rowcount > 0:
            return jsonify({"message": "Progress entry updated successfully!"}), 200
        else:
            return jsonify({"message": f"Progress entry with ID {progress_id} not found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()

#Procedure call
@app.route('/workouts/<int:user_id>', methods=['GET'])
def get_user_workouts(user_id):
    db = get_db()
    cursor = db.cursor()

    try:
        # Call the stored procedure
        cursor.execute("CALL GetUserWorkouts(%s);", (user_id,))
        results = cursor.fetchall()

        if results:
            # Format the output
            formatted_results = [
                {
                    "workout_id": row[0],
                    "workout_type": row[1],
                    "duration": row[2],
                    "calories_burned": row[3]
                } for row in results
            ]
            return jsonify(formatted_results), 200
        else:
            return jsonify({"message": "No workouts found for this user."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()

@app.route('/workout_by_id/<int:workout_id>', methods=['GET'])
def get_workout_by_id(workout_id):
    db = get_db()
    cursor = db.cursor()

    try:
        # Query to fetch the workout by its ID
        sql = "SELECT workout_id, workout_type, duration, calories_burned, user_id FROM Workouts WHERE workout_id = %s"
        cursor.execute(sql, (workout_id,))
        workout = cursor.fetchone()

        if workout:
            # Format the result
            formatted_result = {
                "workout_id": workout[0],
                "workout_type": workout[1],
                "duration": workout[2],
                "calories_burned": workout[3],
                "user_id": workout[4]
            }
            return jsonify(formatted_result), 200
        else:
            return jsonify({"message": "Workout not found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()


#Transaction
@app.route('/workouts_with_exercises', methods=['POST'])
def add_workout_with_exercises():
    db = get_db()
    cursor = db.cursor()

    data = request.json  
    user_id = data.get("user_id")
    workout_details = data.get("workout_details")
    exercises = data.get("exercises")

    try:
        db.begin()  

        # Insert a new workout
        workout_sql = """
            INSERT INTO Workouts (user_id, workout_type, duration, calories_burned)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(workout_sql, (
            user_id,
            workout_details.get("workout_type"),
            workout_details.get("duration"),
            workout_details.get("calories_burned"),
        ))
        workout_id = cursor.lastrowid  # Get the ID of the new workout

        # Insert exercises for the workout
        exercises_sql = """
            INSERT INTO Exercises (workout_id, exercise_name, sets, reps_per_set, duration, calories_burned_per_exercise)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        formatted_exercises = [
            (
                workout_id,
                exercise["exercise_name"],
                exercise["sets"],
                exercise["reps_per_set"],
                exercise["duration"],
                exercise["calories_burned_per_exercise"]
            )
            for exercise in exercises
        ]
        cursor.executemany(exercises_sql, formatted_exercises)

        db.commit()  
        return jsonify({"message": "Workout and exercises added successfully!"}), 201
    except Exception as e:
        db.rollback()  # Rollback the transaction in case of error
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()


# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)


# %%
