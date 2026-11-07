Timekeeper's Room — Text Navigation V6

Perubahan:
- Posisi judul dan deskripsi Arcanists dipusatkan pada buku besar di meja.
- Status Effects digeser ke kiri agar berada di tengah area rak buku.
- Ukuran judul dan deskripsi diperbesar sedikit.
- Tidak mengubah gambar ruangan, panah (tetap tidak ada), label, logika klik, atau navigasi lainnya.

Ekstrak ZIP ke folder D:\The Suitcase Lab\desktop dan timpa hanya:
src/renderer/src/features/timekeeper/timekeeper-room-navigation.css

Uji:
npx prettier --write src/renderer/src/features/timekeeper/timekeeper-room-navigation.css
npm run typecheck
npm run lint
npm run dev
