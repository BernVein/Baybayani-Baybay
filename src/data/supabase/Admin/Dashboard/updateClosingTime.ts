import { supabase } from "@/config/supabaseclient";

export async function updateClosingTime(closingTime: string) {
	// closingTime should be in "HH:MM" format or similar compatible with Postgres `time`
	const { data, error } = await supabase
		.from("ClosingTime")
		.update({ closing_time: closingTime })
		.select()
		.single();

	if (error) {
		console.error("Error updating closing time:", error);
		return { success: false, error };
	}

	return { success: true, data };
}
