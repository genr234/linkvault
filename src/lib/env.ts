import { z } from "zod";

const envSchema = z.object({
	DATABASE_URL: z.string().startsWith("postgresql://", {
		message: "DATABASE_URL must be a PostgreSQL URL",
	}),
	ADMIN_USERNAME: z.string().min(2).max(32),
	ADMIN_PASSWORD: z.string().min(8).max(64),
	SESSION_SECRET: z.string().min(16),
});

const env = envSchema.parse(process.env);

export default env;
