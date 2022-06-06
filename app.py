#app.py
from flask import Flask, render_template, request, json, redirect, session , jsonify
from flask_mongoengine import MongoEngine
from grpc import server #ModuleNotFoundError: No module named 'flask_mongoengine' = (venv) C:\flaskmyproject>pip install flask-mongoengine
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_cors import CORS
import random
import smtplib , ssl
from email.message import EmailMessage
 


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
    date = db.DateTimeField(datetime.now)

def generateOTP():
    otp = ''
    for i in range(6):
        otp = otp + str(random.randint(0,9))
    return otp

def sendOTP(email):
    try:
        otp = generateOTP()
        email_content = 'To authenticate your email , please use the following One Time Password(OTP):\n' 
        + otp + '\n\nDo not Share this OTP with anyone.'
        msg = EmailMessage()
        msg['Subject'] = 'Email Verification'
        msg['From'] = 'smartlabsample@gmail.com'
        msg['to'] = email
        msg.set_content(email_content)
        server = smtplib.SMTP('smtp.gmail.com' , 587)
        server.starttls()
        server.login('smartlabsample@gmail.com' , 'auyyzooqnnufngcx')
        server.sendmail('smartlabsample@gmail.com' , email , str(msg))
        server.quit()    
        msg = {'otp': otp,
                'status': 0}
        return msg
    except smtplib.SMTPException:
        msg = {'status':2}
        return msg

@app.route('/emailVerification' , methods=['POST'])
def emailVerify():
    data = request.get_json()
    email = data['email']
    users = User.objects(email= email).first()
    if not users:
        msg = sendOTP(email)
        return jsonify(msg)
    else:
        msg = {"status":1}
        return jsonify(msg)

          
@app.route('/signUp', methods=['POST'])
def signUp():   
    today = datetime.today()    
    data = request.get_json()
    _fname = data['fname']
    _lname = data['lname']
    _email = data['email']
    _password = data['password']

    # create hashed password

    hashed_password = generate_password_hash(_password)
    usersave = User(firstName=_fname,lastName=_lname, email=_email, password= hashed_password, reg_date=today)
    usersave.save()
    msg =  {"msg":"You've Registered Successfully!",
            "status":0,
            }
    return jsonify(msg)
 
@app.route('/signIn', methods=['POST'])
def login():
    data = request.get_json()
    # Get Form Fields
    email = data['email']
    user_password = data['password']
    # Get user by username
    users = User.objects(email= email).count() 
    if users > 0:
        # Get stored hash
        user_rs = User.objects(email= email).first()
        password = user_rs['password']
        # Compare Passwords 
        if check_password_hash(password, user_password):
            msg = {"msg":"Successfully Logged In!",
                   "status":0,
                   "email":email,
                   "name":user_rs['firstName']}
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
    current_date = datetime.today()
    data = request.get_json()
    doc = LeaderBoard(email=data['email'],experiment=data['experiment'],score=data['score'] , date = current_date)
    doc.time_taken['min']=data['min']
    doc.time_taken['sec']=data['sec']
    doc.save()
    msg = {'status':True}
    return jsonify(msg)

@app.route('/getHighScore', methods=['POST'])
def getHighScore():
    data = request.get_json()
    data = LeaderBoard.objects(email=data['email'] , experiment=data['experiment']).order_by('-score','time_taken')
    objArray = []
    for obj in data:
        dataobj = {
            'date': obj['date'].strftime('%d/%m/%Y'),
            'score':obj['score'],
            'time_taken':obj['time_taken']
        }
        objArray.append(dataobj)
    return jsonify(objArray)

@app.route('/getFootPrints' , methods=['POST'])
def getFootPrint():
    data = FootPrints.objects.aggregate([
        {
            '$group': { '_id': "$page", 'sum_min': { '$sum': "$time_spent.min" }}
        }
    ])
    data_dict = list(data)
    return jsonify(data_dict)

def updatePassword(email , password):
    hashed_password = generate_password_hash(password)
    User.objects(email = email).update_one(set__password = hashed_password)
    
@app.route('/changePassword' , methods=['POST'])
def changePassword():
    data = request.get_json()
    user = User.objects(email= data['email']).first()
    if check_password_hash(user['password'] , data['currentPassword']):
        updatePassword(data['email'],data['newPassword'])
        msg = {'status':True}
    else:
        msg = {'status':False}
    return jsonify(msg)

if __name__ == '__main__':
    app.run(debug=True)

