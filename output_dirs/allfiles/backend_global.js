var min = 0;
var sec = 0;
var sim_min = 0;
var sim_sec = 0;
var email;
function checkAuth(page = null, experiment = null) {
    if (localStorage.getItem('email') == null) {
        if (experiment == 'Stack' || experiment == 'BST' || page == 'Aim' || page == 'Index')
            window.location.href = '../signin.html';
        else if (experiment == null)
            window.location.href = 'signin.html';
        else
            window.location.href = '../../signin.html';
    }
    email = localStorage.getItem('email');
    $('#welcomeMsg').html('Welcome ' + localStorage.getItem('name'));
    /*if(sessionStorage.getItem('currentPage') != null)
        footPrint(page , experiment)*/
    if (experiment != null) {
        sessionStorage.setItem('currentPage', page);
        sessionStorage.setItem('currentExperiment', experiment);
        recordTime();
    }
}
function logout(directory_level) {
    if (sessionStorage.getItem('currentPage') != null)
        footPrint();
    sessionStorage.clear();
    localStorage.clear();
    if (directory_level == 0)
        window.location.href = 'signin.html';
    else if (directory_level == 1)
        window.location.href = '../signin.html';
    else
        window.location.href = '../../signin.html';
}
window.addEventListener('beforeunload', function (e) {
    if (sessionStorage.getItem('currentPage') != null) {
        sessionStorage.setItem('min', min.toString());
        sessionStorage.setItem('sec', sec.toString());
    }
});
function footPrint(link = null, page = null, experiment = null) {
    if (sessionStorage.getItem('currentPage') != null) {
        var data = {
            "email": email,
            "page": sessionStorage.getItem('currentPage'),
            "experiment": sessionStorage.getItem('currentExperiment'),
            "min": min,
            "sec": sec,
            "moveToPage": page,
            "moveToExperiment": experiment
        };
        $.ajax({
            type: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            url: 'http://127.0.0.1:5000/addFootPrints',
            crossDomain: true,
            data: JSON.stringify(data),
            success: function (response) {
                console.log(response);
            }
        });
    }
    if (link != null)
        window.location.href = link;
}
function recordTime() {
    min = sec = 0;
    setInterval(() => {
        if (sec < 60)
            sec += 1;
        else {
            min += 1;
            sec = 0;
        }
    }, 1000);
}
function simulationRecord(falseCount, experiment) {
    var data = {
        'email': email,
        'experiment': experiment,
        'error': falseCount,
        'min': (min - sim_min),
        'sec': (sec - sim_sec)
    };
    $.ajax({
        type: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        url: 'http://127.0.0.1:5000/simulationRecord',
        crossDomain: true,
        data: JSON.stringify(data),
        success: function (response) {
            console.log(response);
        }
    });
}
function testScore(score, experiment, tmin, tsec) {
    var data = {
        'email': email,
        'experiment': experiment,
        'score': score,
        'min': tmin,
        'sec': tsec
    };
    $.ajax({
        type: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        url: 'http://127.0.0.1:5000/testScore',
        crossDomain: true,
        data: JSON.stringify(data),
        success: function (response) {
            console.log(response);
        }
    });
}
function updateLeaderBoard(score, experiment, gmin, gsec) {
    var data = {
        'email': email,
        'experiment': experiment,
        'score': score,
        'min': gmin,
        'sec': gsec
    };
    $.ajax({
        type: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        url: 'http://127.0.0.1:5000/updateLeaderBoard',
        crossDomain: true,
        data: JSON.stringify(data),
        success: function (response) {
            console.log(response);
        }
    });
}
function getHighScore(experiment) {
    $("#highscoreTable tbody").remove();
    var data = {
        'email': email,
        'experiment': experiment
    };
    $.ajax({
        type: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        url: 'http://127.0.0.1:5000/getHighScore',
        crossDomain: true,
        data: JSON.stringify(data),
        success: function (response) {
            var len = response.length;
            var table = document.getElementById('highscoreTable');
            table.className = "table table-dark table-striped";
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            cell1.innerHTML = 'Played on';
            cell2.innerHTML = 'Score';
            cell3.innerHTML = 'Time Taken';
            for (var i = 0; i < len; i++) {
                row = table.insertRow(i + 1);
                cell1 = row.insertCell(0);
                cell2 = row.insertCell(1);
                cell3 = row.insertCell(2);
                cell1.innerHTML = response[i]['date'];
                cell2.innerHTML = response[i]['score'];
                cell3.innerHTML = response[i]['time_taken']['min'] + ' : ' + response[i]['time_taken']['sec'];
            }
        }
    });
}
//# sourceMappingURL=backend_global.js.map