import { supabase } from "@/config/supabaseclient";

export async function addTag(tag_name: string) {
	try {
		const { error } = await supabase
			.from("Tag")
			.insert({ tag_name: tag_name.trim() });
		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (err) {
		return { success: false, error: "Unexpected error occurred" };
	}
}
