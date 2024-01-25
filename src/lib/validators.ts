import { z } from "zod";

export const emailPasswordSchema = z.object({
	email: z
		.string()
		.email()
		.min(5)
		.max(255)
		.transform((email) => email.toLocaleLowerCase()),
	password: z.string().min(8).max(255),
});
export const signUpSchema = emailPasswordSchema
	.extend({
		confirmPassword: z.string().min(8).max(255),
		username: z
			.string()
			.min(3)
			.max(127)
			.transform((username) => username.toLocaleLowerCase()),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Password and confirm password fields don't match",
		path: ["confirm"],
	});
