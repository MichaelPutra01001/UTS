// admin_jobs.js

// Ambil semua lowongan saat halaman dibuka
window.onload = function() {
  ambilJobs();
}

// Ambil data dari PHP dan tampilkan ke tabel
function ambilJobs() {
  fetch('admin_jobs.php?aksi=list')
    .then(res => res.json())
    .then(data => {
      tampilkanTabel(data);
    });
}

// Render tabel
function tampilkanTabel(jobs) {
  var tbody = document.getElementById('tabelBody');

  if (jobs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Belum ada lowongan.</td></tr>';
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
    html += '<td>';
    html += '<button class="btn-edit" onclick="editJob(' + j.id + ')">Edit</button>';
    html += '<button class="btn-hapus" onclick="hapusJob(' + j.id + ')">Hapus</button>';
    html += '</td>';
    html += '</tr>';
  }
  tbody.innerHTML = html;
}

// Tampilkan form kosong untuk tambah
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

// Isi form untuk edit
function editJob(id) {
  fetch('admin_jobs.php?aksi=detail&id=' + id)
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

// Tutup form
function tutupForm() {
  document.getElementById('formBox').style.display = 'none';
}

// Simpan data (tambah atau edit)
function simpanJob() {
  var id         = document.getElementById('jobId').value;
  var posisi     = document.getElementById('posisi').value.trim();
  var perusahaan = document.getElementById('perusahaan').value.trim();
  var lokasi     = document.getElementById('lokasi').value.trim();
  var tipe       = document.getElementById('tipe').value;

  // Validasi sederhana
  if (posisi === '' || perusahaan === '' || lokasi === '') {
    document.getElementById('pesanError').innerText = 'Semua field wajib diisi!';
    document.getElementById('pesanError').style.display = 'block';
    return;
  }

  // Kirim ke PHP pakai FormData
  var formData = new FormData();
  formData.append('aksi', id ? 'update' : 'tambah');
  formData.append('id', id);
  formData.append('posisi', posisi);
  formData.append('perusahaan', perusahaan);
  formData.append('lokasi', lokasi);
  formData.append('tipe', tipe);

  fetch('admin_jobs.php', {
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

// Hapus lowongan
function hapusJob(id) {
  var yakin = confirm('Yakin ingin menghapus lowongan ini?');
  if (!yakin) return;

  var formData = new FormData();
  formData.append('aksi', 'hapus');
  formData.append('id', id);

  fetch('admin_jobs.php', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'ok') {
      ambilJobs();
    }
  });
}

// Helper badge CSS class
function getBadge(tipe) {
  if (tipe === 'Full Time')   return 'badge-fulltime';
  if (tipe === 'Part Time')   return 'badge-parttime';
  if (tipe === 'Remote')      return 'badge-remote';
  if (tipe === 'Hybrid')      return 'badge-hybrid';
  if (tipe === 'Contract')    return 'badge-contract';
  if (tipe === 'Partnership') return 'badge-partnership';
  return '';
}