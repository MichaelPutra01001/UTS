function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const err  = document.getElementById('errorMsg');
    if (!user || !pass) { err.textContent = 'Email dan password tidak boleh kosong.'; return; }
    err.textContent = '';
}
// TAMPILKAN ERROR DARI PHP
const params = new URLSearchParams(window.location.search);
const error = params.get('error');

if (error) {
    document.getElementById('errorMsg').textContent = error;
    window.history.replaceState({}, document.title, "Login.html");
}