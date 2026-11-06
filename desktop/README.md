# The Suitcase Lab — Status Effects Book List (Stage 10.7)

Mengubah **hanya halaman daftar Status Effects** menjadi buku terbuka, konsisten dengan Arcanists Book.

## File

- `src/renderer/src/features/status-effects/StatusEffectsBookList.tsx` — komponen baru.
- `src/renderer/src/features/status-effects/status-effects-book.css` — CSS baru (tidak mengubah CSS Arcanists).
- `src/renderer/src/features/status-effects/StatusEffectsPage.tsx` — mengganti cabang list lama, mempertahankan detail/form/database dan callback aslinya.

## Pemasangan

1. Pastikan perubahan lokal sudah tersimpan. Sebaiknya jalankan `git status` dari folder repo utama dan buat commit/back-up bila perlu.
2. Ekstrak isi ZIP ini ke `D:\The Suitcase Lab\desktop`. Pilih replace hanya untuk `StatusEffectsPage.tsx`; dua file lainnya baru.
3. Jalankan perintah berikut di folder `desktop`:

```powershell
npx prettier --write src/renderer/src/features/status-effects/StatusEffectsBookList.tsx src/renderer/src/features/status-effects/status-effects-book.css src/renderer/src/features/status-effects/StatusEffectsPage.tsx
npm run typecheck
npm run lint
npm run dev
```

## Pengujian

- Dari Timekeeper Room, pilih Status Effects.
- Buku terbuka; sidebar/topbar tersembunyi hanya di daftar.
- Search memfilter isi; scroll kiri tetap di dalam halaman buku; tidak ada pagination list.
- Hover/fokus pada nama mengganti preview kanan; klik nama atau Open Entry membuka detail lama.
- Register Effect membuka form lama.
- Edit membuka form dengan record yang dipilih.
- Delete memunculkan dialog konfirmasi lama dan refresh data setelah disimpan.
- Tombol The Room tetap berfungsi; nomor halaman 1 dan 2 tampil.

Kode TSX sudah dicek parser/transpiler TypeScript; tidak ada akses ke lingkungan Electron lokal untuk menjalankan lint/typecheck proyek penuh.
