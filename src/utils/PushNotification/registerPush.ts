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

	await PushNotifications.removeAllListeners();
	await PushNotifications.register();

	PushNotifications.addListener("registration", async (token) => {
		console.log("Device Token:", token.value);
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) return;

		// Remove the token if it already exists for another user
		await supabase
			.from("User_Push_Token")
			.delete()
			.eq("user_push_token", token.value)
			.neq("user_id", user.id);

		// Insert the token if it doesn’t exist yet for this user
		const { error } = await supabase.from("User_Push_Token").upsert(
			{
				user_id: user.id,
				user_push_token: token.value,
			},
			{
				onConflict: "user_push_token", // conflict on the token, not user
				ignoreDuplicates: true, // don’t overwrite if already exists
			},
		);

		if (error) console.error("Error saving FCM token:", error);
		else console.log("FCM token saved successfully");
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
