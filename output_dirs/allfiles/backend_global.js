function checkAuth() {
    if (sessionStorage.getItem('username') == null) {
        window.location.href = 'signin.html';
    }
    else {
        document.getElementById('username').innerHTML = sessionStorage.getItem('username');
    }
}
function logout() {
    sessionStorage.removeItem('username');
    window.location.href = 'signin.html';
}
function footPrint() {
    var data = {
        "title": document.title,
        "username": sessionStorage.getItem('username')
    };
    /*$.ajax({
        type: 'POST',
        headers:{
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        url: '',
        crossDomain: true,
        data: JSON.stringify(data),
        success: function(response){
            console.log(response)
        }
    });*/
}
//# sourceMappingURL=backend_global.js.map