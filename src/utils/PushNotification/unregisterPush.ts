import { PushNotifications } from "@capacitor/push-notifications";
import { supabase } from "@/config/supabaseclient";
import { Capacitor } from "@capacitor/core";

export const unregisterPush = async () => {
	if (!Capacitor.isNativePlatform()) return;

	const token = localStorage.getItem("fcm_token");
	if (!token) return;

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return;

	try {
		const { error } = await supabase
			.from("User_Push_Token")
			.delete()
			.match({ user_id: user.id, user_push_token: token });

		if (error) {
			console.error("Error deleting push token:", error);
		} else {
			console.log("Push token deleted for user:", user.id);
		}

		localStorage.removeItem("fcm_token");
		await PushNotifications.removeAllListeners();
	} catch (err) {
		console.error("Error unregistering push:", err);
	}
};
