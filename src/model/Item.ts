import { ItemVariant } from "@/model/itemVariant";
export interface Item {
	item_id: string;
	category: string;
	title: string;
	img: string[];
	sold_by: string;
	description: string;
	tag?: string | null;
	is_soft_deleted: boolean;
	last_updated: string;
	created_at?: string;
	variants: ItemVariant[];
}
