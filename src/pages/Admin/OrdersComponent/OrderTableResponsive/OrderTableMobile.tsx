import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
	DropdownSection,
	useDisclosure,
	Pagination,
} from "@heroui/react";
import { useState } from "react";
import { CheckIcon, EyeIcon, MoreIconVertical } from "@/components/icons";
import { OrderTableRow } from "@/model/ui/Admin/order_table_row";
import { OrderCancelReasonModal } from "@/pages/General/Orders/OrderCancelReasonModal";
export function OrderTableMobile({
	orders,
	handleOrder,
	onOpenCancelModal,
	page,
	totalPages,
	onChangePage,
}: {
	orders: OrderTableRow[];
	handleOrder: (
		orderId: string,
		changeToStatus: "Pending" | "Ready" | "Completed" | "Cancelled",
		currentStatus: "Pending" | "Ready" | "Completed" | "Cancelled",
		cancelReason?: string,
	) => Promise<void>;
	onOpenCancelModal: (
		orderId: string,
		currentStatus: "Pending" | "Ready" | "Completed" | "Cancelled",
	) => void;
	page: number;
	totalPages: number;
	onChangePage: (page: number) => void;
}) {
	const [cancelReason, setCancelReason] = useState<string | null>(null);
	const {
		isOpen: isOpenReason,
		onOpen: onOpenReason,
		onOpenChange: onOpenChangeReason,
	} = useDisclosure();
	return (
		<div className="sm:hidden flex-1 min-h-0 flex flex-col">
			<Table
				isHeaderSticky
				className="overflow-y-auto h-full w-full"
				bottomContent={
					totalPages > 1 && (
						<div className="flex w-full justify-center">
							<Pagination
								isCompact
								showControls
								showShadow
								color="success"
								page={page}
								total={totalPages}
								onChange={onChangePage}
							/>
						</div>
					)
				}
			>
				<TableHeader>
					<TableColumn>CUSTOMER & ORDER ID</TableColumn>
					<TableColumn>ORDER INFO</TableColumn>
					<TableColumn>ACTIONS</TableColumn>
				</TableHeader>

				<TableBody emptyContent={"No orders found."}>
					{orders.map((order) => (
						<TableRow key={order.order_id}>
							<TableCell>
								<div className="flex flex-row items-center gap-2">
									<div className="flex flex-col gap-1 items-start">
										<span className="text-sm font-bold">
											{order.user_name}
										</span>
										<span className="text-default-500 italic text-xs">
											{order.user_role}
										</span>
										<span className="text-sm text-default-500">
											{order.order_identifier}
										</span>
									</div>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-row gap-2 items-center">
									<div className="flex flex-col items-start">
										<span className="font-bold">
											{order.item_variant_name}
										</span>
										<span className="font-light italic text-xs text-default-500">
											{order.item_name}
										</span>
										<span className="font-bold">
											{order.item_quantity}{" "}
											{order.item_sold_by} - ₱
											{order.subtotal.toFixed(2)}
										</span>
										<span className="text-default-500 text-xs italic">
											{new Date(order.date_ordered)
												.toLocaleString("en-US", {
													month: "2-digit",
													day: "2-digit",
													year: "2-digit",
													hour: "2-digit",
													minute: "2-digit",
													hour12: true,
												})
												.replace(",", " @")}
										</span>
										<span className="text-default-500 italic text-xs">
											{order.price_variant}
										</span>
										<div className="flex flex-row items-center gap-1">
											<span
												className={`w-2 h-2 rounded-full ${
													order.status === "Pending"
														? "bg-yellow-400"
														: order.status ===
															  "Ready"
															? "bg-blue-400"
															: order.status ===
																  "Completed"
																? "bg-green-400"
																: order.status ===
																	  "Cancelled"
																	? "bg-red-400"
																	: "bg-gray-400"
												}`}
											/>
											<span className="text-default-500 italic text-xs">
												{order.status}
											</span>
										</div>
									</div>
								</div>
							</TableCell>
							<TableCell>
								{order.status !== "Cancelled" &&
									order.status !== "Completed" && (
										<Dropdown>
											<DropdownTrigger>
												<Button
													size="sm"
													variant="light"
													startContent={
														<MoreIconVertical className="w-5" />
													}
													isIconOnly
												/>
											</DropdownTrigger>
											<DropdownMenu
												disabledKeys={[order.status]}
											>
												<DropdownSection title="Set Status">
													<DropdownItem
														key="Pending"
														onPress={() =>
															handleOrder(
																order.order_id,
																"Pending",
																order.status,
															)
														}
													>
														<div className="flex items-center gap-2">
															<span className="w-2 h-2 rounded-full bg-yellow-400" />
															<span>Pending</span>
														</div>
													</DropdownItem>

													<DropdownItem
														key="Ready"
														onPress={() =>
															handleOrder(
																order.order_id,
																"Ready",
																order.status,
															)
														}
													>
														<div className="flex items-center gap-2">
															<span className="w-2 h-2 rounded-full bg-blue-400" />
															<span>Ready</span>
														</div>
													</DropdownItem>

													<DropdownItem
														key="Completed"
														onPress={() =>
															handleOrder(
																order.order_id,
																"Completed",
																order.status,
															)
														}
													>
														<div className="flex items-center gap-2">
															<span className="w-2 h-2 rounded-full bg-green-400" />
															<span>
																Completed
															</span>
														</div>
													</DropdownItem>

													<DropdownItem
														key="Cancelled"
														onPress={() =>
															onOpenCancelModal(
																order.order_id,
																order.status,
															)
														}
													>
														<div className="flex items-center gap-2">
															<span className="w-2 h-2 rounded-full bg-red-300" />
															<span className="text-danger">
																Cancelled
															</span>
														</div>
													</DropdownItem>
												</DropdownSection>
											</DropdownMenu>
										</Dropdown>
									)}
								{order.status === "Cancelled" && (
									<Button
										startContent={
											<EyeIcon className="w-5" />
										}
										isIconOnly
										variant="light"
										onPress={() => {
											setCancelReason(
												order.cancel_reason ?? "",
											);
											onOpenReason();
										}}
									/>
								)}
								{order.status === "Completed" && (
									<CheckIcon className="w-5 ml-2 text-default" />
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<OrderCancelReasonModal
				isOpenCancelReasonModal={isOpenReason}
				onOpenChangeCancelReasonModal={onOpenChangeReason}
				cancelReason={cancelReason ?? "No reason provided."}
			/>
		</div>
	);
}
