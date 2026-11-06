# The Suitcase Lab — Status Effect Detail Book (Tahap 10.8)

Perubahan **hanya untuk tampilan Detail Status Effect**. Tidak mengubah penyimpanan SQLite, routing, form, atau daftar Status Effects.

## Pemasangan

Ekstrak seluruh isi ZIP ke `D:\The Suitcase Lab\desktop`.

- Ganti `src/renderer/src/features/status-effects/StatusEffectDetail.tsx` dengan file dari paket.
- Tambahkan `src/renderer/src/features/status-effects/status-effect-detail-book.css`.
- Jangan ganti `StatusEffectsPage.tsx`, `StatusEffectsBookList.tsx`, atau `status-effects-book.css` yang sudah berfungsi.

## Pengujian

Jalankan di folder `desktop`:

```powershell
npx prettier --write src/renderer/src/features/status-effects/StatusEffectDetail.tsx src/renderer/src/features/status-effects/status-effect-detail-book.css
npm run typecheck
npm run lint
npm run dev
```

Buka Status Effects > pilih sebuah efek. Halaman kiri menampilkan identitas dan tombol Edit. Halaman kanan memuat Description, Effect, Notes, Related Arcanists, Tags, dan Related Mechanics yang dapat di-scroll menggunakan mouse. Klik tab untuk pindah ke bagian terkait. Tombol Back harus kembali ke indeks. Tombol Edit harus membuka form lama dan Save/Cancel tetap berfungsi.

Catatan: Seluruh data ditampilkan dari props yang sudah digunakan oleh `StatusEffectDetail` sebelumnya. Tidak ada aksi hapus pada detail karena detail lama juga tidak menyediakan tombol hapus.
