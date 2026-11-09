# The Suitcase Lab — Arcanists Reference-Matched Registry V13

## Tujuan

Mendekatkan tampilan daftar Arcanists ke mockup ornate archive yang dipilih. Versi sebelumnya memakai ilustrasi SVG sederhana dan kertas terlalu putih. Versi ini memakai latar **buku perkamen hasil pengolahan gambar referensi** yang telah dibersihkan dari semua teks/portrait/tombol statis, sedangkan UI sesungguhnya tetap diberikan oleh `ArcanistsBookList.tsx`.

## Isi paket

```
src/renderer/src/features/arcanists/arcanists-book.css
src/renderer/src/assets/arcanists/ornate-book-shell.webp
src/renderer/src/assets/arcanists/compass-rose.svg
src/renderer/src/assets/arcanists/archive-divider.svg
```

## Pemasangan

1. Backup `src/renderer/src/features/arcanists/arcanists-book.css` lama (atau gunakan Git untuk mengembalikan).
2. Ekstrak ZIP ke `D:\The Suitcase Lab\desktop` dengan struktur direktori dipertahankan, dan timpa CSS.
3. Verifikasi aset `src/renderer/src/assets/arcanists/ornate-book-shell.webp` ada.
4. **Jangan** timpa `ArcanistsBookList.tsx`, `ArcanistsPage.tsx`, form, detail, Timekeeper Room, atau kode SQLite.

## Pengujian

```powershell
npx prettier --write src/renderer/src/features/arcanists/arcanists-book.css
npm run typecheck
npm run lint
npm run dev
```

Periksa tampilan daftar pada layar Electron, lalu uji Register, Search, klik karakter, Edit, Delete, preview foto, dan jumlah karakter banyak (scroll khusus indeks).

## Catatan

- Latar diperoleh dari ilustrasi referensi yang sudah dibuat di percakapan ini; teks dan objek UI yang permanen dibersihkan. Nama, foto, jumlah, dan tombol berasal dari React dan SQLite.
- Menyesuaikan gambar referensi sedekat mungkin, tetapi tidak piksel-identik pada setiap ukuran layar atau konten; tujuan utamanya visual yang konsisten **dan tetap interaktif**.
- Ada media query untuk jendela sempit yang mengubah dua halaman menjadi satu kolom agar aplikasi tetap dapat digunakan.
- Sintaks CSS dan aset terverifikasi secara statis. Pengujian integrasi aplikasi Electron tetap harus dilakukan secara lokal.
