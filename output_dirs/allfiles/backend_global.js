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
//# sourceMappingURL=backend_global.js.map