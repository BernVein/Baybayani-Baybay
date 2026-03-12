import { supabase } from "@/config/supabaseclient";

export async function uploadProfileImage(
	userId: string,
	file: File,
): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
	const filePath = `${userId}/avatar.webp`;

	const { error: uploadError } = await supabase.storage
		.from("User_Profile")
		.upload(filePath, file, {
			contentType: "image/webp",
			upsert: true,
		});

	if (uploadError) {
		console.error("Error uploading profile image:", uploadError);
		return { success: false, error: uploadError.message };
	}

	const { data } = supabase.storage
		.from("User_Profile")
		.getPublicUrl(filePath);

	// Bust cache with timestamp
	const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

	return { success: true, publicUrl };
}
