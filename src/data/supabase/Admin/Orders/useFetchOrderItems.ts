import { useEffect, useState, useCallback } from "react";

import { supabase } from "@/config/supabaseclient";
import { OrderTableRow } from "@/model/ui/Admin/order_table_row";

export const useFetchOrderItems = (
	categories?: string[],
	searchQuery?: string,
) => {
	const [orderItems, setOrderItems] = useState<OrderTableRow[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [fetchError, setFetchError] = useState<string | null>(null);

	const fetchItem = useCallback(async () => {
		setLoading(true);
		setFetchError(null);

		let query = supabase
			.from("OrderItemUser")
			.select(
				`order_item_user_id,
				price_variant,
				quantity,
				subtotal,
				status,
				created_at,
				order_identifier,
				User(user_role, user_name, user_profile_img_url),
				Item(item_title, item_sold_by, Item_Image(item_image_url), Tag(tag_name), Category(category_name)),
				VariantSnapshot(variant_snapshot_name, variant_snapshot_id, variant_copy_snapshot_id)
				`,
			)
			.eq("is_soft_deleted", false);

		if (categories && categories.length > 0) {
			query = query.in("status", categories);
		}
		if (searchQuery && searchQuery.trim() !== "") {
			query = query.or(`order_identifier.ilike.%${searchQuery}%`);
		}

		const { data, error } = await query.order("created_at", {
			ascending: false,
		});

		setLoading(false);

		if (error) {
			setFetchError(error.message || "Failed to fetch item.");
			setOrderItems([]); // Clear stale data on error

			return;
		}

		if (!data || data.length === 0) {
			setOrderItems([]);

			return;
		}

		const orderItems = data.map(
			(orderItem: any) =>
				({
					order_id: orderItem.order_item_user_id,
					user_name: orderItem.User?.user_name ?? "Unknown User",
					user_role: orderItem.User?.user_role ?? "Guest",
					date_ordered: orderItem.created_at,
					item_name: orderItem.Item?.item_title ?? "Unknown Item",
					item_variant_name:
						orderItem.VariantSnapshot?.variant_snapshot_name ??
						"Default Variant",
					item_quantity: orderItem.quantity,
					subtotal: orderItem.subtotal,
					price_variant: orderItem.price_variant,
					status: orderItem.status,
					item_first_img_url:
						orderItem.Item?.Item_Image?.[0]?.item_image_url ?? "",
					user_profile_img_url:
						orderItem.User?.user_profile_img_url ?? "",
					item_sold_by: orderItem.Item?.item_sold_by ?? "Unknown",
					item_variant_id:
						orderItem.VariantSnapshot?.variant_copy_snapshot_id ??
						"",
					order_identifier: orderItem.order_identifier ?? "",
				}) as OrderTableRow,
		);

		setOrderItems(orderItems);
	}, [categories, searchQuery]);

	useEffect(() => {
		fetchItem();
	}, [fetchItem]);

	return {
		orderItems,
		setOrderItems,
		loading,
		fetchError,
		refetch: fetchItem,
	};
};
