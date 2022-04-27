#app.py
from flask import Flask, render_template, request, json, redirect, session , jsonify
from flask_mongoengine import MongoEngine #ModuleNotFoundError: No module named 'flask_mongoengine' = (venv) C:\flaskmyproject>pip install flask-mongoengine
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_cors import CORS
 


app = Flask(__name__)
app.secret_key = 'SmartLab2022'
CORS(app)

app.config['MONGODB_SETTINGS'] = {
    'db': 'SmartLab',
    'host': 'localhost',
    'port': 27017
}

 
db = MongoEngine()
db.init_app(app)
 
class User(db.Document):
    firstName = db.StringField()
    lastName = db.StringField()
    email = db.StringField()
    password = db.StringField()
    reg_date = db.DateTimeField(datetime.now)
          
@app.route('/signUp', methods=['POST'])
def signUp():   
    today = datetime.today()    
    data = request.get_json()
    _fname = data['fname']
    _lname = data['lname']
    _email = data['username']
    _password = data['password']
    # validate the received values
    if _fname and _email and _password:
        _hashed_password = generate_password_hash(_password)
        _users = User.objects(email=_email).first()
        if not _users:
            usersave = User(firstName=_fname,lastName=_lname, email=_email, password=_hashed_password, reg_date=today)
            usersave.save()
            msg =  {"msg":"You've Registered Successfully!",
                    "status":0}
            return jsonify(msg)
        else:
            msg =  {"msg":"A user with this email address already exists!",
                    "status":1}
            return jsonify(msg)
    else:
        msg =  {"msg":"Enter the required fields!",
                "status":1}
        return jsonify(msg)
 
@app.route('/signIn', methods=['POST'])
def login():
    data = request.get_json()
    # Get Form Fields
    _username = data['username']
    _password = data['password']
    # Get user by username
    users = User.objects(email=_username).count() 
    if users > 0:
        # Get stored hash
        user_rs = User.objects(email=_username).first()
        password = user_rs['password']
        # Compare Passwords 
        if check_password_hash(password, _password):
            # Passed
            session['username'] = _username
            #session.permanent = True
            msg = {"msg":"Successfully Logged In!",
                   "status":0,
                   "session_name":session['username']}
            return jsonify(msg)
    msg = {"msg":"Invalid Username or Password!",
           "status":1}
    return jsonify(msg)
     
if __name__ == '__main__':
    #app.secret_key = 'SmartLab2022'
    app.run(debug=True)

