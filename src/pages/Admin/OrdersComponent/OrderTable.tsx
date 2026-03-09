import { addToast } from "@heroui/react";
import { OrderTableMobile } from "@/pages/Admin/OrdersComponent/OrderTableResponsive/OrderTableMobile";
import { OrderTableDesktop } from "@/pages/Admin/OrdersComponent/OrderTableResponsive/OrderTableDesktop";
import { fetchLatestStock } from "@/data/supabase/Admin/Products/fetchLatestStock";
import { recordStockAdjustment } from "@/data/supabase/Admin/Products/recordStockAdjustment";
import { changeOrderStatus } from "@/data/supabase/Admin/Orders/changeOrderStatus";
import { StockMovement } from "@/model/stockMovement";
import type { Selection } from "@heroui/react";
import { OrderTableRow } from "@/model/ui/Admin/order_table_row";
import { Dispatch, SetStateAction, useState } from "react";
import { InsufficientStockModal } from "@/pages/Admin/OrdersComponent/InsufficientStockModal";
import { useDisclosure } from "@heroui/react";
import { OrderCancelModal } from "@/pages/General/Orders/OrderCancelModal";
import { LoadingModal } from "@/pages/General/Orders/LoadingModal";
import { OrderTableSkeleton } from "@/components/skeletons/Admin/Orders/OrderTableSkeleton";

export function OrderTable({
	orderItems: orders,
	setOrderItems: setOrders,
	loading,
}: {
	selectedCategories: Selection;
	searchQuery: string;
	orderItems: OrderTableRow[] | null;
	setOrderItems: Dispatch<SetStateAction<OrderTableRow[] | null>>;
	loading: boolean;
}) {
	const {
		isOpen: isOpenLoading,
		onOpen: onOpenLoading,
		onClose: onCloseLoading,
		onOpenChange: onOpenChangeLoading,
	} = useDisclosure();

	const {
		isOpen: isStockModalOpen,
		onOpen: onOpenStockModal,
		onOpenChange: onOpenChangeStockModal,
	} = useDisclosure();

	const {
		isOpen: isOpenCancelModal,
		onOpen: onOpenCancelModal,
		onOpenChange: onOpenChangeCancelModal,
	} = useDisclosure();

	const [stockConflictData, setStockConflictData] = useState<{
		itemName: string;
		variantName: string;
		requestedQuantity: number;
		availableStock: number;
		targetStatus: string;
		unitOfMeasure: string;
	} | null>(null);
	const [cancelOrderData, setCancelOrderData] = useState<{
		orderId: string;
		currentStatus: "Pending" | "Ready" | "Completed" | "Cancelled";
	} | null>(null);

	const handleOrder = async (
		orderId: string,
		changeToStatus: "Pending" | "Ready" | "Completed" | "Cancelled",
		currentStatus: "Pending" | "Ready" | "Completed" | "Cancelled",
		cancelReason?: string,
	) => {
		onOpenLoading();

		try {
			const order = orders?.find((o) => o.order_id === orderId);
			if (!order) throw new Error("Order not found");

			const willCheckStock =
				changeToStatus === "Ready" || changeToStatus === "Completed";

			const willDeductStock =
				changeToStatus === "Completed" && currentStatus !== "Completed";

			const willRestoreStock =
				currentStatus === "Completed" && changeToStatus !== "Completed";

			// Validate
			if (willCheckStock) {
				const { effectiveStocks, success } = await fetchLatestStock(
					order.item_variant_id,
				);

				if (success && (effectiveStocks ?? 0) < order.item_quantity) {
					setStockConflictData({
						itemName: order.item_name,
						variantName: order.item_variant_name,
						requestedQuantity: order.item_quantity,
						availableStock: effectiveStocks ?? 0,
						targetStatus: changeToStatus,
						unitOfMeasure: order.item_sold_by,
					});

					onCloseLoading();
					onOpenStockModal();
					return;
				}
			}
			// update
			const { error } = await changeOrderStatus(
				orderId,
				changeToStatus,
				cancelReason,
			);

			if (error) throw error;
			// optimistic update
			setOrders((prev) => {
				if (!prev) return prev;

				return prev.map((o) =>
					o.order_id === orderId
						? {
								...o,
								status: changeToStatus,
								cancel_reason: cancelReason,
							}
						: o,
				);
			});

			// deduct stock
			if (willDeductStock) {
				const { effectiveStocks } = await fetchLatestStock(
					order.item_variant_id,
				);

				await recordStockAdjustment(order.item_variant_id, {
					stock_change_count: order.item_quantity,
					stock_adjustment_type: "Sale",
					stock_change_date: new Date().toISOString(),
					effective_stocks:
						(effectiveStocks ?? 0) - order.item_quantity,
					sale_amount: order.subtotal,
					stock_loss_reason: "Sale",
				} as StockMovement);
			}

			// ui wont let it do this but in case
			if (willRestoreStock) {
				const { effectiveStocks } = await fetchLatestStock(
					order.item_variant_id,
				);

				await recordStockAdjustment(order.item_variant_id, {
					stock_change_count: order.item_quantity,
					stock_adjustment_type: "From Cancelled",
					stock_change_date: new Date().toISOString(),
					effective_stocks:
						(effectiveStocks ?? 0) + order.item_quantity,
				});
			}

			addToast({
				title: `Order updated to ${changeToStatus}`,
				description: "The order status has been successfully updated.",
				timeout: 4000,
				shouldShowTimeoutProgress: true,
				severity: "success",
				color: "success",
			});
		} catch (err: any) {
			addToast({
				title: "Update Failed",
				description: err?.message || "Failed to update order status",
				timeout: 5000,
				shouldShowTimeoutProgress: true,
				severity: "danger",
				color: "danger",
			});
		} finally {
			onCloseLoading();
		}
	};
	const onOpenCancelModalWithData = (
		orderId: string,
		currentStatus: "Pending" | "Ready" | "Completed" | "Cancelled",
	) => {
		setCancelOrderData({ orderId, currentStatus });
		onOpenCancelModal();
	};

	const handleCancelConfirm = (reason: string) => {
		if (cancelOrderData) {
			handleOrder(
				cancelOrderData.orderId,
				"Cancelled",
				cancelOrderData.currentStatus,
				reason,
			);
		}
	};

	if (loading) {
		return <OrderTableSkeleton />;
	}

	return (
		<div className="h-full flex flex-col">
			<OrderTableMobile
				orders={orders || []}
				handleOrder={handleOrder}
				onOpenCancelModal={onOpenCancelModalWithData}
			/>
			<OrderTableDesktop
				orders={orders || []}
				handleOrder={handleOrder}
				onOpenCancelModal={onOpenCancelModalWithData}
			/>
			<OrderCancelModal
				isOpenCancelModal={isOpenCancelModal}
				onOpenChangeCancelModal={onOpenChangeCancelModal}
				onConfirm={handleCancelConfirm}
			/>
			<LoadingModal
				isOpenLoading={isOpenLoading}
				onOpenChangeLoading={onOpenChangeLoading}
			/>
			<InsufficientStockModal
				isOpen={isStockModalOpen}
				onOpenChange={onOpenChangeStockModal}
				itemName={stockConflictData?.itemName || ""}
				unitOfMeasure={stockConflictData?.unitOfMeasure || ""}
				variantName={stockConflictData?.variantName || ""}
				requestedQuantity={stockConflictData?.requestedQuantity || 0}
				availableStock={stockConflictData?.availableStock || 0}
				targetStatus={stockConflictData?.targetStatus || ""}
			/>
		</div>
	);
}
