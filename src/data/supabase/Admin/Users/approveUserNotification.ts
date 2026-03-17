import { supabase } from "@/config/supabaseclient";

/**
 * Sends push and in-app notifications to a user when their account is approved.
 *
 * @param userId The ID of the user being approved.
 */
export async function approveUserNotification(userId: string) {
	try {
		const title = "Account Approved";
		const body = "Your account has been approved. Welcome to Baybayani.";

		// A. Push Notification via Edge Function
		const pushPromise = supabase.functions
			.invoke("send-push-notification", {
				body: {
					userId,
					title,
					body,
					data: {
						type: "account_approved",
					},
				},
			})
			.then(({ data, error }) => {
				if (error) {
					console.error(
						`Edge Function error for user ${userId}:`,
						error,
					);
				} else if (data?.skipped) {
					console.warn(
						`Push notification SKIPPED for user ${userId}. Reason: ${data.reason}`,
					);
				} else {
					console.log(
						`Push notification SENT successfully to user ${userId}:`,
						data,
					);
				}
			})
			.catch((err) =>
				console.error(
					`Network error sending push to user ${userId}:`,
					err,
				),
			);

		// B. In-app Notification
		const dbPromise = supabase.from("Notification").insert({
			user_id: userId,
			title,
			body,
			type: "account_approved",
			data: { userId },
			is_read: false,
		});

		await Promise.all([pushPromise, dbPromise]);
		console.log(`Approval notifications sent to user ${userId}.`);
	} catch (err) {
		console.error("Error in approveUserNotification:", err);
	}
}
