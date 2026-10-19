# Flamme Quiz App

Kuis AI interaktif: 10 soal pilihan ganda, satu soal per layar, urutan soal diacak setiap kali kuis dimulai, dan skor akhir beserta pembahasan di halaman hasil.

Aplikasi ini statis. Tidak ada build step, tidak ada dependency, tidak ada backend.

## Fitur

- Satu soal per layar, dengan tombol Next yang baru aktif setelah opsi dipilih
- Tombol berubah jadi Submit di soal terakhir
- Tombol Sebelumnya, jawaban tetap tersimpan saat kembali ke soal lama
- Urutan soal diacak memakai Fisher-Yates setiap kali kuis dimulai atau diulang
- Halaman hasil: skor, jumlah benar, jumlah salah, persentase, predikat, dan pesan sesuai nilai
- Pembahasan tiap soal: jawaban yang dipilih, kunci jawaban, dan alasannya
- Progress bar dan penghitung soal
- Mode terang dan gelap, mengikuti preferensi sistem dan bisa diganti manual. Pilihan disimpan di localStorage
- Responsif sampai lebar layar 390px
- Pintasan keyboard: angka 1-4 untuk memilih opsi, Enter untuk lanjut

## Struktur file

```
index.html   struktur dua layar: kuis dan hasil
style.css    tema terang/gelap, layout bento untuk halaman skor
app.js       data 10 soal, state kuis, pengacakan, perhitungan skor, pembahasan
```

Semua soal, kunci jawaban, dan pembahasan ada di array `QUESTIONS` pada `app.js`. Tidak ada data yang dikirim ke server mana pun.

## Menjalankan

Buka `index.html` langsung di browser sudah cukup. Kalau mau lewat server lokal:

```bash
python3 -m http.server 3000
```

Lalu buka http://localhost:3000

## Menambah atau mengubah soal

Tambahkan objek baru ke array `QUESTIONS` di `app.js`:

```js
{
  q: "Teks pertanyaan",
  options: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
  answer: 2,          // indeks opsi yang benar, 0-3
  why: "Alasan singkat kenapa jawaban itu benar."
}
```

Jumlah soal mengikuti panjang array. Kalau jumlah soal berubah, angka `/ 10` pada halaman hasil di `index.html` ikut disesuaikan, karena skor maksimum di sana masih hardcoded.

## Catatan

- Opsi jawaban tidak diacak, hanya urutan soal. Kalau ingin opsi ikut diacak, perlu penyesuaian pada cara `answer` disimpan dan cara pembahasan mencocokkan kunci.
- Tidak ada penyimpanan hasil. Skor hilang saat halaman di-refresh.

## Lisensi

Bebas dipakai untuk keperluan belajar dan pengajaran.
