import { Variant } from "@/model/variant";
export interface Item {
	item_id: string;
	item_category: string;
	item_title: string;
	item_img: string[];
	item_sold_by: string;
	item_description: string;
	item_tag?: string | null;
	is_soft_deleted: boolean;
	last_updated: string;
	created_at?: string;
	item_variants: Variant[];
}
