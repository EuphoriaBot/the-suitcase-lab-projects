# The Suitcase Lab — Status Effect Edit/Register Book (Stage 10.9)

## Pemasangan

1. Simpan/commit pekerjaan lokal sebelum memasang perubahan.
2. Ekstrak seluruh isi ZIP ke `D:\The Suitcase Lab\desktop`.
3. Timpa `src/renderer/src/features/status-effects/StatusEffectForm.tsx`.
4. Tambahkan `src/renderer/src/features/status-effects/status-effect-form-book.css`.
5. Jangan mengganti `StatusEffectsPage.tsx`, `StatusEffectDetail.tsx`, `StatusEffectsBookList.tsx`, atau `status-effects-book.css`.

Tidak perlu menjalankan skrip transformasi apapun.

## Pengujian

```powershell
npx prettier --write src/renderer/src/features/status-effects/StatusEffectForm.tsx src/renderer/src/features/status-effects/status-effect-form-book.css
npm run typecheck
npm run lint
npm run dev
```

Di aplikasi: buka Status Effects > pilih efek > Edit; periksa scroll kiri/kanan, tombol Description/Effect/Arcanists/Notes, Save Changes/Cancel, lalu cek data yang tersimpan. Uji juga Register Status Effect.

## File

- `StatusEffectForm.tsx`: Kode lengkap form dengan layout dua halaman, tetap memakai callback, state, validasi, dan payload penyimpanan yang sama seperti form aslinya.
- `status-effect-form-book.css`: Styling khusus form; mewarisi tema buku dari `status-effects-book.css` yang sudah ada.

## Catatan

Sintaks TSX dan struktur CSS telah diperiksa. Pengujian `npm run typecheck`, `npm run lint`, dan Electron dalam proyek lokal tetap harus dijalankan oleh pengguna.

Jangan commit sebelum pengujian fungsional sukses.
