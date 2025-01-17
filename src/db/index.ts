import { drizzle } from "drizzle-orm/neon-http";
import env from "@/lib/env";
import * as schema from "@/db/schema";

const db = drizzle(env.DATABASE_URL, { schema: { ...schema } });

export default db;
