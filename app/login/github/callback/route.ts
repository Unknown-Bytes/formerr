import { generateSessionToken, createSession, setSessionIdCookie } from "@/lib/server/session";
import { github } from "@/lib/server/oauth";
import { cookies } from "next/headers";
import { createUser, getUserFromGitHubId } from "@/lib/server/user";
import { ObjectParser } from "@pilcrowjs/object-parser";
import { globalGETRateLimit } from "@/lib/server/request";

import type { OAuth2Tokens } from "arctic";

export async function GET(request: Request): Promise<Response> {
    if (!globalGETRateLimit()) {
		return new Response("Too many requests", {
            status: 429
        }) 
	}
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const storedState = (await cookies()).get("github_oauth_state")?.value ?? null;
	console.log(code, state, url);
	if (code === null || state === null) {
	    // Limpando o cookie pra ele não dar problema na próxima
	    (await cookies()).set("github_oauth_state", "" , { expires: new Date(0) });
	    return new Response(JSON.stringify({ error: "Code or state is missing. The state may have expire. Please restart the process." }), {
	        status: 400,
	        headers: { "Content-Type": "application/json" }
	    });
	}
	if (state !== storedState) {
	    // Limpando o cookie pra ele não dar problema na próxima
	    (await cookies()).set("github_oauth_state", "" , { expires: new Date(0) });
	    return new Response(JSON.stringify({ error: "Invalid state. Your login may have timed out. Please restart the process." }), {
	        status: 400,
	        headers: { "Content-Type": "application/json" }
	    });
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} catch {
		// Invalid code or client credentials
		return new Response(JSON.stringify({ error: "Invalid or expired authorization code. Please restart the process." }), {
		        status: 400,
		        headers: { "Content-Type": "application/json" }
		    });
	}
	const githubAccessToken = tokens.accessToken();

	const userRequest = new Request("https://api.github.com/user");
	userRequest.headers.set("Authorization", `Bearer ${githubAccessToken}`);
	const userResponse = await fetch(userRequest);
	const userResult: unknown = await userResponse.json();
	const userParser = new ObjectParser(userResult);
	console.log(userParser)
	const githubUserId = userParser.getNumber("id");
	const username = userParser.getString("login");
	const name = userParser.getString("name");

	const existingUser = await getUserFromGitHubId(githubUserId);
	if (existingUser) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionIdCookie(session.id, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/v1/dashboard"
			}
		});
	}

	const emailListRequest = new Request("https://api.github.com/user/emails");
	emailListRequest.headers.set("Authorization", `Bearer ${githubAccessToken}`);
	const emailListResponse = await fetch(emailListRequest);
	const emailListResult: unknown = await emailListResponse.json();
	if (!Array.isArray(emailListResult) || emailListResult.length < 1) {
		return new Response("Please restart the process.", {
			status: 400
		});
	}
	let email: string | null = null;
	for (const emailRecord of emailListResult) {
		const emailParser = new ObjectParser(emailRecord);
		const primaryEmail = emailParser.getBoolean("primary");
		const verifiedEmail = emailParser.getBoolean("verified");
		if (primaryEmail && verifiedEmail) {
			email = emailParser.getString("email");
		}
	}
	if (email === null) {
		return new Response(JSON.stringify({ error: "Primary, verified email not found. Please make sure your GitHub account has a primary and verified email." }), {
		        status: 400,
		        headers: { "Content-Type": "application/json" }
		    });
	}

	const user = await createUser(githubUserId, email, username, name);
	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionIdCookie(session.id, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});
}
