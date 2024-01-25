"use server";

import { DrizzleError } from "drizzle-orm";
import { LuciaError } from "lucia";
import * as context from "next/headers";
import { z } from "zod";
import { db } from "~/server/db";
import { user } from "~/server/db/schema";
import { generatePublicId } from "../publicId";
import { emailPasswordSchema, signUpSchema } from "../validators";
import { auth } from "./lucia";

export async function handleLogin(data: z.infer<typeof emailPasswordSchema>) {
	try {
		const key = await auth.useKey("email", data.email, data.password);
		const session = await auth.createSession({
			userId: key.userId,
			attributes: {},
		});
		const authRequest = auth.handleRequest("POST", context);
		authRequest.setSession(session);
		return { success: true, message: "" };
	} catch (e) {
		if (
			e instanceof LuciaError &&
			(e.message === "AUTH_INVALID_KEY_ID" ||
				e.message === "AUTH_INVALID_PASSWORD")
		) {
			return { success: false, message: "Incorrect username or password" };
		}
		return { success: false, message: "An unknown error occurred" };
	}
}

export async function handleSignUp(data: z.infer<typeof signUpSchema>) {
	try {
		const existingUsers = await db.query.user.findMany({
			where: ({ username, email }, { exists, or, eq }) =>
				exists(
					db
						.select()
						.from(user)
						.where(or(eq(username, data.username), eq(email, data.email))),
				),
		});
		if (existingUsers.length > 0) {
			return {
				success: false,
				message: "A user with that email or username already exists",
			};
		}
		const public_id = generatePublicId();
		console.log(public_id);

		const newUser = await auth.createUser({
			key: {
				providerId: "email",
				providerUserId: data.email,
				password: data.password,
			},
			attributes: {
				email: data.email,
				username: data.username,
				public_id,
			},
		});
		const session = await auth.createSession({
			userId: newUser.userId,
			attributes: {},
		});
		const authRequest = auth.handleRequest("POST", context);
		authRequest.setSession(session);
		return { success: true, message: "" };
	} catch (e) {
		console.log(e);
		if (e instanceof DrizzleError) {
			return {
				success: false,
				message: "An error occurred creating the user",
			};
		}
		return {
			success: false,
			message: "An unknown error occurred",
		};
	}
}

export async function logout() {
	const authRequest = auth.handleRequest("POST", context);
	const session = await authRequest.validate();
	if (!session) {
		return { success: false };
	}
	await auth.invalidateSession(session.sessionId);
	authRequest.setSession(null);
	return { success: true };
}
