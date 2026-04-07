function handleSubmit(e) {
    e.preventDefault();
    const fileInput = document.getElementById('cvFile');
    const errorEl  = document.getElementById('fileError');
    const file     = fileInput.files[0];
    errorEl.textContent = '';
    if (!file) { errorEl.textContent = 'Pilih file CV terlebih dahulu.'; return; }
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
        errorEl.textContent = 'Format tidak didukung. Gunakan file PDF atau DOCX.';
        fileInput.value = '';
        return;
    }
    window.location.href = 'hasil.html';
}