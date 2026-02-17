import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Skeleton,
} from "@heroui/react";

import { OrderTableMobile } from "@/pages/Admin/OrdersComponent/OrderTableResponsive/OrderTableMobile";
import { OrderTableDesktop } from "@/pages/Admin/OrdersComponent/OrderTableResponsive/OrderTableDesktop";
import { OrderTableRow } from "@/model/ui/Admin/order_table_row";
// import { useState } from "react";
// import { useDisclosure, addToast } from "@heroui/react";
// import { softDeleteItem } from "@/data/supabase/Admin/Products/softDeleteItem";
// import { SoftDeleteConfirmationModal } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/SoftDeleteConfirmationModal";

export function OrderTable({
	orders,
	loading,
	refetch,
}: {
	orders: OrderTableRow[] | null;
	loading: boolean;
	refetch: () => Promise<void>;
}) {
	console.log(refetch);
	// const {
	// 	isOpen: isOpenDeleteConfirm,
	// 	onOpen: onOpenDeleteConfirm,
	// 	onOpenChange: onOpenChangeDeleteConfirm,
	// } = useDisclosure();
	// const [selectedDeleteItem, setSelectedDeleteItem] = useState<{
	// 	id: string;
	// 	name: string;
	// } | null>(null);
	// const [isDeleteLoading, setIsDeleteLoading] = useState(false);

	// const onConfirmDeleteItem = async () => {
	// 	if (!selectedDeleteItem?.id) return;
	// 	setIsDeleteLoading(true);
	// 	const result = await softDeleteItem(selectedDeleteItem.id);
	// 	if (result.success) {
	// 		addToast({
	// 			title: "Success",
	// 			description: "Item deleted successfully.",
	// 			timeout: 3000,
	// 			color: "success",
	// 			shouldShowTimeoutProgress: true,
	// 		});
	// 		refetch();
	// 		onOpenChangeDeleteConfirm();
	// 	} else {
	// 		addToast({
	// 			title: "Error",
	// 			description: result.error || "Failed to delete item.",
	// 			timeout: 3000,
	// 			color: "danger",
	// 			shouldShowTimeoutProgress: true,
	// 		});
	// 	}
	// 	setIsDeleteLoading(false);
	// };

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
			<OrderTableMobile orders={orders || []} />
			<OrderTableDesktop orders={orders || []} />
			{/* 
			<SoftDeleteConfirmationModal
				isLoading={isDeleteLoading}
				isOpen={isOpenDeleteConfirm}
				name={selectedDeleteItem?.name || "this item"}
				title="Delete Item"
				type="Item"
				onConfirm={onConfirmDeleteItem}
				onOpenChange={onOpenChangeDeleteConfirm}
			/> */}
		</div>
	);
}
