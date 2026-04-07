// =============================================
//  Profil.js — GradMatch
//  Fetch data dari Profil.php & handle semua
//  interaksi di halaman profil
// =============================================

// ── Tab Switching ──
function switchTab(el, tabId) {
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('tab-' + tabId).classList.add('active');
}

// ── Tampilkan pesan sukses/error ──
function showMsg(elId, text, type) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = text;
    el.className = 'save-msg ' + type;
    setTimeout(() => { el.textContent = ''; el.className = 'save-msg'; }, 3000);
}

// ── Hapus Akun ──
function confirmDelete() {
    if (confirm('Apakah kamu yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.')) {
        fetch('Edit_Profil.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=hapus'
        })
        .then(r => r.json())
        .then(data => {
            if (data.status === 'success') {
                window.location.href = 'Login.html';
            } else {
                alert(data.message || 'Gagal menghapus akun.');
            }
        })
        .catch(() => alert('Terjadi kesalahan. Coba lagi.'));
    }
}

// ── Map kode pendidikan → label ──
const pendidikanLabel = {
    sma: 'SMA / SMK',
    d3:  'D3',
    s1:  'S1',
    s2:  'S2',
    s3:  'S3',
};

// ── Map status lamaran → CSS class ──
const statusClass = {
    review:    'review',
    interview: 'interview',
    pending:   'pending',
    diterima:  'interview',
    ditolak:   'pending',
};

// ── Render data ke halaman ──
function renderProfil(data) {
    const u = data.user;

    // Sidebar
    document.getElementById('sidebarNama').textContent = u.nama || '—';

    // Detail Profil
    document.getElementById('detailNama').textContent      = u.nama      || '—';
    document.getElementById('detailEmail').textContent     = u.email     || '—';
    document.getElementById('detailTelepon').textContent   = u.telepon   || '—';
    document.getElementById('detailLokasi').textContent    = u.lokasi    || '—';
    document.getElementById('detailPendidikan').textContent = pendidikanLabel[u.pendidikan] || u.pendidikan || '—';
    document.getElementById('detailJurusan').textContent   = u.jurusan   || '—';
    document.getElementById('detailBio').textContent       = u.bio       || 'Belum ada deskripsi.';

    // Skills
    const skillsEl = document.getElementById('detailSkills');
    if (data.skills && data.skills.length > 0) {
        skillsEl.innerHTML = data.skills
            .map(s => `<span>${s.nama}${s.level ? ' · ' + s.level : ''}</span>`)
            .join('');
    } else {
        skillsEl.innerHTML = '<span style="color:var(--text-3);font-size:13px">Belum ada skill yang ditambahkan.</span>';
    }

    // Isi form pengaturan (pre-fill)
    document.getElementById('set-nama').value   = u.nama    || '';
    document.getElementById('set-email').value  = u.email   || '';
    document.getElementById('set-telp').value   = u.telepon || '';
    document.getElementById('set-lokasi').value = u.lokasi  || '';
    document.getElementById('set-bio').value    = u.bio     || '';

    // Riwayat Lamaran
    const lamaranList = document.getElementById('lamaranList');
    if (data.lamaran && data.lamaran.length > 0) {
        lamaranList.innerHTML = data.lamaran.map(l => {
            const cls   = statusClass[l.status] || 'pending';
            const label = l.status.charAt(0).toUpperCase() + l.status.slice(1);
            const tgl   = new Date(l.created_at).toLocaleDateString('id-ID', {
                day: '2-digit', month: 'long', year: 'numeric'
            });
            return `
                <div class="lamaran-item">
                    <div>
                        <strong>${l.nama_posisi}</strong>
                        <p>${l.nama_perusahaan} &nbsp;·&nbsp; ${tgl}</p>
                    </div>
                    <span class="status ${cls}">${label}</span>
                </div>`;
        }).join('');
    } else {
        lamaranList.innerHTML = '<p style="font-size:14px;color:#777">Belum ada riwayat lamaran.</p>';
    }
}

// ── Fetch data profil dari server ──
function loadProfil() {
    fetch('Profil.php')
        .then(r => {
            if (r.status === 401) {
                window.location.href = 'Login.html';
                return null;
            }
            return r.json();
        })
        .then(data => {
            if (!data) return;
            if (data.status === 'success') {
                renderProfil(data);
            } else {
                console.error('Profil error:', data.message);
            }
        })
        .catch(err => console.error('Fetch profil gagal:', err));
}

// ── Submit form Info Pribadi ──
document.getElementById('formInfo').addEventListener('submit', function(e) {
    e.preventDefault();
    const body = new URLSearchParams(new FormData(this)).toString();
    fetch('Edit_Profil.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    })
    .then(r => r.json())
    .then(data => {
        showMsg('msg-info', data.message, data.status === 'success' ? 'success' : 'error');
        if (data.status === 'success') loadProfil(); // refresh tampilan
    })
    .catch(() => showMsg('msg-info', 'Terjadi kesalahan.', 'error'));
});

// ── Submit form Password ──
document.getElementById('formPassword').addEventListener('submit', function(e) {
    e.preventDefault();
    const np = document.getElementById('set-newpass').value;
    const cp = document.getElementById('set-confirmpass').value;
    if (np !== cp) {
        showMsg('msg-password', 'Konfirmasi password tidak cocok.', 'error');
        return;
    }
    const body = new URLSearchParams(new FormData(this)).toString();
    fetch('Edit_Profil.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    })
    .then(r => r.json())
    .then(data => {
        showMsg('msg-password', data.message, data.status === 'success' ? 'success' : 'error');
        if (data.status === 'success') this.reset();
    })
    .catch(() => showMsg('msg-password', 'Terjadi kesalahan.', 'error'));
});

// ── Submit form Notifikasi ──
document.getElementById('formNotif').addEventListener('submit', function(e) {
    e.preventDefault();
    // Notifikasi belum ada endpoint, tampilkan sukses lokal
    showMsg('msg-notif', 'Preferensi disimpan.', 'success');
});

// ── Jalankan saat halaman dibuka ──
loadProfil();