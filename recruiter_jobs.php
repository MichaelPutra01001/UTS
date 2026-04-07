<?php
// recruiter_jobs.php
session_start();
require 'koneksi.php';

header('Content-Type: application/json');

// Cek role recruiter
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'recruiter') {
    echo json_encode(['status' => 'error', 'pesan' => 'Akses ditolak.']);
    exit;
}

$recruiter_id = $_SESSION['user_id'];
$aksi = $_GET['aksi'] ?? $_POST['aksi'] ?? '';

// ---- Tampilkan lowongan milik recruiter ini + jumlah pelamar ----
if ($aksi === 'list') {
    $stmt = $pdo->prepare('
        SELECT j.*, COUNT(a.id) AS jumlah_pelamar
        FROM jobs j
        LEFT JOIN applications a ON a.job_id = j.id
        WHERE j.recruiter_id = ?
        GROUP BY j.id
        ORDER BY j.id DESC
    ');
    $stmt->execute([$recruiter_id]);
    $jobs = $stmt->fetchAll();
    echo json_encode($jobs);
    exit;
}

// ---- Detail satu lowongan ----
if ($aksi === 'detail') {
    $id = $_GET['id'];
    $stmt = $pdo->prepare('SELECT * FROM jobs WHERE id = ? AND recruiter_id = ?');
    $stmt->execute([$id, $recruiter_id]);
    $job = $stmt->fetch();
    echo json_encode($job);
    exit;
}

// ---- Tambah lowongan ----
if ($aksi === 'tambah') {
    $posisi     = $_POST['posisi'];
    $perusahaan = $_POST['perusahaan'];
    $lokasi     = $_POST['lokasi'];
    $tipe       = $_POST['tipe'];

    $stmt = $pdo->prepare('INSERT INTO jobs (posisi, perusahaan, lokasi, tipe, recruiter_id) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$posisi, $perusahaan, $lokasi, $tipe, $recruiter_id]);
    echo json_encode(['status' => 'ok']);
    exit;
}

// ---- Update lowongan (hanya milik sendiri) ----
if ($aksi === 'update') {
    $id         = $_POST['id'];
    $posisi     = $_POST['posisi'];
    $perusahaan = $_POST['perusahaan'];
    $lokasi     = $_POST['lokasi'];
    $tipe       = $_POST['tipe'];

    $stmt = $pdo->prepare('UPDATE jobs SET posisi=?, perusahaan=?, lokasi=?, tipe=? WHERE id=? AND recruiter_id=?');
    $stmt->execute([$posisi, $perusahaan, $lokasi, $tipe, $id, $recruiter_id]);
    echo json_encode(['status' => 'ok']);
    exit;
}

// ---- Hapus lowongan (hanya milik sendiri) ----
if ($aksi === 'hapus') {
    $id = $_POST['id'];
    // Hapus pelamar dulu
    $pdo->prepare('DELETE FROM applications WHERE job_id = ?')->execute([$id]);
    // Baru hapus jobnya
    $pdo->prepare('DELETE FROM jobs WHERE id = ? AND recruiter_id = ?')->execute([$id, $recruiter_id]);
    echo json_encode(['status' => 'ok']);
    exit;
}

// ---- Tampilkan pelamar untuk semua job milik recruiter ini ----
if ($aksi === 'pelamar') {
    $stmt = $pdo->prepare('
        SELECT a.id, a.status, u.nama, u.email, j.posisi
        FROM applications a
        JOIN users u ON u.id = a.user_id
        JOIN jobs j  ON j.id = a.job_id
        WHERE j.recruiter_id = ?
        ORDER BY a.id DESC
    ');
    $stmt->execute([$recruiter_id]);
    $pelamar = $stmt->fetchAll();
    echo json_encode($pelamar);
    exit;
}

// ---- Ubah status pelamar ----
if ($aksi === 'ubah_status') {
    $app_id = $_POST['app_id'];
    $status = $_POST['status'];

    // Pastikan application ini milik job recruiter yang login
    $stmt = $pdo->prepare('
        UPDATE applications a
        JOIN jobs j ON j.id = a.job_id
        SET a.status = ?
        WHERE a.id = ? AND j.recruiter_id = ?
    ');
    $stmt->execute([$status, $app_id, $recruiter_id]);
    echo json_encode(['status' => 'ok']);
    exit;
}

echo json_encode(['status' => 'error', 'pesan' => 'Aksi tidak dikenal.']);