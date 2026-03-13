import { supabase } from "@/config/supabaseclient";
import { Announcement } from "@/model/Announcement";

export async function fetchAnnouncements(
	page: number = 1,
	pageSize: number = 10,
) {
	try {
		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		// Fetch announcements with their images using server-side range for pagination
		const { data, error, count } = await supabase
			.from("Announcement")
			.select("*, images:Announcement_Image(*)", { count: "exact" })
			.order("created_at", { ascending: false })
			.range(from, to);

		if (error) throw error;

		return {
			data: (data || []) as Announcement[],
			total: count || 0,
		};
	} catch (error) {
		console.error("Error in fetchAnnouncements:", error);
		return { data: [], total: 0, error };
	}
}

export async function fetchLatestAnnouncement() {
	try {
		const { data, error } = await supabase
			.from("Announcement")
			.select("*, images:Announcement_Image(*)")
			.order("created_at", { ascending: false })
			.limit(1)
			.maybeSingle();

		if (error) throw error;
		return data as Announcement | null;
	} catch (error) {
		console.error("Error in fetchLatestAnnouncement:", error);
		return null;
	}
}
