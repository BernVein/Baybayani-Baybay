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
import { OrderTableRow } from "@/model/ui/Admin/order_table_row";
import { changeOrderStatus } from "@/data/supabase/Admin/Orders/changeOrderStatus";
export function OrderTable({
	orders,
	setOrders,
	loading,
	refetch,
}: {
	orders: OrderTableRow[] | null;
	setOrders: React.Dispatch<React.SetStateAction<OrderTableRow[] | null>>;
	loading: boolean;
	refetch: () => Promise<void>;
}) {
	console.log(refetch);

	const handleOrder = async (
		orderId: string,
		changeToStatus: "Pending" | "Ready" | "Completed" | "Cancel",
		currentStatus: "Pending" | "Ready" | "Completed" | "Cancel",
	) => {
		console.log(currentStatus);
		try {
			const { error } = await changeOrderStatus(orderId, changeToStatus);

			if (error) {
				throw error;
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
		}
	};

	if (loading) {
		return (
			<div>
				{/* --- MOBILE SKELETON --- */}
				<div className="sm:hidden">
					<Table className="w-full">
						<TableHeader>
							<TableColumn>CUSTOMER</TableColumn>
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
							<TableColumn>DATE</TableColumn>
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
			<OrderTableMobile orders={orders || []} handleOrder={handleOrder} />
			<OrderTableDesktop
				orders={orders || []}
				handleOrder={handleOrder}
			/>
		</div>
	);
}
