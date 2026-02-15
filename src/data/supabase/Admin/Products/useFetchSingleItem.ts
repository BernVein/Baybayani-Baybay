import { useEffect, useState, useCallback } from "react";

import { supabase } from "@/config/supabaseclient";
import { Item } from "@/model/Item";

export const useFetchSingleItem = (item_id: string) => {
	const [item, setItem] = useState<Item | null>(null);
	const [loading, setLoading] = useState(false);
	const [fetchError, setFetchError] = useState<string | null>(null);

	const fetchItem = useCallback(async () => {
		if (!item_id) return;

		setLoading(true);
		setFetchError(null);

		const { data, error } = await supabase
			.from("Item")
			.select(
				`*, Item_Image(item_image_url), Variant(*), Tag(tag_name), Category(category_name)`,
			)
			.eq("item_id", item_id)
			.eq("is_soft_deleted", false)
			.single(); // only one row expected

		setLoading(false);

		if (error) {
			setFetchError(error.message || "Failed to fetch item.");

			return;
		}

		if (!data) {
			setItem(null);

			return;
		}

		// map variants and filter out soft-deleted ones
		const variants = (data.Variant || [])
			.map((v: any) => ({
				variant_id: v.variant_id,
				variant_name: v.variant_name,
				variant_price_retail: Number(v.variant_price_retail),
				variant_price_wholesale:
					v.variant_price_wholesale === null
						? null
						: Number(v.variant_price_wholesale),
				variant_wholesale_item:
					v.variant_wholesale_item === null
						? null
						: Number(v.variant_wholesale_item),
				variant_stocks: Number(v.variant_stocks ?? 0),
				variant_last_updated_stock: v.variant_last_updated_stock,
				variant_last_updated_price_retail:
					v.variant_last_updated_price_retail ?? null,
				variant_last_price_retail:
					v.variant_last_price_retail === null
						? undefined
						: Number(v.variant_last_price_retail),
				variant_last_updated_price_wholesale:
					v.variant_last_updated_price_wholesale ?? null,
				variant_last_price_wholesale:
					v.variant_last_price_wholesale === null
						? null
						: Number(v.variant_last_price_wholesale),
				last_updated: v.last_updated,
				is_soft_deleted: v.is_soft_deleted,
				created_at: v.created_at,
			}))
			.filter((v: any) => !v.is_soft_deleted);

		// map the final item
		const mappedItem: Item = {
			item_id: data.item_id,
			item_category: data.Category?.category_name,
			item_title: data.item_title,
			item_img: (data.Item_Image || []).map(
				(img: any) => img.item_image_url,
			),
			item_sold_by: data.item_sold_by,
			item_description: data.item_description,
			item_tag: data.Tag?.tag_name ?? null,
			item_has_variant: data.item_has_variant ?? false,
			is_soft_deleted: data.is_soft_deleted,
			last_updated: data.last_updated,
			created_at: data.created_at,
			item_variants: variants,
		};

		setItem(mappedItem);
	}, [item_id]);

	useEffect(() => {
		fetchItem();
	}, [fetchItem]);

	return {
		item,
		loading,
		fetchError,
		refetch: fetchItem,
	};
};
