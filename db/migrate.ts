import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, migrationClient } from "./client";

async function main() {
  await migrate(db, { migrationsFolder: "db/migrations" });
  await migrationClient.end();
}

main().catch(async (error: unknown) => {
  await migrationClient.end();
  console.error(error);
  process.exit(1);
});
