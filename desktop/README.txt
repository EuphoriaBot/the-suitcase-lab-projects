THE SUITCASE LAB — ARCANIST DETAIL BOOK (STAGE 10.5)

Copy the src folder to:
D:\The Suitcase Lab\desktop\

This package replaces:
- src/renderer/src/features/arcanists/ArcanistDetail.tsx

It adds:
- src/renderer/src/features/arcanists/arcanist-detail-book.css

It does not modify ArcanistsPage.tsx, ArcanistsBookList.tsx, timekeeper files, or SQLite operations.

Commands:
npx prettier --write src/renderer/src/features/arcanists/ArcanistDetail.tsx src/renderer/src/features/arcanists/arcanist-detail-book.css
npm run typecheck
npm run lint
npm run dev

Check the character portrait, details, Edit Dossier, Back to Arcanist Index,
all six tabs, and independent scrolling in the right page.
