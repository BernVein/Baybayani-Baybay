import { supabase } from "@/config/supabaseclient";
import { approveUserNotification } from "./approveUserNotification";

export async function changeUserStatus(
	userID: string,
	userStatus: "Approved" | "For Approval" | "Rejected" | "Suspended",
) {
	try {
		if (!userID) throw new Error("User ID is required");

		const { error } = await supabase
			.from("User")
			.update({
				user_status: userStatus,
				last_updated: new Date().toISOString(),
			})
			.eq("user_id", userID);

		if (error) throw error;

		if (userStatus === "Approved") {
			await approveUserNotification(userID);
		}

		window.dispatchEvent(new Event("baybayani:update-user-table"));

		return { success: true };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : JSON.stringify(error);

		return { success: false, error: message };
	}
}
