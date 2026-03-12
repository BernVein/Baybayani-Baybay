import { supabase } from "@/config/supabaseclient";

export async function updateUserProfile(
	userId: string,
	data: {
		user_name?: string;
		user_phone_number?: string;
		user_profile_img_url?: string;
	},
): Promise<{ success: boolean; error?: string }> {
	const { error } = await supabase
		.from("User")
		.update(data)
		.eq("user_id", userId);

	if (error) {
		console.error("Error updating user profile:", error);
		return { success: false, error: error.message };
	}

	return { success: true };
}
