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

	PushNotifications.addListener("registration", async (token) => {
		console.log("Device Token:", token.value);

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) return;

		try {
			// A physical device always produces the same FCM token regardless of
			// which account is logged in. Because user_push_token has a UNIQUE
			// constraint on the token column, a plain INSERT fails with a
			// duplicate-key error when a different user logs in on the same device.
			//
			// Fix: upsert on the token value and update user_id to the current
			// user. This re-assigns the device row to whoever is logged in now,
			// which is exactly what we want for "multi-account, one device".
			const { error: upsertError } = await supabase
				.from("User_Push_Token")
				.upsert(
					{
						user_id: user.id,
						user_push_token: token.value,
					},
					{
						onConflict: "user_push_token", // unique column
						ignoreDuplicates: false, // always update user_id
					},
				);

			if (upsertError) {
				console.error("Error saving FCM token:", upsertError);
			} else {
				console.log(
					"FCM token upserted for user:",
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

	await PushNotifications.register();
};
