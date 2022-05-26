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


class FootPrints(db.Document):
    email = db.StringField()
    page = db.StringField()
    experiment = db.StringField()
    time_spent = db.DictField()
    moves_to = db.DictField()


class SimulationRecord(db.Document):
    email = db.StringField()
    experiment = db.StringField()
    error = db.IntField()
    time_taken = db.DictField()
    date = db.DateTimeField(datetime.now)

class TestScore(db.Document):
    email = db.StringField()
    experiment = db.StringField()
    score = db.FloatField()
    time_taken = db.DictField()
    date = db.DateTimeField(datetime.now)

class LeaderBoard(db.Document):
    email = db.StringField()
    experiment = db.StringField()
    score = db.FloatField()
    time_taken = db.DictField()
          
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


@app.route('/simulationRecord' , methods=['POST'])
def addSimulationRecord():
    time = datetime.today()
    data = request.get_json()
    doc = SimulationRecord(email=data['email'],experiment=data['experiment'],error=data['error'],date=time)
    doc.time_taken['min']=data['min']
    doc.time_taken['sec']=data['sec']
    doc.save()
    msg = {'status':True}
    return jsonify(msg)

@app.route('/testScore' , methods=['POST'])
def addTestScore():
    time = datetime.today()
    data = request.get_json()
    doc = TestScore(email=data['email'],experiment=data['experiment'],score=data['score'],date=time)
    doc.time_taken['min']=data['min']
    doc.time_taken['sec']=data['sec']
    doc.save()
    msg = {'status':True}
    return jsonify(msg)

@app.route('/addFootPrints' , methods=['POST'])
def addFootPrints():
    data = request.get_json()
    doc = FootPrints(email=data['email'],page=data['page'],experiment=data['experiment'])
    doc.time_spent['min']=data['min']
    doc.time_spent['sec']=data['sec']
    doc.moves_to['page']=data['moveToPage']
    doc.moves_to['experiment']=data['moveToExperiment']
    doc.save()
    msg={'status':True}
    return jsonify(msg)

@app.route('/updateLeaderBoard' , methods=['POST'])
def updateLeaderBoard():
    data = request.get_json()
    doc = LeaderBoard(email=data['email'],experiment=data['experiment'],score=data['score'])
    doc.time_taken['min']=data['min']
    doc.time_taken['sec']=data['sec']
    doc.save()
    msg = {'status':True}
    return jsonify(msg)

@app.route('/getLeaderBoard', methods=['POST'])
def getLeaderBoard():
    data = request.get_json()
    data = LeaderBoard.objects(experiment=data['experiment']).order_by('-score','time_taken')
    return jsonify(data)

@app.route('/getFootPrints' , methods=['POST'])
def getFootPrint():
    data = FootPrints.aggregate([
        {
            '$group': { '_id': "$experiment", 'sum_min': { '$sum': "$time_spent['min']" }}
        }
    ])
    data = jsonify(data)
    return data
         
if __name__ == '__main__':
    app.run(debug=True)

