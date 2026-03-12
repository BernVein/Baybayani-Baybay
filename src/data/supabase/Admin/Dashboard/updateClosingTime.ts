import { supabase } from "@/config/supabaseclient";

export async function updateClosingTime(
	closingTime: string,
	openingTime: string,
	isClosedForTheDay: boolean,
) {
	const { error } = await supabase
		.from("ClosingTime")
		.update({
			closing_time: closingTime,
			opening_time: openingTime,
			is_closed_for_the_day: isClosedForTheDay,
		})
		.eq("closing_time_id", "45a6559c-61e5-444d-b8f6-6dc189c52c8a");

	if (error) {
		console.error("Error updating closing time:", error);
		return { success: false };
	}

	return { success: true };
}
