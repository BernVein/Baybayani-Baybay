import { useEffect, useRef, useState, useCallback } from "react";

import { supabase } from "@/config/supabaseclient";
import { OrderCard } from "@/model/ui/Customer/order_card";

const PAGE_SIZE = 8;

export const useFetchOrderCards = (userId?: string, page = 1) => {
	const [data, setData] = useState<OrderCard[]>([]);
	const [error, setError] = useState<any>(null);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const hasFetchedOnce = useRef(false);

	const fetchOrders = useCallback(
		async (opts?: { background?: boolean }) => {
			if (!userId) return;

			try {
				if (!opts?.background) {
					setLoading(true);
				}
				setError(null);

				const from = (page - 1) * PAGE_SIZE;
				const to = from + PAGE_SIZE - 1;

				const {
					data: rawData,
					error: fetchError,
					count,
				} = await supabase
					.from("OrderItemUser")
					.select(
						`
                            order_item_user_id,
                            VariantSnapshot(variant_snapshot_name, variant_copy_snapshot_id),
                            Item(item_title, item_sold_by, Item_Image(item_image_url), Variant(variant_id)),
                            subtotal,
                            quantity,
                            price_variant,
                            created_at,
                            status,
                            order_identifier,
							cancel_reason,
							last_updated
                      `,
						{ count: "exact" },
					)
					.eq("user_id", userId)
					.eq("is_soft_deleted", false)
					.order("created_at", { ascending: false })
					.range(from, to);

				if (fetchError) {
					setError(fetchError);
					return;
				}

				setTotalPages(Math.ceil((count ?? 0) / PAGE_SIZE));
				const mapped: OrderCard[] = (rawData ?? []).map(
					(order: any) => ({
						order_item_user_id: order.order_item_user_id,
						variant_name:
							order.VariantSnapshot?.variant_snapshot_name ?? "",
						variant_snapshot_id:
							order.VariantSnapshot?.variant_copy_snapshot_id ??
							"",
						item_name: order.Item?.item_title ?? "",
						item_sold_by: order.Item?.item_sold_by ?? "",
						item_first_image:
							order.Item?.Item_Image?.[0]?.item_image_url ?? "",
						subtotal: Number(order.subtotal),
						quantity: Number(order.quantity),
						price_variant: order.price_variant ?? "",
						date_ordered: order.created_at,
						status: order.status,
						order_identifier: order.order_identifier,
						cancel_reason: order.cancel_reason,
						last_updated: order.last_updated,
					}),
				);

				setData(mapped);
				hasFetchedOnce.current = true;
			} catch (err) {
				setError(err);
			} finally {
				if (!opts?.background) {
					setLoading(false);
				}
			}
		},
		[userId, page],
	);

	const fetchOrdersRef = useRef(fetchOrders);
	fetchOrdersRef.current = fetchOrders;

	// True only on the very first load (no data to show yet)
	const initialLoading = loading && !hasFetchedOnce.current;

	useEffect(() => {
		if (!userId) return;
		void fetchOrders();
	}, [userId, page, fetchOrders]);

	useEffect(() => {
		if (!userId) return;

		const channel = supabase
			.channel(`user-orders-${userId}-${Math.random()}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "OrderItemUser",
					filter: `user_id=eq.${userId}`,
				},
				() => {
					void fetchOrdersRef.current({ background: true });
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [userId]);

	return { data, setData, error, totalPages, loading, initialLoading };
};
