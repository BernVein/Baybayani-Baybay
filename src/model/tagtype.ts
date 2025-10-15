export type TagType = "New" | "Restocked" | "PriceDrop";

export type ChipColor =
	| "default"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger";

export const tagColors: Record<TagType, ChipColor> = {
	New: "primary",
	Restocked: "success",
	PriceDrop: "warning",
};
