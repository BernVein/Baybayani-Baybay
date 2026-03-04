// Setup type definitions for Supabase Edge Runtime
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers":
		"authorization, x-client-info, apikey, content-type",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Helper: Base64 URL encode
function base64UrlEncode(input: string | Uint8Array) {
	let str: string;
	if (input instanceof Uint8Array) {
		str = String.fromCharCode(...input);
	} else {
		str = input;
	}
	return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Helper: Import private key
async function importPrivateKey(pem: string) {
	const pemContents = pem
		.replace("-----BEGIN PRIVATE KEY-----", "")
		.replace("-----END PRIVATE KEY-----", "")
		.replace(/\s+/g, "");
	const binaryDer = Uint8Array.from(atob(pemContents), (c) =>
		c.charCodeAt(0),
	);
	return await crypto.subtle.importKey(
		"pkcs8",
		binaryDer.buffer,
		{ name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
		false,
		["sign"],
	);
}

// Helper: Sign JWT
async function signJWT(header: object, payload: object, privateKey: CryptoKey) {
	const headerEncoded = base64UrlEncode(JSON.stringify(header));
	const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
	const data = new TextEncoder().encode(`${headerEncoded}.${payloadEncoded}`);
	const signature = new Uint8Array(
		await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, data),
	);
	const signatureEncoded = base64UrlEncode(signature);
	return `${headerEncoded}.${payloadEncoded}.${signatureEncoded}`;
}

Deno.serve(async (req) => {
	// Handle CORS preflight
	if (req.method === "OPTIONS") {
		return new Response(null, { status: 204, headers: corsHeaders });
	}

	try {
		const { userId, title, body, data } = await req.json();
		if (!userId || !title || !body)
			throw new Error("Missing required fields: userId, title, body");

		// ✅ CRITICAL FIX: Use SERVICE_ROLE_KEY to bypass Row Level Security (RLS).
		// With ANON_KEY, RLS policies will block reading other users' tokens,
		// causing the query to return 0 rows and the function to fail silently.
		const supabase = createClient(
			Deno.env.get("SUPABASE_URL")!,
			Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
		);

		// Get all FCM tokens for this user
		const { data: tokensData, error: tokensError } = await supabase
			.from("User_Push_Token")
			.select("user_push_token")
			.eq("user_id", userId);

		if (tokensError) throw new Error(`DB error: ${tokensError.message}`);
		if (!tokensData?.length) {
			// User has no FCM token (e.g. not on Android / never granted permission)
			// skip silently instead of erroring.
			console.log(
				`No FCM token for user ${userId}, skipping notification.`,
			);
			return new Response(
				JSON.stringify({
					success: true,
					skipped: true,
					reason: "No FCM token registered",
				}),
				{
					status: 200,
					headers: {
						...corsHeaders,
						"Content-Type": "application/json",
					},
				},
			);
		}

		const tokens = tokensData.map(
			(t: { user_push_token: string }) => t.user_push_token,
		);
		console.log(`Sending to ${tokens.length} token(s) for user ${userId}`);

		// Prepare JWT for Google OAuth2
		const privateKeyPem = Deno.env
			.get("GOOGLE_PRIVATE_KEY")!
			.replace(/\\n/g, "\n");
		const clientEmail = Deno.env.get("GOOGLE_CLIENT_EMAIL")!;
		const projectId = Deno.env.get("GOOGLE_PROJECT_ID")!;

		const privateKey = await importPrivateKey(privateKeyPem);
		const now = Math.floor(Date.now() / 1000);
		const jwt = await signJWT(
			{ alg: "RS256", typ: "JWT" },
			{
				iss: clientEmail,
				scope: "https://www.googleapis.com/auth/firebase.messaging",
				aud: "https://oauth2.googleapis.com/token",
				iat: now,
				exp: now + 3600,
			},
			privateKey,
		);

		// Exchange JWT for Google access token
		const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
		});
		const tokenJson = await tokenRes.json();
		const access_token = tokenJson.access_token;

		if (!access_token) {
			throw new Error(
				`Failed to get access token: ${JSON.stringify(tokenJson)}`,
			);
		}

		// Send FCM notifications and collect parsed results
		const fcmPromises = tokens.map(async (token: string) => {
			const res = await fetch(
				`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${access_token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						message: {
							token,
							notification: { title, body },
							data: data || {},
							// Android: explicit channel + high priority so the OS
							// doesn't silently drop the notification
							android: {
								priority: "HIGH",
								notification: {
									channel_id: "default",
									sound: "default",
									default_sound: true,
									default_vibrate_timings: true,
									default_light_settings: true,
								},
							},
							// iOS: ensure critical delivery
							apns: {
								payload: {
									aps: {
										sound: "default",
										"content-available": 1,
									},
								},
								headers: {
									"apns-priority": "10",
								},
							},
						},
					}),
				},
			);
			// ✅ Parse the FCM response so errors are visible in logs
			const json = await res.json();
			console.log(
				`FCM response for token ...${token.slice(-6)}:`,
				JSON.stringify(json),
			);
			return {
				token: token.slice(-6),
				status: res.status,
				response: json,
			};
		});

		const fcmResults = await Promise.all(fcmPromises);

		return new Response(
			JSON.stringify({
				success: true,
				sent: fcmResults.length,
				results: fcmResults,
			}),
			{
				status: 200,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			},
		);
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : String(err);
		console.error("send-push-notification error:", message);
		return new Response(
			JSON.stringify({ success: false, error: message }),
			{
				status: 500,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			},
		);
	}
});
