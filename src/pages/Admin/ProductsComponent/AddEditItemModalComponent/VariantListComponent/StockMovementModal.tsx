import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Skeleton,
	Chip,
	Pagination,
} from "@heroui/react";
import { useFetchStockMovements } from "@/data/supabase/Admin/Products/useFetchStockMovements";
import { Info } from "lucide-react";

interface StockMovementModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
	variantId?: string;
	variantName?: string;
	itemUnit?: string;
}

export function StockMovementModal({
	isOpen,
	onOpenChange,
	variantId,
	variantName,
	itemUnit = "item",
}: StockMovementModalProps) {
	const { movements, isLoading, totalCount, page, setPage, pageSize } =
		useFetchStockMovements(variantId, 1);

	const columns = [
		{ key: "date", label: "DATE" },
		{ key: "type", label: "TYPE" },
		{ key: "change", label: "GAIN/LOSS" },
		{ key: "amount", label: "AMOUNT" },
		{ key: "reason", label: "REASON / SUPPLIER" },
		{ key: "stocks", label: `STOCKS (${itemUnit})` },
	];

	const totalPages = Math.ceil(totalCount / pageSize);

	const renderCell = (movement: any, columnKey: React.Key) => {
		const type = movement.stock_adjustment_type;
		const isLoss = type === "Loss";

		switch (columnKey) {
			case "date": {
				const dateStr =
					type === "Acquisition"
						? movement.stock_delivery_date
						: movement.stock_change_date;
				if (!dateStr) return "N/A";
				return new Date(dateStr).toLocaleDateString("en-US", {
					month: "short",
					day: "2-digit",
					year: "numeric",
				});
			}
			case "type":
				return (
					<Chip
						variant="flat"
						size="sm"
						color={
							type === "Acquisition"
								? "success"
								: type === "Sale"
									? "primary"
									: type === "Loss"
										? "danger"
										: "warning"
						}
					>
						{type || "Unknown"}
					</Chip>
				);
			case "change":
				return (
					<span
						className={`font-medium ${isLoss ? "text-danger" : ""}`}
					>
						{isLoss ? "-" : ""}
						{movement.stock_change_count || 0} {itemUnit}
						{movement.stock_change_count !== 1 ? "s" : ""}
					</span>
				);
			case "amount": {
				const amount =
					movement.stock_adjustment_amount ?? movement.sale_amount;
				if (amount == null) return "N/A";
				return (
					<span
						className={`font-medium ${isLoss ? "text-danger" : ""}`}
					>
						{isLoss ? "- " : ""}₱
						{amount.toLocaleString("en-PH", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</span>
				);
			}
			case "reason":
				if (type === "Acquisition")
					return movement.stock_supplier || "N/A";
				if (type === "Loss") return movement.stock_loss_reason || "N/A";
				if (type === "Sale") return "Customer Sale";
				if (type === "From Cancelled") return "Order Cancelled";
				return "N/A";
			case "stocks":
				return (
					<span className="font-semibold">
						{movement.effective_stocks?.toLocaleString() || "0"}
					</span>
				);
			default:
				return movement[columnKey as string];
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			size="4xl"
			disableAnimation
			scrollBehavior="inside"
			backdrop="blur"
		>
			<ModalContent>
				<ModalHeader className="flex gap-2 items-center">
					<Info className="w-5 h-5 text-primary" />
					<div className="flex flex-col">
						<span>Stock Movement History</span>
						<span className="text-tiny text-default-400 font-normal">
							{variantName || "Selected Variant"}
						</span>
					</div>
				</ModalHeader>
				<ModalBody className="pb-6">
					<Table
						aria-label="Stock movement history table"
						removeWrapper
						className="min-w-full"
						bottomContent={
							totalPages > 1 ? (
								<div className="flex w-full justify-center">
									<Pagination
										isCompact
										showControls
										showShadow
										color="success"
										page={page}
										total={totalPages}
										onChange={(page) => setPage(page)}
									/>
								</div>
							) : null
						}
					>
						<TableHeader columns={columns}>
							{(column) => (
								<TableColumn
									key={column.key}
									align={
										column.key === "stocks" ||
										column.key === "amount"
											? "end"
											: "start"
									}
								>
									{column.label}
								</TableColumn>
							)}
						</TableHeader>
						<TableBody
							items={
								isLoading
									? ([...Array(pageSize)].map((_, i) => ({
											stock_movement_id: `skeleton-${i}`,
										})) as any)
									: movements
							}
							emptyContent={
								!isLoading && "No stock movements found."
							}
						>
							{(item: any) => (
								<TableRow key={item.stock_movement_id}>
									{(columnKey) => (
										<TableCell>
											{isLoading ? (
												columnKey === "type" ? (
													<Skeleton className="h-6 w-16 rounded-full" />
												) : (
													<Skeleton className="h-3 w-full rounded-lg" />
												)
											) : (
												renderCell(item, columnKey)
											)}
										</TableCell>
									)}
								</TableRow>
							)}
						</TableBody>
					</Table>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
