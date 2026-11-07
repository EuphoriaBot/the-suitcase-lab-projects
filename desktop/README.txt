The Suitcase Lab - Smooth Cinematic Intro V3

Perubahan dari V2:
- Durasi menjadi 6.0 detik (dari 4.8 detik).
- Pergerakan kamera dari awal lebih pelan (cubic-bezier(0.58, 0.07, 0.75, 0.92)) dan terus bergerak tanpa stop mendadak.
- Tidak ada lapisan gelap di detik-detik pertama, sehingga eksterior terlihat sejak frame awal.
- Pintu mulai terbuka setelah 1.5 detik dan membuka selama 2.3 detik, bersamaan dengan gerakan kamera.
- Fade-out akhir hanya pada 5% durasi, kemudian langsung ke Timekeeper Room.
- Tombol Skip dan shortcut Esc tetap dihapus.

Pemasangan:
1. Ekstrak ZIP ke D:\The Suitcase Lab\desktop.
2. Ganti hanya kedua file di src/renderer/src/features/timekeeper:
   TimekeeperIntro.tsx dan timekeeper-intro.css.
3. JANGAN mengubah TimekeeperEntry.tsx, TimekeeperRoom.tsx, maupun gambar ruangan, eksterior, atau pintu.
4. Jalankan npx prettier --write ... lalu npm run typecheck, npm run lint, dan npm run dev.

Catatan: Durasi TSX (INTRO_DURATION) dan CSS (--intro-duration) sengaja disamakan pada 6000ms.
