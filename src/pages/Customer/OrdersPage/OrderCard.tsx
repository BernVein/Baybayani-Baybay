import {
	Card,
	CardBody,
	Chip,
	Divider,
	Image,
	Button,
} from "@heroui/react";
import { Order } from "./types";

interface OrderCardProps {
	order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
	// Status color mapping
	const statusColorMap: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "danger"> = {
		Pending: "warning",
		Processing: "primary",
		Shipped: "secondary",
		Delivered: "success",
		Cancelled: "danger",
	};

	const mainItem = order.items[0];
	const otherItemsCount = order.items.length - 1;

	return (
		<div className="relative w-full">
			<Card className="w-full shadow-sm border border-default-200 bg-content1">
				<CardBody className="flex flex-col sm:flex-row gap-4 p-4">
					{/* Image Section */}
					<div className="relative w-full sm:w-[150px] aspect-square sm:aspect-auto shrink-0 overflow-hidden rounded-lg bg-default-100">
						{mainItem ? (
							<Image
								alt={mainItem.item_name}
								src={mainItem.image_url}
								removeWrapper
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center text-default-400">
								No Image
							</div>
						)}
						{otherItemsCount > 0 && (
							<div className="absolute bottom-0 right-0 bg-black/50 text-white text-xs px-2 py-1 rounded-tl-lg">
								+{otherItemsCount} more
							</div>
						)}
					</div>

					{/* Content Section */}
					<div className="flex flex-col flex-1 gap-2">
						{/* Header: ID and Date */}
						<div className="flex flex-row justify-between items-start">
							<div>
								<h3 className="text-small font-semibold text-default-900">
									Order #{order.order_id}
								</h3>
								<p className="text-tiny text-default-500">
									Placed on {new Date(order.created_at).toLocaleDateString()}
								</p>
							</div>
							<Chip
								color={statusColorMap[order.status] || "default"}
								size="sm"
								variant="flat"
							>
								{order.status}
							</Chip>
						</div>

						<Divider className="my-2" />

						{/* Order Details */}
						<div className="flex flex-col gap-1">
							{order.items.map((item, index) => (
								<div key={index} className="flex justify-between text-small">
									<span className="text-default-600 truncate max-w-[200px]">
										{item.quantity}x {item.item_name} <span className="text-default-400">({item.variant_name})</span>
									</span>
									<span className="text-default-500">
										₱{(item.price * item.quantity).toLocaleString()}
									</span>
								</div>
							))}
						</div>

						<div className="flex-1" />

						<Divider className="my-2" />

						{/* Footer: Total and Actions */}
						<div className="flex flex-row justify-between items-center mt-auto">
							<div className="flex flex-col">
								<span className="text-tiny text-default-500">Total Amount</span>
								<span className="text-medium font-bold text-success-600">
									₱{order.total_price.toLocaleString()}
								</span>
							</div>
							<Button
								size="sm"
								color="primary"
								variant="solid"
								className="font-medium"
								// onClick={() => navigate to details}
							>
								View Details
							</Button>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
