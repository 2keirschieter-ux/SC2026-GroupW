# WorldCards

WorldCards is a Next.js/TypeScript country trading-card MVP. Gameplay and
special-card stock are server-side, with PostgreSQL as the source of truth.

## Development

Copy `.env.example` to `.env`, provision PostgreSQL, then run:

```bash
npm install
npx prisma migrate dev
npm run dev
```

`DATABASE_URL`, `SESSION_SECRET`, and (for seeding) `ADMIN_INITIAL_PASSWORD`
are required. Never commit `.env` or credentials.2026
Repository for our trading card game project in Software Construction
