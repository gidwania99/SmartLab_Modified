//static/js/signUp.js
$(function() {
    $('#btnSignUp').click(function() {
        var data ={
                'fname': $('#fname').val(),
                'lname': $('#lname').val(),
                'username': $('#inputEmail').val(),
                'password': $('#inputPassword').val()
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
                //response = JSON.stringify(response)
                console.log(response); alert(response['msg'])
                $('#message').html(response['msg']);
                if(response['status'] == 0){
                    window.location.href = 'signin.html';
                }
            },
            error: function(error) {
                console.log(error);
                $('#message').html(error);
            }
        });
    });
});