import { PushNotifications } from "@capacitor/push-notifications";
import { supabase } from "@/config/supabaseclient";
import { Capacitor } from "@capacitor/core";

export const registerPush = async () => {
	if (!Capacitor.isNativePlatform()) return;

	const permission = await PushNotifications.requestPermissions();
	if (permission.receive !== "granted") {
		console.log("Push permission not granted");
		return;
	}

	// Create the notification channel BEFORE registering.
	// Android 8+ (API 26+) requires a channel or notifications are silently dropped.
	// This must match the channel_id sent in the FCM payload ("default").
	if (Capacitor.getPlatform() === "android") {
		await PushNotifications.createChannel({
			id: "default",
			name: "Default Notifications",
			description: "General app notifications",
			importance: 5, // IMPORTANCE_HIGH — shows as heads-up banner
			visibility: 1, // VISIBILITY_PUBLIC
			sound: "default",
			vibration: true,
		});
	}

	await PushNotifications.removeAllListeners();
	await PushNotifications.register();

	PushNotifications.addListener("registration", async (token) => {
		console.log("Device Token:", token.value);

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) return;

		try {
			// Use upsert so that if a token for this user already exists,
			// it gets updated instead of throwing a duplicate-key error.
			// Adjust onConflict to match your actual unique constraint column(s).
			const { error } = await supabase.from("User_Push_Token").upsert(
				{
					user_id: user.id,
					user_push_token: token.value,
				},
				{ onConflict: "user_id" },
			);

			if (error) {
				console.error("Error saving FCM token:", error);
			} else {
				console.log(
					"FCM token registered/updated for user:",
					user.id,
					"token:",
					token.value,
				);
			}
		} catch (err) {
			console.error("Error registering token:", err);
		}
	});

	PushNotifications.addListener("registrationError", (err) => {
		console.error("Registration error:", err);
	});

	PushNotifications.addListener(
		"pushNotificationReceived",
		(notification) => {
			console.log("Push received:", notification);
		},
	);

	PushNotifications.addListener(
		"pushNotificationActionPerformed",
		(notification) => {
			console.log("Notification clicked:", notification);
		},
	);
};
