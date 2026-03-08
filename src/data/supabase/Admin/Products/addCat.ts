import { supabase } from "@/config/supabaseclient";

export async function addCategory(category_name: string) {
	try {
		const { error } = await supabase
			.from("Category")
			.insert({ category_name: category_name.trim() });
		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (err) {
		return { success: false, error: "Unexpected error occurred" };
	}
}
