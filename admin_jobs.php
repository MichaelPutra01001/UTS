<?php
// admin_jobs.php
session_start();
require 'koneksi.php';

header('Content-Type: application/json');

// Cek role admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['status' => 'error', 'pesan' => 'Akses ditolak.']);
    exit;
}

$aksi = $_GET['aksi'] ?? $_POST['aksi'] ?? '';

// ---- Tampilkan semua lowongan ----
if ($aksi === 'list') {
    $stmt = $pdo->query('SELECT * FROM jobs ORDER BY id DESC');
    $jobs = $stmt->fetchAll();
    echo json_encode($jobs);
    exit;
}

// ---- Detail satu lowongan (untuk edit) ----
if ($aksi === 'detail') {
    $id = $_GET['id'];
    $stmt = $pdo->prepare('SELECT * FROM jobs WHERE id = ?');
    $stmt->execute([$id]);
    $job = $stmt->fetch();
    echo json_encode($job);
    exit;
}

// ---- Tambah lowongan baru ----
if ($aksi === 'tambah') {
    $posisi     = $_POST['posisi'];
    $perusahaan = $_POST['perusahaan'];
    $lokasi     = $_POST['lokasi'];
    $tipe       = $_POST['tipe'];

    $stmt = $pdo->prepare('INSERT INTO jobs (posisi, perusahaan, lokasi, tipe) VALUES (?, ?, ?, ?)');
    $stmt->execute([$posisi, $perusahaan, $lokasi, $tipe]);
    echo json_encode(['status' => 'ok']);
    exit;
}

// ---- Update lowongan ----
if ($aksi === 'update') {
    $id         = $_POST['id'];
    $posisi     = $_POST['posisi'];
    $perusahaan = $_POST['perusahaan'];
    $lokasi     = $_POST['lokasi'];
    $tipe       = $_POST['tipe'];

    $stmt = $pdo->prepare('UPDATE jobs SET posisi=?, perusahaan=?, lokasi=?, tipe=? WHERE id=?');
    $stmt->execute([$posisi, $perusahaan, $lokasi, $tipe, $id]);
    echo json_encode(['status' => 'ok']);
    exit;
}

// ---- Hapus lowongan ----
if ($aksi === 'hapus') {
    $id = $_POST['id'];
    $stmt = $pdo->prepare('DELETE FROM jobs WHERE id = ?');
    $stmt->execute([$id]);
    echo json_encode(['status' => 'ok']);
    exit;
}

echo json_encode(['status' => 'error', 'pesan' => 'Aksi tidak dikenal.']);