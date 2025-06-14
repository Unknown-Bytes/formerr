import { GitHub } from "arctic";

// TODO: Update redirect URI
export const github = new GitHub(
	process.env.GITHUB_CLIENT_ID ?? "",
	process.env.GITHUB_CLIENT_SECRET ?? "",
	process.env.CALLBACK ?? ""
);
