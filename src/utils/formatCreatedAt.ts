export function formatCreatedAt(createdAt?: string | null) {
	if (!createdAt) return null;

	const created = new Date(createdAt);
	if (isNaN(created.getTime())) return null;

	const formattedDate = created.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	const today = new Date();

	// Normalize to midnight for calendar-day diff
	created.setHours(0, 0, 0, 0);
	today.setHours(0, 0, 0, 0);

	const diff = Math.floor(
		(today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
	);

	let relativeText = "";
	if (diff === 0) relativeText = "Today";
	else if (diff === 1) relativeText = "1 day ago";
	else relativeText = `${diff} days ago`;

	return { formattedDate, relativeText };
}
