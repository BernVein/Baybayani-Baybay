import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Divider,
	Image,
} from "@heroui/react";
import { AlertCircle, Store } from "lucide-react";
import { CancelledOrderWithDetails } from "@/data/supabase/Customer/Orders/useClosingCancellations";

interface Props {
	isOpen: boolean;
	cancelledOrders: CancelledOrderWithDetails[];
	onDismiss: () => void;
}

export function ClosingCancellationModal({
	isOpen,
	cancelledOrders,
	onDismiss,
}: Props) {
	if (cancelledOrders.length === 0) return null;

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onDismiss}
			backdrop="blur"
			isDismissable={false}
			isKeyboardDismissDisabled={true}
			disableAnimation
			hideCloseButton={true}
			className="max-w-md mx-4"
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1 items-center pt-8">
					<div className="p-3 bg-danger-50 rounded-full mb-2">
						<Store className="w-8 h-8 text-danger" />
					</div>
					<h2 className="text-xl font-bold text-center">
						Orders Cancelled
					</h2>
					<p className="text-sm font-normal text-default-500 text-center px-4">
						The store has reached its closing time.
					</p>
				</ModalHeader>
				<ModalBody className="pb-8 pt-4 px-6">
					<div className="flex flex-col gap-4">
						<div className="p-4 bg-default-50 rounded-2xl border border-default-200">
							<div className="flex gap-3 items-start mb-4">
								<AlertCircle className="w-5 h-5 text-danger mt-0.5 shrink-0" />
								<p className="text-sm text-default-700 leading-relaxed font-medium">
									The following items were automatically
									cancelled because the store is now closed:
								</p>
							</div>

							<Divider className="my-3 opacity-50" />

							<div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
								{cancelledOrders.map(
									({ order, notification }, index) => {
										if (!order) {
											// Fallback if order details failed to fetch
											const itemName =
												notification.body.match(
													/your order (.*?) has/,
												)?.[1] || "Ordered Item";
											return (
												<div
													key={
														notification.notification_id ||
														index
													}
													className="flex justify-between items-center py-3 px-4 rounded-xl border border-default-100 shadow-sm"
												>
													<span className="text-sm font-semibold text-default-900 truncate flex-1 pr-4">
														{itemName}
													</span>
													<span className="text-xs font-bold px-2 py-1 bg-danger-50 text-danger rounded-lg">
														Cancelled
													</span>
												</div>
											);
										}

										return (
											<div
												key={order.order_item_user_id}
												className="flex gap-3 p-3 rounded-xl border border-default-100 shadow-sm transition-all hover:border-default-200"
											>
												<div className="w-16 h-16 rounded-lg overflow-hidden bg-default-100 shrink-0">
													{order.item_first_image ? (
														<Image
															src={
																order.item_first_image
															}
															alt={
																order.item_name
															}
															className="w-full h-full object-cover"
														/>
													) : (
														<div className="w-full h-full flex items-center justify-center bg-default-200">
															<Store className="w-6 h-6 text-default-400" />
														</div>
													)}
												</div>
												<div className="flex-1 flex flex-col justify-between min-w-0">
													<div className="flex justify-between items-start gap-2">
														<div className="flex flex-col min-w-0">
															<span className="text-sm font-bold text-default-900 truncate">
																{
																	order.variant_name
																}
															</span>
														</div>
														<span className="text-xs font-bold px-2 py-1 bg-danger-50 text-danger rounded-lg shrink-0">
															Cancelled
														</span>
													</div>
													<div className="flex justify-between items-end mt-1">
														<span className="text-xs text-default-400">
															Qty:{" "}
															{order.quantity}{" "}
															{order.item_sold_by}
														</span>
														<span className="text-sm font-bold text-default-900">
															₱
															{order.subtotal.toLocaleString(
																"en-PH",
																{
																	minimumFractionDigits: 2,
																	maximumFractionDigits: 2,
																},
															)}
														</span>
													</div>
												</div>
											</div>
										);
									},
								)}
							</div>
						</div>

						<p className="text-sm text-default-400 text-center italic font-medium">
							Sorry for the inconvenience.
						</p>
					</div>
				</ModalBody>
				<ModalFooter className="pb-8 pt-0 px-6 flex justify-center">
					<Button
						color="success"
						onPress={onDismiss}
						className="w-full font-bold shadow-lg shadow-success/20 rounded-xl"
					>
						Understood
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
