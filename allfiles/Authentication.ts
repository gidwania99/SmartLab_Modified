var otp
var otp_counter

function signIn() {
    console.log('called')
    var data = {
        'email': $('#inputEmail').val(),
        'password': $('#inputPassword').val()
    };
    $.ajax({
        type: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        url: 'http://127.0.0.1:5000/signIn',
        crossDomain: true,
        data: JSON.stringify(data),
        success: function (response) {
            console.log(response)
            if (response['status'] == 0) {
                localStorage.setItem('email', response['email']);
                localStorage.setItem('name' , response['name']);
                window.location.href = 'Introduction.html';
            }
            else {
                $('#inputPassword').val('');
                $('#error').html("*" + response['msg']);
            }
        },
        error: function (error) {
            console.log(error);
            //$('#error').html(error);
        }
    });
}

function validateEmail(){
    $('#message').html('')
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var userInput:HTMLInputElement = <HTMLInputElement> document.getElementById('inputEmail')
    if(!userInput.value.match(mailformat)){
        userInput.value = ''
        userInput.focus()
        $('#message').html('*Enter Valid Email Address!!')
    }
}

$(function(){
    $('#inputPassword').keypress(function(event){
        if(event.keyCode === 13){
            if(document.title == 'Sign In')
                signIn()
            else
                signup()
        }
    });
});

function signup(){
    var fname = $('#fname').val().toString()
    var lname = $('#lname').val().toString()
    var email = $('#inputEmail').val().toString()
    var password = $('#inputPassword').val().toString()
    if(fname != '' && email != '' && password != ''){
        sessionStorage.setItem('fname',fname)
        sessionStorage.setItem('lname',lname)
        sessionStorage.setItem('email',email)
        sessionStorage.setItem('password',password)
        var otp_sent_status = sendOtp(email)
        if(otp_sent_status == 0){
            document.getElementById('verify_email').style.display = 'block'
            document.getElementById('otp_textbox').focus()
            document.getElementById('signup_details').style.display = 'none'
            otp_timer()
        }
        else{ 
            $('#inputEmail').val('').focus()
            $('#inputPassword').val('')
            if(otp_sent_status == 1)
                $('#message').html('*A user with this email address already exists!')
            else
                $('#message').html('*Check Your Email Address!!')
        }

    }
    else{
        $('#message').html("*Enter Required Fields!")
    }
}

function sendOtp(email){
    var verify_data = {'email': email}
    var status
    $.ajax({ 
        type: "POST",
        async:false,
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        url: 'http://127.0.0.1:5000/emailVerification',
        crossDomain: true,
        data: JSON.stringify(verify_data),
        success: function(response) {
           if(response['status'] == 0){
                otp = response['otp']
                status = 0
           }
           else
                status = response['status']
        },
        error: function(error) {
            console.log(error)
        }
    });
    return status
}


function addUser() {
    clearInterval(otp_counter)
    var otp_txt:HTMLInputElement = <HTMLInputElement>document.getElementById('otp_textbox')
    if(otp_txt.value.toString() == otp){
        var data = {
            'fname': sessionStorage.getItem('fname'),
            'lname': sessionStorage.getItem('lname'),
            'email': sessionStorage.getItem('email'),
            'password': sessionStorage.getItem('password')
        }
        $.ajax({ 
            type: "POST",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            url: 'http://127.0.0.1:5000/signUp',
            crossDomain: true,
            data: JSON.stringify(data),
            success: function(response) {
                alert(response['msg'])
                localStorage.setItem('email' , sessionStorage.getItem('email'))
                localStorage.setItem('name' , sessionStorage['fname'])
                sessionStorage.clear()
                window.location.href = 'Introduction.html'
            }
        });
    }
    else{
        document.getElementById('verify_email').style.display = 'none'
        document.getElementById('signup_details').style.display = 'block'
        $('#message').html('*Incorrect OTP, check your email!!!')
    }
}


function otp_timer(){
    var otp_sec = 60
    otp_counter = setInterval(() => {
        otp_sec -= 1
        if(otp_sec == 0){
            clearInterval(otp_counter)
            document.getElementById('verify_email').style.display = 'none'
            document.getElementById('signup_details').style.display = 'block'
            $('#inputEmail').val('')
            $('#inputPassword').val('')
            $('#message').html('*OTP Expired!!!')
        }
        else
            document.getElementById('otp_timer').innerHTML = otp_sec.toString()
    },
        1000
    );
}

function resend_otp(){
    clearInterval(otp_counter)
    signup()
}

function changePassword(){
    var currentPassword = $('#currentPassword').val()
    var newPassword = $('#newPassword').val()
    var confirmPassword = $('#confirmPassword').val()
    if(currentPassword !='' && newPassword !='' && confirmPassword !=''){
        if(newPassword == confirmPassword){
            var data = {
                'email':email,
                'currentPassword':currentPassword,
                'newPassword':newPassword
            }
            $.ajax({
                type: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                url: 'http://127.0.0.1:5000/changePassword',
                crossDomain: true,
                data: JSON.stringify(data),
                success: function(response) {
                    console.log(response)
                    if(response['status'] == true){
                        alert('Password Changed Succesfully!!')
                        window.location.href = 'Introduction.html'
                    }
                    else{
                        $('#message').html('Incorrect Current Password')
                        $('#currentPassword').val('').focus()
                        $('#newPassword').val('')
                        $('#confirmPassword').val('')
                    }
                }
            });
        }
        else{
            $('#message').html('New Password and Confirm Password does not match!')
            $('#newPassword').val('').focus()
            $('#confirmPassword').val('')
        }
    }
}

function forgotPassword(){
    var data = {
        'email': $('#email').val()
    }
    $.ajax({
        type: "POST",
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        url: 'http://127.0.0.1:5000/forgotPassword',
        crossDomain: true,
        data: JSON.stringify(data),
        success: function(response) {}
    });
}
