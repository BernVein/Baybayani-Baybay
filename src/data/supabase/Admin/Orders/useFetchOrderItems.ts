import { useEffect, useState, useCallback } from "react";

import { supabase } from "@/config/supabaseclient";
import { OrderTableRow } from "@/model/ui/Admin/order_table_row";

export const useFetchOrderItems = () => {
	const [orderItems, setOrderItems] = useState<OrderTableRow[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [fetchError, setFetchError] = useState<string | null>(null);

	const fetchItem = useCallback(async () => {
		setLoading(true);
		setFetchError(null);

		const { data, error } = await supabase
			.from("OrderItemUser")
			.select(
				`order_item_user_id,
				price_variant,
				quantity,
				subtotal,
				status,
				created_at,
				User(user_role, user_name, user_profile_img_url),
                Item(item_title, item_sold_by, Item_Image(item_image_url), Tag(tag_name), Category(category_name)),
				VariantSnapshot(variant_snapshot_name)          
                `,
			)
			.eq("is_soft_deleted", false);
		console.log("Data: ", data);
		setLoading(false);

		if (error) {
			setFetchError(error.message || "Failed to fetch item.");

			return;
		}

		if (!data) {
			setOrderItems(null);

			return;
		}

		const orderItems = data.map(
			(orderItem: any) =>
				({
					order_id: orderItem.order_item_user_id,
					user_name: orderItem.User.user_name,
					user_role: orderItem.User.user_role,
					date_ordered: orderItem.created_at,
					item_name: orderItem.Item.item_title,
					item_variant_name:
						orderItem.VariantSnapshot.variant_snapshot_name,
					item_quantity: orderItem.quantity,
					subtotal: orderItem.subtotal,
					price_variant: orderItem.price_variant,
					status: orderItem.status,
					item_first_img_url:
						orderItem.Item.Item_Image[0].item_image_url,
					user_profile_img_url: orderItem.User.user_profile_img_url,
					item_sold_by: orderItem.Item.item_sold_by,
				}) as OrderTableRow,
		);

		setOrderItems(orderItems);
	}, []);

	useEffect(() => {
		fetchItem();
	}, [fetchItem]);

	return {
		orderItems,
		loading,
		fetchError,
		refetch: fetchItem,
	};
};
