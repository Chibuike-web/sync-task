import { jwtVerify, SignJWT } from "jose";
import { JWT_SECRET } from "../../config";

export async function createSession(userId: number) {
	const token = await new SignJWT({ userId })
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime("1h")
		.sign(JWT_SECRET);
	return token;
}

export async function verifySessionToken(token: string) {
	const { payload } = await jwtVerify(token, JWT_SECRET);
	return payload;
}
