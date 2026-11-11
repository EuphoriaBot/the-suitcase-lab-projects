# The Suitcase Lab — Status Effects Ornate Research Codex

Paket desain buku Status Effects berdasarkan referensi visual bergaya arsip alkimia/vintage yang sudah disetujui. Isi halaman tetap dibuat oleh React; file gambar hanya menjadi latar dekoratif tanpa nama Status Effect, data, tombol, atau input statis.

## Isi paket

- `src/renderer/src/features/status-effects/status-effects-book.css` — CSS pengganti untuk halaman **daftar** Status Effects.
- `src/renderer/src/assets/status-effects/ornate-codex-shell.webp` — ilustrasi latar buku: perkamen, bingkai, bunga, simbol, buku dan botol alkimia, surat bersigil, serta reruntuhan.
- `src/renderer/src/assets/status-effects/codex-compass.svg` — ikon dekorasi pencarian.
- `src/renderer/src/assets/status-effects/codex-divider.svg` — ornamen garis pemisah.
- `preview.png` — tangkapan layar pengujian visual dengan data contoh **bukan** latar halaman yang dipasang ke aplikasi.

## Instalasi

1. Simpan perubahan yang sedang dikerjakan dan buat cadangan `status-effects-book.css` jika ingin mudah mengembalikan desain lama.
2. Ekstrak ZIP ke `D:\The Suitcase Lab\desktop`, lalu izinkan mengganti `status-effects-book.css`.
3. **Jangan** mengganti `StatusEffectsBookList.tsx`, `StatusEffectsPage.tsx`, form, detail, Timekeeper's Room, atau SQLite.
4. Jalankan dari direktori `desktop`:

```powershell
npx prettier --write src/renderer/src/features/status-effects/status-effects-book.css
npm run typecheck
npm run lint
npm run dev
```

5. Uji Register, pencarian, hover item, buka detail, Edit, Delete dan scroll daftar/deskripsi.

## Catatan

- Styling khusus **Status Effects List**. Halaman Detail dan Register/Edit sengaja tidak disentuh.
- Jika ada beberapa status effect, daftar tetap dapat di-scroll di dalam halaman kiri.
- Deskripsi dan efek yang panjang tetap dapat di-scroll di halaman kanan.
- Latar dipakai sebagai dekorasi saja, tidak memasukkan screenshot sebagai UI statis.
- Layout desktop didesain untuk layar 16:9; pada layar sempit CSS menggunakan susunan responsif satu kolom.
- Paket diperiksa melalui renderer Chromium mandiri, tetapi belum diuji terhadap seluruh aplikasi Electron pengguna.
