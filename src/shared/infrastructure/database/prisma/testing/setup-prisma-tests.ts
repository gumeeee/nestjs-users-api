import { execSync } from 'node:child_process';

export function setupPrismaTests() {
  execSync(
    'pnpm dlx dotenv-cli -e .env.test -- pnpm prisma migrate deploy --schema ./src/shared/infrastructure/database/prisma/schema.prisma',
  );
}
