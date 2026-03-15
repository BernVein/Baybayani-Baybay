import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";
import { Notification } from "@/model/notification";
import { OrderCard } from "@/model/ui/Customer/order_card";

export interface CancelledOrderWithDetails {
	notification: Notification;
	order: OrderCard | null;
}

export function useClosingCancellations(userId: string | undefined) {
	const [cancelledOrders, setCancelledOrders] = useState<
		CancelledOrderWithDetails[]
	>([]);
	const [loading, setLoading] = useState(false);

	const fetchOrderDetails = useCallback(
		async (
			notifications: Notification[],
		): Promise<CancelledOrderWithDetails[]> => {
			const orderIds = notifications
				.map((n) => n.data?.orderId)
				.filter((id): id is string => !!id);

			if (orderIds.length === 0) {
				return notifications.map((n) => ({
					notification: n,
					order: null,
				}));
			}

			const { data: rawOrders, error } = await supabase
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
				cancel_reason                           
			`,
				)
				.in("order_item_user_id", orderIds);

			if (error || !rawOrders) {
				console.error(
					"Error fetching order details for cancellations:",
					error,
				);
				return notifications.map((n) => ({
					notification: n,
					order: null,
				}));
			}

			const mappedOrders: Record<string, OrderCard> = {};
			rawOrders.forEach((order: any) => {
				mappedOrders[order.order_item_user_id] = {
					order_item_user_id: order.order_item_user_id,
					variant_name:
						order.VariantSnapshot?.variant_snapshot_name ?? "",
					variant_snapshot_id:
						order.VariantSnapshot?.variant_copy_snapshot_id ?? "",
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
				};
			});

			return notifications.map((n) => ({
				notification: n,
				order: mappedOrders[n.data?.orderId] || null,
			}));
		},
		[],
	);

	const fetchCancelledOrders = useCallback(async () => {
		if (!userId) return;
		setLoading(true);
		const { data, error } = await supabase
			.from("Notification")
			.select("*")
			.eq("user_id", userId)
			.eq("type", "order_cancelled_closing")
			.eq("is_read", false);

		if (!error && data) {
			const withDetails = await fetchOrderDetails(data);
			setCancelledOrders(withDetails);
		}
		setLoading(false);
	}, [userId, fetchOrderDetails]);

	const markAsRead = async () => {
		if (!userId || cancelledOrders.length === 0) return;
		const ids = cancelledOrders.map((n) => n.notification.notification_id);
		const { error } = await supabase
			.from("Notification")
			.update({ is_read: true })
			.in("notification_id", ids);

		if (!error) {
			setCancelledOrders([]);
		} else {
			console.error(
				"Error marking closing cancellations as read:",
				error,
			);
		}
	};

	useEffect(() => {
		fetchCancelledOrders();
	}, [fetchCancelledOrders]);

	// Listen for real-time notifications
	useEffect(() => {
		if (!userId) return;

		const channel = supabase
			.channel(`closing-cancellations-${userId}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "Notification",
					filter: `user_id=eq.${userId}`,
				},
				async (payload) => {
					const newNotif = payload.new as Notification;
					if (
						newNotif.type === "order_cancelled_closing" &&
						!newNotif.is_read
					) {
						const [withDetail] = await fetchOrderDetails([
							newNotif,
						]);
						setCancelledOrders((prev) => [...prev, withDetail]);
					}
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [userId, fetchOrderDetails]);

	return {
		cancelledOrders,
		loading,
		markAsRead,
		refetch: fetchCancelledOrders,
	};
}
