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

		try {
			let query = supabase
				.from("OrderItemUser")
				.select(
					`order_item_user_id,
                price_variant,
                quantity,
                subtotal,
                status,
                created_at,
                user_id,
                item_id,
                variant_snapshot_id,
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
				const safeSearch = searchQuery.trim().replace(/"/g, "");

				// 1. Fetch related IDs (User, Item, Variant)
				const [userRes, itemRes, variantRes] = await Promise.all([
					supabase
						.from("User")
						.select("user_id")
						.ilike("user_name", `%${safeSearch}%`)
						.eq("is_soft_deleted", false)
						.limit(50),
					supabase
						.from("Item")
						.select("item_id")
						.ilike("item_title", `%${safeSearch}%`)
						.eq("is_soft_deleted", false)
						.limit(50),
					supabase
						.from("VariantSnapshot")
						.select("variant_snapshot_id")
						.ilike("variant_snapshot_name", `%${safeSearch}%`)
						.eq("is_soft_deleted", false)
						.limit(50),
				]);

				const userIds = userRes.data?.map((u) => u.user_id) || [];
				const itemIds = itemRes.data?.map((i) => i.item_id) || [];
				const variantIds =
					variantRes.data?.map((v) => v.variant_snapshot_id) || [];

				const orConditions = [];

				// 2. THE FIX: The exact syntax for partial UUID search in an .or() block
				// We use the double colon cast, but wrap the search term in double quotes
				orConditions.push(
					`order_item_user_id::text.ilike.*${safeSearch}*`,
				);

				// 3. Add the Foreign Key matches
				if (userIds.length > 0) {
					orConditions.push(`user_id.in.(${userIds.join(",")})`);
				}
				if (itemIds.length > 0) {
					orConditions.push(`item_id.in.(${itemIds.join(",")})`);
				}
				if (variantIds.length > 0) {
					orConditions.push(
						`variant_snapshot_id.in.(${variantIds.join(",")})`,
					);
				}

				// 4. Final join
				// Important: Use .or(`(${orConditions.join(',')})`) to ensure the logic tree is valid
				query = query.or(orConditions.join(","));
			}
			const { data, error } = await query.order("created_at", {
				ascending: false,
			});

			if (error) {
				setFetchError(error.message || "Failed to fetch item.");
				setOrderItems([]);
				return;
			}

			if (!data || data.length === 0) {
				setOrderItems([]);
				return;
			}

			const mappedOrderItems = data.map(
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
							orderItem.Item?.Item_Image?.[0]?.item_image_url ??
							"",
						user_profile_img_url:
							orderItem.User?.user_profile_img_url ?? "",
						item_sold_by: orderItem.Item?.item_sold_by ?? "Unknown",
						item_variant_id:
							orderItem.VariantSnapshot
								?.variant_copy_snapshot_id ?? "",
					}) as OrderTableRow,
			);

			setOrderItems(mappedOrderItems);
		} catch (err: any) {
			setFetchError(err.message || "An unexpected error occurred.");
			setOrderItems([]);
		} finally {
			setLoading(false);
		}
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
