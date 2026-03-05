import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Skeleton,
	addToast,
} from "@heroui/react";
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
import { OrderCancelModal } from "@/pages/Admin/OrdersComponent/OrderCancelModal";
import { LoadingModal } from "@/pages/Admin/OrdersComponent/LoadingModal";

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

	const handleOrder = async (
		orderId: string,
		changeToStatus: "Pending" | "Ready" | "Completed" | "Cancelled",
		currentStatus: "Pending" | "Ready" | "Completed" | "Cancelled",
	) => {
		onOpenLoading();
		const canCheckStockChangeStatus =
			changeToStatus === "Ready" || changeToStatus === "Completed";
		const canCheckStockCurrentStatus =
			currentStatus !== "Ready" &&
			currentStatus !== "Completed" &&
			currentStatus !== "Cancelled";
		try {
			const order = orders?.find((o) => o.order_id === orderId);

			if (order) {
				// Only check if we are NOT already in a Ready or Completed state
				if (canCheckStockChangeStatus && canCheckStockCurrentStatus) {
					const { effectiveStocks, success } = await fetchLatestStock(
						order.item_variant_id,
					);

					if (
						success &&
						(effectiveStocks ?? 0) < order.item_quantity
					) {
						setStockConflictData({
							itemName: order.item_name,
							variantName: order.item_variant_name,
							requestedQuantity: order.item_quantity,
							availableStock: effectiveStocks ?? 0,
							targetStatus: changeToStatus,
							unitOfMeasure: order.item_sold_by,
						});
						onOpenStockModal();
						return;
					}
				}
			}

			const { error } = await changeOrderStatus(orderId, changeToStatus);

			if (error) {
				throw error;
			}

			if (order) {
				// Deduct stock when completed
				if (
					changeToStatus === "Completed" &&
					currentStatus !== "Completed"
				) {
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
				// Restore stock when moving away from completed
				else if (
					changeToStatus !== "Completed" &&
					currentStatus === "Completed"
				) {
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
			}

			addToast({
				title: `Order updated to ${changeToStatus}`,
				description: "The order status has been successfully updated.",
				timeout: 4000,
				shouldShowTimeoutProgress: true,
				severity: "success",
				color: "success",
			});
			setOrders((prev) => {
				if (!prev) return prev;
				return prev.map((order) =>
					order.order_id === orderId
						? { ...order, status: changeToStatus }
						: order,
				);
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

	if (loading) {
		return (
			<div>
				{/* --- MOBILE SKELETON --- */}
				<div className="sm:hidden">
					<Table className="w-full">
						<TableHeader>
							<TableColumn>CUSTOMER & ORDER ID</TableColumn>
							<TableColumn>ORDER INFO</TableColumn>
							<TableColumn>ACTIONS</TableColumn>
						</TableHeader>
						<TableBody>
							{Array.from({ length: 5 }).map((_, i) => (
								<TableRow key={i}>
									<TableCell>
										<div className="flex flex-col gap-2">
											<Skeleton className="h-4 w-40 rounded-md" />
											<Skeleton className="h-3 w-28 rounded-md" />
											<Skeleton className="h-3 w-24 rounded-md" />
										</div>
									</TableCell>
									<TableCell>
										<div className="flex flex-col gap-2">
											<Skeleton className="h-3 w-20 rounded-md" />
											<Skeleton className="h-4 w-24 rounded-md" />
											<Skeleton className="h-3 w-28 rounded-md" />
										</div>
									</TableCell>
									<TableCell>
										<Skeleton className="h-8 w-8 rounded-md" />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

				{/* --- DESKTOP SKELETON --- */}
				<div className="sm:flex hidden">
					<Table className="w-full">
						<TableHeader>
							<TableColumn>CUSTOMER</TableColumn>
							<TableColumn>DATE & ORDER ID</TableColumn>
							<TableColumn>ITEM</TableColumn>
							<TableColumn>QUANTITY</TableColumn>
							<TableColumn>SUBTOTAL</TableColumn>
							<TableColumn>STATUS</TableColumn>
							<TableColumn>ACTIONS</TableColumn>
						</TableHeader>
						<TableBody>
							{Array.from({ length: 6 }).map((_, i) => (
								<TableRow key={i}>
									{/* CUSTOMER CELL */}
									<TableCell>
										<div className="flex items-center gap-2">
											<Skeleton className="h-10 w-10 rounded-full" />
											<div className="flex flex-col gap-2">
												<Skeleton className="h-4 w-40 rounded-md" />
												<Skeleton className="h-3 w-24 rounded-md" />
											</div>
										</div>
									</TableCell>

									{/* DATE CELL */}
									<TableCell>
										<Skeleton className="h-4 w-24 rounded-md" />
									</TableCell>

									{/* ITEM CELL */}
									<TableCell>
										<Skeleton className="h-4 w-24 rounded-md" />
									</TableCell>

									{/* QUANTITY CELL */}
									<TableCell>
										<Skeleton className="h-4 w-24 rounded-md" />
									</TableCell>

									{/* SUBTOTAL CELL */}
									<TableCell>
										<Skeleton className="h-4 w-24 rounded-md" />
									</TableCell>

									{/* STATUS CELL */}
									<TableCell>
										<Skeleton className="h-4 w-24 rounded-md" />
									</TableCell>

									{/* ACTIONS CELL */}
									<TableCell>
										<Skeleton className="h-8 w-8 rounded-md" />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col">
			<OrderTableMobile
				orders={orders || []}
				handleOrder={handleOrder}
				onOpenCancelModal={onOpenCancelModal}
			/>
			<OrderTableDesktop
				orders={orders || []}
				handleOrder={handleOrder}
				onOpenCancelModal={onOpenCancelModal}
			/>
			<OrderCancelModal
				isOpenCancelModal={isOpenCancelModal}
				onOpenChangeCancelModal={onOpenChangeCancelModal}
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
