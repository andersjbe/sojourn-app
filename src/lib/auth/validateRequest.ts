import * as context from "next/headers";
import { cache } from "react";
import { auth } from "./lucia";

export const uncachedValidateRequest = async (method: "GET" | "POST") => {
	const authRequest = auth.handleRequest(method, context);
	return authRequest.validate();
};

export const validateRequest = cache(uncachedValidateRequest);
