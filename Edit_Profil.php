<?php
// =============================================
//  edit_profil.php — GradMatch
//  Handle semua form di tab Pengaturan Akun
// =============================================

session_start();
require 'koneksi.php';

header('Content-Type: application/json');

// Cek session
if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Belum login.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method tidak diizinkan.']);
    exit;
}

$user_id = $_SESSION['user_id'];
$action  = $_POST['action'] ?? '';

// ── Update Info Pribadi ──
if ($action === 'info') {
    $nama    = trim($_POST['nama']    ?? '');
    $email   = trim($_POST['email']   ?? '');
    $telepon = trim($_POST['telepon'] ?? '');
    $lokasi  = trim($_POST['lokasi']  ?? '');
    $bio     = trim($_POST['bio']     ?? '');

    if (!$nama || !$email) {
        echo json_encode(['status' => 'error', 'message' => 'Nama dan email wajib diisi.']);
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Format email tidak valid.']);
        exit;
    }

    // Cek email tidak dipakai user lain
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id != ?');
    $stmt->execute([$email, $user_id]);
    if ($stmt->fetch()) {
        echo json_encode(['status' => 'error', 'message' => 'Email sudah digunakan akun lain.']);
        exit;
    }

    $stmt = $pdo->prepare('
        UPDATE users SET nama = ?, email = ?, telepon = ?, lokasi = ?, bio = ?, updated_at = NOW()
        WHERE id = ?
    ');
    $stmt->execute([$nama, $email, $telepon, $lokasi, $bio, $user_id]);

    // ganti nama lengkap
    $_SESSION['nama'] = $nama;

    echo json_encode(['status' => 'success', 'message' => 'Profil berhasil diperbarui.']);
    exit;
}

// ── Update Password ──
if ($action === 'password') {
    $old_pass     = $_POST['old_password']     ?? '';
    $new_pass     = $_POST['new_password']     ?? '';
    $confirm_pass = $_POST['confirm_password'] ?? '';

    if (!$old_pass || !$new_pass || !$confirm_pass) {
        echo json_encode(['status' => 'error', 'message' => 'Semua kolom password wajib diisi.']);
        exit;
    }
    if (strlen($new_pass) < 8) {
        echo json_encode(['status' => 'error', 'message' => 'Password baru minimal 8 karakter.']);
        exit;
    }
    if ($new_pass !== $confirm_pass) {
        echo json_encode(['status' => 'error', 'message' => 'Konfirmasi password tidak cocok.']);
        exit;
    }

    // Verifikasi password lama
    $stmt = $pdo->prepare('SELECT password FROM users WHERE id = ?');
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();

    if (!password_verify($old_pass, $user['password'])) {
        echo json_encode(['status' => 'error', 'message' => 'Password saat ini salah.']);
        exit;
    }

    $hash = password_hash($new_pass, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?');
    $stmt->execute([$hash, $user_id]);

    echo json_encode(['status' => 'success', 'message' => 'Password berhasil diubah.']);
    exit;
}

// ── Hapus Akun ──
if ($action === 'hapus') {
    $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
    $stmt->execute([$user_id]);

    session_destroy();
    echo json_encode(['status' => 'success', 'message' => 'Akun berhasil dihapus.']);
    exit;
}

echo json_encode(['status' => 'error', 'message' => 'Action tidak dikenali.']);