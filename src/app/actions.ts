"use server";

import db from "@/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Link } from "@/types";
import env from "@/lib/env";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";

export async function getUserData() {
	return { username: env.ADMIN_USERNAME };
}

export async function createLink({ number, type, content }: Link) {
	const session = verifySession();
	if (!session) return null;
	const result = await checkLink(number);
	if (result.found === true)
		return { success: false, message: "Link already exists" };
	await db
		.insert(links)
		.values({
			number,
			type,
			content,
		})
		.catch((e) => {
			return { success: false, message: e };
		});
	return { success: true };
}

export async function deleteLink({ number }: Link) {
	const session = verifySession();
	if (!session) return null;
	const result = await checkLink(number);
	if (result.found === false)
		return { success: false, message: "Link does not exist" };
	await db.delete(links).where(eq(links.number, number));
	return { success: true };
}

export async function checkLink(number: number) {
	const result: Link | undefined = await db.query.links.findFirst({
		where: eq(links.number, number),
	});
	if (result) {
		return {
			found: true,
			message: "Link found",
		};
	}
	return {
		found: false,
		message: "Link not found",
	};
}

export async function getLink(number: number) {
	const result: Link | undefined = await db.query.links.findFirst({
		where: eq(links.number, number),
	});
	if (result) {
		return { message: "Link found", link: result };
	}
	return { message: "Link not found" };
}

export async function getAllLinks() {
	const session = verifySession();
	if (!session) return null;
	const result: Link[] = await db.query.links.findMany();
	return result;
}

export async function signIn(values: { username: string; password: string }) {
	if (
		values.username === env.ADMIN_USERNAME &&
		values.password === env.ADMIN_PASSWORD
	) {
		await createSession(env.ADMIN_USERNAME);
		redirect("/admin");
	}
	return false;
}
