import {
	Card,
	CardBody,
	Image,
	Divider,
	Chip,
	Progress,
	Link,
	useDisclosure,
	addToast,
} from "@heroui/react";
import { OrderCard } from "@/model/ui/Customer/order_card";
import { OrderCancelModal } from "@/pages/General/Orders/OrderCancelModal";
import { changeOrderStatus } from "@/data/supabase/Admin/Orders/changeOrderStatus";

import { Dispatch, SetStateAction } from "react";
import { OrderCancelReasonModal } from "@/pages/General/Orders/OrderCancelReasonModal";

export default function OrderItem({
	orderItem,
	setOrderItems,
}: {
	orderItem: OrderCard;
	setOrderItems: Dispatch<SetStateAction<OrderCard[]>>;
}) {
	const {
		isOpen: isOpenCancelOrder,
		onOpen: onOpenCancelOrder,
		onOpenChange: onOpenChangeCancelOrder,
	} = useDisclosure();
	const {
		isOpen: isOpenReason,
		onOpen: onOpenReason,
		onOpenChange: onOpenChangeReason,
	} = useDisclosure();

	const handleConfirm = async (reason: string) => {
		try {
			const { success, error } = await changeOrderStatus(
				orderItem.order_item_user_id,
				"Cancelled",
				reason,
			);
			if (!success) throw new Error(error);

			addToast({
				title: "Order Cancelled",
				description: "Your order has been successfully cancelled.",
				color: "success",
			});

			setOrderItems((prev) =>
				prev.map((order) =>
					order.order_item_user_id === orderItem.order_item_user_id
						? { ...order, status: "Cancelled" }
						: order,
				),
			);
		} catch (err: any) {
			addToast({
				title: "Cancellation Failed",
				description: err?.message || "Failed to cancel order",
				color: "danger",
			});
		}
	};

	return (
		<div className="relative w-full rounded-lg">
			<Card className="inline-flex max-w-full w-full bg-content1 m-0 hover:bg-content2 items-center justify-start rounded-lg p-0 border-2 border-transparent">
				<CardBody className="flex flex-row gap-3 items-stretch">
					{/* Image column */}
					<div className="relative w-[100px] sm:w-[150px] shrink-0 self-stretch overflow-hidden rounded-sm">
						<Image
							removeWrapper
							alt={orderItem.variant_name}
							className="absolute inset-0 h-full w-full object-cover"
							src={orderItem.item_first_image}
						/>
						<Chip className="absolute top-2 left-2 z-10" size="sm">
							{orderItem.price_variant}
						</Chip>
					</div>

					{/* Content column */}
					<div className="flex flex-col justify-start items-start text-left flex-1">
						<div className="w-full flex justify-between items-start">
							<div className="flex flex-col gap-2">
								<div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-left">
									<span className="text-sm sm:text-base text-default-700">
										{orderItem.variant_name}
									</span>
									<span className="text-xs sm:text-sm text-default-500">
										{orderItem.item_name}
									</span>
								</div>
							</div>

							<div className="flex flex-col w-1/4 gap-2 items-end">
								<Chip
									color={
										orderItem.status === "Pending"
											? "warning"
											: orderItem.status === "Ready"
												? "primary"
												: orderItem.status ===
													  "Completed"
													? "success"
													: orderItem.status ===
														  "Cancelled"
														? "danger"
														: "default"
									}
									variant="flat"
								>
									{orderItem.status}
								</Chip>
								<Progress
									aria-label="Loading..."
									color={
										orderItem.status === "Pending"
											? "warning"
											: orderItem.status === "Ready"
												? "primary"
												: orderItem.status ===
													  "Completed"
													? "success"
													: orderItem.status ===
														  "Cancelled"
														? "danger"
														: "default"
									}
									value={
										orderItem.status === "Pending"
											? 25
											: orderItem.status === "Ready"
												? 50
												: orderItem.status ===
													  "Completed"
													? 100
													: orderItem.status ===
														  "Cancelled"
														? 0
														: 0
									}
								/>
							</div>
						</div>

						<Divider className="my-3 sm:my-2" />

						<div className="w-full flex flex-row justify-between items-center">
							<span className="text-xs text-default-500">
								Date Ordered
							</span>
							<span className="text-sm text-default-600">
								{new Date(
									orderItem.date_ordered,
								).toLocaleString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric",
									hour: "numeric",
									minute: "2-digit",
									hour12: true,
								})}
							</span>
						</div>

						<div className="w-full flex flex-row justify-between items-center">
							<span className="text-xs text-default-500">
								Quantity
							</span>
							<span className="text-sm text-default-600">
								{orderItem.quantity} {orderItem.item_sold_by}s
							</span>
						</div>

						<div className="w-full flex flex-row justify-between items-center">
							<span className="text-xs text-default-500">
								Subtotal
							</span>
							<span className="text-sm text-default-600">
								₱
								{orderItem.subtotal.toLocaleString("en-PH", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</span>
						</div>
						<Link
							color={
								orderItem.status === "Pending"
									? "danger"
									: orderItem.status === "Cancelled"
										? "foreground"
										: "success"
							}
							className={`self-end mt-2 text-sm ${orderItem.status === "Pending" || orderItem.status === "Cancelled" ? "text-danger cursor-pointer" : "text-default-500 italic font-light"}`}
							isDisabled={
								orderItem.status !== "Pending" &&
								orderItem.status !== "Cancelled"
							}
							onPress={() => {
								if (orderItem.status === "Pending") {
									onOpenCancelOrder();
								} else if (orderItem.status === "Cancelled") {
									onOpenReason();
								}
							}}
						>
							{orderItem.status === "Pending"
								? "Cancel Order"
								: orderItem.status === "Cancelled"
									? "View Cancel Reason"
									: "Order Confirmed"}
						</Link>
						<OrderCancelModal
							isOpenCancelModal={isOpenCancelOrder}
							onOpenChangeCancelModal={onOpenChangeCancelOrder}
							onConfirm={handleConfirm}
						/>
						<OrderCancelReasonModal
							isOpenCancelReasonModal={isOpenReason}
							onOpenChangeCancelReasonModal={onOpenChangeReason}
							cancelReason=""
						/>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
