$(function(){
    $('#inputPassword').keypress(function(event){
        if(event.keyCode === 13){
            $('#btnSignIn').click();
        }
    });
});

$(function(){
    $('#btnSignIn').click(function(){
        var data = {
            'username': $('#inputEmail').val(),
            'password': $('#inputPassword').val()
        }
        $.ajax({
            type: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            url: 'http://127.0.0.1:5000/signIn',
            crossDomain: true,
            data: JSON.stringify(data),
            success: function(response){
                if(response['status'] == 0){
                    window.sessionStorage.setItem('email' , response['session_name'])
                    window.location.href = 'Introduction.html';
                }
                else{
                    $('#inputPassword').val('');
                    $('#error').html("*" + response['msg']);
                }
            },
            error: function(error){
                console.log(error);
                $('#error').html(error);
            }
            
        });
    });
});