# Repository overview

This document captures the current layout of the project (beyond `src/`), including notable files and new UI components recently added for the notes feature.

## Top-level structure
- `auth/`: SQL scripts for schema, roles, admin user, and database connector bootstrap.
- `docs/`: Project documentation (component analysis plus this overview).
- `public/`: Static assets used by the Next.js app.
- Root configs: `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `package.json`, `pnpm-lock.yaml`, `app.sql`, and `components.json`.

## Application directories
- `src/app/`: Next.js routes such as `page.tsx`, `dashboard/`, `login/`, `pedidos/`, `pagados/`, and supporting error layouts.
- `src/components/`: Shared UI, auth, notifications, pedidos/orders, and Luwak-specific layouts.
- `src/config/`, `src/constants/`, `src/hooks/`, `src/lib/`, `src/types/`, and `src/middleware.ts`: Supporting configuration, shared values, utilities, type definitions, and middleware.

## Notes feature (current state)
- Luwak layout includes `FloatingNotesPanel.tsx` and `NotesFab.tsx`, providing floating entry points for viewing kitchen/admin notes.
- `NotesProvider.tsx` supplies an in-memory notes context (create, update, delete, clear) and throws if used outside the provider.
- The floating notes card currently filters visible notes to roles `chef`, `ayudante`, and `admin`, ordering them by most recent creation time.
- `FloatingNotesPanel` presents a modal-style overlay with placeholder content; integration with persistent data is still pending.
