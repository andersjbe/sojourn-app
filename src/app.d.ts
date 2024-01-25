/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import("~/lib/auth/lucia").Auth;
	type DatabaseUserAttributes = {
		username: string;
		public_id: string;
		email: string;
	};
	type DatabaseSessionAttributes = {};
}
