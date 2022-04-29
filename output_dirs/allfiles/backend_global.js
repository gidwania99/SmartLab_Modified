var hour = 0;
var min = 0;
var sec = 0;
function checkAuth() {
    if (sessionStorage.getItem('username') == null) {
        window.location.href = 'signin.html';
    }
    /*else{
        //document.getElementById('username').innerHTML = sessionStorage.getItem('username');
    }*/
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
    $.ajax({
        type: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        url: 'http://127.0.0.1:5000/addFootprints',
        crossDomain: true,
        data: JSON.stringify(data),
        success: function (response) {
            console.log(response);
        }
    });
}
function recordTime() {
    hour = min = sec = 0;
    setInterval(() => {
        if (sec < 60)
            sec += 1;
        else {
            if (min < 60)
                min += 1;
            else {
                hour += 1;
                min = 0;
            }
            sec = 0;
        }
    }, 1000);
}
function simulationFootPrint(falseCount, topic) {
    var data = {
        'username': sessionStorage.getItem('username'),
        'topic': topic,
        'error': falseCount,
        'min': min,
        'sec': sec
    };
    $.ajax({
        type: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        url: 'http://127.0.0.1:5000/simulationFootPrints',
        crossDomain: true,
        data: JSON.stringify(data),
        success: function (response) {
            console.log(response);
        }
    });
}
//# sourceMappingURL=backend_global.js.map