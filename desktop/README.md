# The Suitcase Lab — Polished Book Opening V4

Memperbaiki animasi pembukaan buku Arcanists/Status Effects yang terlihat kaku dan bertabrakan. Fokus perubahan: komposisi sampul dan halaman pada engsel yang sama, penambahan frame lebih halus, serta transisi akhir yang tidak menumpuk dengan halaman aplikasi.

## Pemasangan

Ekstrak isi ZIP ke `D:\The Suitcase Lab\desktop` dan pilih replace untuk file yang sudah ada.

File yang diganti:

- `src/renderer/src/assets/timekeeper/book-opening-animated.webp`
- `src/renderer/src/assets/timekeeper/book-open-fallback.png`
- `src/renderer/src/features/timekeeper/book-opening-transition.css`

Jangan ubah `TimekeeperEntry.tsx`, `BookOpeningTransition.tsx`, `TimekeeperRoom.tsx`, atau file database.

## Teknis

- Animasi WebP transparan, 960x540, durasi 2800 ms, tidak berulang.
- Sampul kulit ornamen emas membalik pada satu engsel; halaman kanan dan kiri hanya terlihat saat semestinya.
- Foto ruangan tetap menjadi latar zoom.
- Saat layar arsip mulai dimuat, gambar buku langsung disembunyikan di balik lapisan warna perkamen; lapisan perkamen kemudian memudar. Tidak ada dua buku yang tampil bersamaan.
- Zoom tetap 1700 ms, seal 240 ms, opening 2800 ms, arrival 380 ms.

## Uji

```powershell
npx prettier --write src/renderer/src/features/timekeeper/book-opening-transition.css
npm run typecheck
npm run lint
npm run dev
```

Cek animasi Arcanists dan Status Effects, lalu kembali ke Room dan uji membuka kembali. Jangan commit sebelum mengecek alur pada Electron lokal.
