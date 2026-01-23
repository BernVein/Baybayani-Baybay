import { Variant } from "@/model/variant";
export interface Item {
    item_id: string;
    item_category: string;
    item_title: string;
    item_img: string[]; // Join in db, this column doenst exist
    item_sold_by: string;
    item_description: string;
    item_tag?: string | null;
    item_has_variant: boolean;
    is_soft_deleted: boolean;
    last_updated: string; // timestamptz
    created_at?: string; // timestamptz
    item_variants: Variant[]; // Join in db, this column doenst exist
}
