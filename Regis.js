function handleRegister(e) {
    e.preventDefault();
    const err = document.getElementById('errorMsg');
    err.textContent = '';

    const nama     = document.getElementById('nama').value.trim();
    const email    = document.getElementById('email').value.trim();
    const pass     = document.getElementById('password').value;
    const confirm  = document.getElementById('confirm_password').value;
    const agree    = document.getElementById('agree').checked;

    // Validasi
    if (!nama || !email || !pass || !confirm) {
        err.textContent = 'Harap lengkapi semua kolom yang wajib diisi.';
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        err.textContent = 'Format email tidak valid.';
        return;
    }
    if (pass.length < 8) {
        err.textContent = 'Password minimal 8 karakter.';
        return;
    }
    if (pass !== confirm) {
        err.textContent = 'Konfirmasi password tidak cocok.';
        return;
    }
    if (!agree) {
        err.textContent = 'Kamu harus menyetujui syarat & ketentuan.';
        return;
    }
}

function togglePass(fieldId, btn) {
    const input = document.getElementById(fieldId);
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
    } else {
        input.type = 'password';
        btn.textContent = '👁';
    }
}