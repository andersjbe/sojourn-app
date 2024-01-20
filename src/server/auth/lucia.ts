import { planetscale } from "@lucia-auth/adapter-mysql";
import { lucia } from "lucia";
import { connection } from "../db";

export const auth = lucia({
	adapter: planetscale(connection, {
		key: "sojourn_key",
		session: "sojourn_session",
		user: "sojourn_user",
	}),
	env: "DEV",
});
