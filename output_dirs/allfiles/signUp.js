//static/js/signUp.js
$(function(){
    $('#inputPassword').keypress(function(event){
        if(event.keyCode === 13){
            $('#btnSignUp').click();
        }
    });
});
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
                $('#message').html("*" + response['msg']);
                if(response['status'] == 0){
                    window.location.href = 'signin.html';
                }
                else{
                    $('#inputEmail').val('');
                    $('#inputPassword').val('');
                }
            },
            error: function(error) {
                console.log(error);
                $('#message').html(error);
            }
        });
    });
});