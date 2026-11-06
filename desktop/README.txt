FIX TAHAP 10.6

Masalah: script lama mengharapkan comment SKILLS tepat setelah penutup section, padahal kode asli memiliki satu baris kosong.

Cara pasang: ekstrak isi ZIP ke D:\The Suitcase Lab\desktop, overwrite scripts/apply-arcanist-form-book.mjs.

Lalu jalankan:
node scripts/apply-arcanist-form-book.mjs
npx prettier --write src/renderer/src/features/arcanists/ArcanistForm.tsx src/renderer/src/features/arcanists/arcanist-form-book.css
npm run typecheck
npm run lint
npm run dev

Skrip membuat backup dan mengubah hanya ArcanistForm.tsx setelah semua pola cocok.
