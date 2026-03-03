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

	await PushNotifications.register();

	PushNotifications.addListener("registration", async (token) => {
		console.log("Device Token:", token.value);
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) return;

		const { error } = await supabase.from("User").upsert(
			{
				user_id: user.id,
				fcm_token: token.value,
			},
			{ onConflict: "fcm_token" },
		);

		if (error) {
			console.error("Error saving FCM token:", error);
		} else {
			console.log("FCM token saved successfully");
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
