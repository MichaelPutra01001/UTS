// recruiter_jobs.js

// Ambil data saat halaman dibuka
window.onload = function() {
  ambilJobs();
  ambilPelamar();
}

// Ganti tab (Lowongan / Pelamar)
function gantiTab(tab) {
  if (tab === 'lowongan') {
    document.getElementById('halamanLowongan').style.display = 'block';
    document.getElementById('halamanPelamar').style.display = 'none';
    document.getElementById('tab-lowongan').classList.add('active');
    document.getElementById('tab-pelamar').classList.remove('active');
  } else {
    document.getElementById('halamanLowongan').style.display = 'none';
    document.getElementById('halamanPelamar').style.display = 'block';
    document.getElementById('tab-lowongan').classList.remove('active');
    document.getElementById('tab-pelamar').classList.add('active');
  }
  return false; // cegah link pindah halaman
}

// ========================
// BAGIAN LOWONGAN
// ========================

function ambilJobs() {
  fetch('recruiter_jobs.php?aksi=list')
    .then(res => res.json())
    .then(data => {
      tampilkanTabel(data);
    });
}

function tampilkanTabel(jobs) {
  var tbody = document.getElementById('tabelBody');

  if (jobs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Belum ada lowongan.</td></tr>';
    return;
  }

  var html = '';
  for (var i = 0; i < jobs.length; i++) {
    var j = jobs[i];
    html += '<tr>';
    html += '<td>' + (i + 1) + '</td>';
    html += '<td>' + j.posisi + '</td>';
    html += '<td>' + j.perusahaan + '</td>';
    html += '<td>' + j.lokasi + '</td>';
    html += '<td><span class="badge ' + getBadge(j.tipe) + '">' + j.tipe + '</span></td>';
    html += '<td>' + (j.jumlah_pelamar || 0) + ' orang</td>';
    html += '<td>';
    html += '<button class="btn-edit" onclick="editJob(' + j.id + ')">Edit</button>';
    html += '<button class="btn-hapus" onclick="hapusJob(' + j.id + ')">Hapus</button>';
    html += '</td>';
    html += '</tr>';
  }
  tbody.innerHTML = html;
}

function showForm() {
  document.getElementById('formTitle').innerText = 'Tambah Lowongan';
  document.getElementById('jobId').value = '';
  document.getElementById('posisi').value = '';
  document.getElementById('perusahaan').value = '';
  document.getElementById('lokasi').value = '';
  document.getElementById('tipe').value = 'Full Time';
  document.getElementById('pesanError').style.display = 'none';
  document.getElementById('formBox').style.display = 'block';
}

function editJob(id) {
  fetch('recruiter_jobs.php?aksi=detail&id=' + id)
    .then(res => res.json())
    .then(j => {
      document.getElementById('formTitle').innerText = 'Edit Lowongan';
      document.getElementById('jobId').value = j.id;
      document.getElementById('posisi').value = j.posisi;
      document.getElementById('perusahaan').value = j.perusahaan;
      document.getElementById('lokasi').value = j.lokasi;
      document.getElementById('tipe').value = j.tipe;
      document.getElementById('pesanError').style.display = 'none';
      document.getElementById('formBox').style.display = 'block';
      window.scrollTo(0, 0);
    });
}

function tutupForm() {
  document.getElementById('formBox').style.display = 'none';
}

function simpanJob() {
  var id         = document.getElementById('jobId').value;
  var posisi     = document.getElementById('posisi').value.trim();
  var perusahaan = document.getElementById('perusahaan').value.trim();
  var lokasi     = document.getElementById('lokasi').value.trim();
  var tipe       = document.getElementById('tipe').value;

  if (posisi === '' || perusahaan === '' || lokasi === '') {
    document.getElementById('pesanError').innerText = 'Semua field wajib diisi!';
    document.getElementById('pesanError').style.display = 'block';
    return;
  }

  var formData = new FormData();
  formData.append('aksi', id ? 'update' : 'tambah');
  formData.append('id', id);
  formData.append('posisi', posisi);
  formData.append('perusahaan', perusahaan);
  formData.append('lokasi', lokasi);
  formData.append('tipe', tipe);

  fetch('recruiter_jobs.php', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'ok') {
      tutupForm();
      ambilJobs();
    } else {
      document.getElementById('pesanError').innerText = data.pesan;
      document.getElementById('pesanError').style.display = 'block';
    }
  });
}

function hapusJob(id) {
  var yakin = confirm('Yakin ingin menghapus lowongan ini?');
  if (!yakin) return;

  var formData = new FormData();
  formData.append('aksi', 'hapus');
  formData.append('id', id);

  fetch('recruiter_jobs.php', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'ok') {
      ambilJobs();
      ambilPelamar();
    }
  });
}

// ========================
// BAGIAN PELAMAR
// ========================

function ambilPelamar() {
  fetch('recruiter_jobs.php?aksi=pelamar')
    .then(res => res.json())
    .then(data => {
      tampilkanPelamar(data);
    });
}

function tampilkanPelamar(list) {
  var tbody = document.getElementById('tabelPelamar');

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Belum ada pelamar.</td></tr>';
    return;
  }

  var html = '';
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    html += '<tr>';
    html += '<td>' + (i + 1) + '</td>';
    html += '<td>' + p.nama + '</td>';
    html += '<td>' + p.email + '</td>';
    html += '<td>' + p.posisi + '</td>';
    html += '<td><span class="status-' + p.status + '">' + p.status + '</span></td>';
    html += '<td>';
    html += '<select onchange="ubahStatus(' + p.id + ', this.value)" style="font-family:Poppins,sans-serif; font-size:13px; padding:4px 8px; border:1px solid #e2e8f0; border-radius:6px;">';
    html += '<option value="pending"'  + (p.status === 'pending'  ? ' selected' : '') + '>Pending</option>';
    html += '<option value="direview"' + (p.status === 'direview' ? ' selected' : '') + '>Direview</option>';
    html += '<option value="diterima"' + (p.status === 'diterima' ? ' selected' : '') + '>Diterima</option>';
    html += '<option value="ditolak"'  + (p.status === 'ditolak'  ? ' selected' : '') + '>Ditolak</option>';
    html += '</select>';
    html += '</td>';
    html += '</tr>';
  }
  tbody.innerHTML = html;
}

function ubahStatus(appId, statusBaru) {
  var formData = new FormData();
  formData.append('aksi', 'ubah_status');
  formData.append('app_id', appId);
  formData.append('status', statusBaru);

  fetch('recruiter_jobs.php', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'ok') {
      ambilPelamar(); // refresh tabel
    }
  });
}

// Helper badge
function getBadge(tipe) {
  if (tipe === 'Full Time')   return 'badge-fulltime';
  if (tipe === 'Part Time')   return 'badge-parttime';
  if (tipe === 'Remote')      return 'badge-remote';
  if (tipe === 'Hybrid')      return 'badge-hybrid';
  if (tipe === 'Contract')    return 'badge-contract';
  if (tipe === 'Partnership') return 'badge-partnership';
  return '';
}