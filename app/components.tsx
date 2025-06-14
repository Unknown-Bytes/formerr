"use client";

import { logoutAction } from "./actions";

export function LogoutButton() {
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await logoutAction();
	};
	
	return (
		<form onSubmit={handleSubmit}>
			<button type="submit">Sign out</button>
		</form>
	);
}
