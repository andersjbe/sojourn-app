import { planetscale } from "@lucia-auth/adapter-mysql";
import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { connection } from "~/server/db";

export const auth = lucia({
	adapter: planetscale(connection, {
		key: "sojourn_user_key",
		session: "sojourn_user_session",
		user: "sojourn_auth_user",
	}),
	getUserAttributes: (data) => {
		return {
			username: data.username,
			publicId: data.public_id,
			email: data.email,
		};
	},
	middleware: nextjs_future(),
	env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
	sessionCookie: {
		expires: false,
		name: "session",
	},
});

export type Auth = typeof auth;
