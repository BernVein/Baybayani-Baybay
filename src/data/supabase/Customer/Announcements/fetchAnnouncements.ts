import { supabase } from "@/config/supabaseclient";
import { Announcement } from "@/model/Announcement";

export async function fetchAnnouncements(
	page: number = 1,
	pageSize: number = 10,
) {
	try {
		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		// Fetch announcements with their images
		const { data, error } = await supabase
			.from("Announcement")
			.select("*, images:Announcement_Image(*)")
			.order("created_at", { ascending: false });
		// We fetch all and filter for "one per date" in JS for now
		// because Supabase doesn't easily support DISTINCT ON via select()

		if (error) throw error;

		if (!data) return { data: [], total: 0 };

		// Filter to show only one announcement per unique date
		const seenDates = new Set<string>();
		const uniqueAnnouncements: Announcement[] = [];

		for (const ann of data) {
			const date = new Date(ann.created_at).toLocaleDateString();
			if (!seenDates.has(date)) {
				seenDates.add(date);
				uniqueAnnouncements.push(ann as Announcement);
			}
		}

		// Apply pagination to the filtered results
		const paginatedData = uniqueAnnouncements.slice(from, to + 1);

		return {
			data: paginatedData,
			total: uniqueAnnouncements.length,
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
