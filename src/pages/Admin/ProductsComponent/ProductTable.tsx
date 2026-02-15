import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Skeleton,
} from "@heroui/react";

import { ProductTableMobile } from "@/pages/Admin/ProductsComponent/ProductTableComponent/ProductTableResponsive/ProductTableMobile";
import { ProductTableDesktop } from "@/pages/Admin/ProductsComponent/ProductTableComponent/ProductTableResponsive/ProductTableDesktop";
import { ItemTableRow } from "@/model/ui/Admin/item_table_row";
import { useState } from "react";
import { useDisclosure, addToast } from "@heroui/react";
import { softDeleteItem } from "@/data/supabase/Admin/Products/softDeleteItem";
import { SoftDeleteConfirmationModal } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/SoftDeleteConfirmationModal";

export function ProductTable({
	items,
	loading,
	refetch,
}: {
	items: ItemTableRow[];
	loading: boolean;
	refetch: () => Promise<void>;
}) {
	const {
		isOpen: isOpenDeleteConfirm,
		onOpen: onOpenDeleteConfirm,
		onOpenChange: onOpenChangeDeleteConfirm,
	} = useDisclosure();
	const [selectedDeleteItem, setSelectedDeleteItem] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [isDeleteLoading, setIsDeleteLoading] = useState(false);

	const onConfirmDeleteItem = async () => {
		if (!selectedDeleteItem?.id) return;
		setIsDeleteLoading(true);
		const result = await softDeleteItem(selectedDeleteItem.id);
		if (result.success) {
			addToast({
				title: "Success",
				description: "Item deleted successfully.",
				timeout: 3000,
				color: "success",
				shouldShowTimeoutProgress: true,
			});
			refetch();
			onOpenChangeDeleteConfirm();
		} else {
			addToast({
				title: "Error",
				description: result.error || "Failed to delete item.",
				timeout: 3000,
				color: "danger",
				shouldShowTimeoutProgress: true,
			});
		}
		setIsDeleteLoading(false);
	};

	if (loading && items.length === 0) {
		return (
			<div>
				{/* --- MOBILE SKELETON --- */}
				<div className="sm:hidden">
					<Table className="w-full">
						<TableHeader>
							<TableColumn>ITEM</TableColumn>
							<TableColumn>PRICE & STOCK</TableColumn>
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
							<TableColumn>ITEM</TableColumn>
							<TableColumn>PRICE</TableColumn>
							<TableColumn>TOTAL STOCK</TableColumn>
							<TableColumn>CATEGORY</TableColumn>
							<TableColumn>TAG</TableColumn>
							<TableColumn>ACTIONS</TableColumn>
						</TableHeader>
						<TableBody>
							{Array.from({ length: 6 }).map((_, i) => (
								<TableRow key={i}>
									{/* ITEM CELL */}
									<TableCell>
										<div className="flex items-center gap-2">
											<Skeleton className="h-10 w-10 rounded-full" />
											<div className="flex flex-col gap-2">
												<Skeleton className="h-4 w-40 rounded-md" />
												<Skeleton className="h-3 w-24 rounded-md" />
											</div>
										</div>
									</TableCell>

									{/* PRICE CELL */}
									<TableCell>
										<Skeleton className="h-4 w-24 rounded-md" />
									</TableCell>

									{/* TOTAL STOCK CELL */}
									<TableCell>
										<Skeleton className="h-4 w-24 rounded-md" />
									</TableCell>

									{/* CATEGORY CELL */}
									<TableCell>
										<Skeleton className="h-4 w-24 rounded-md" />
									</TableCell>

									{/* TAG CELL */}
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
			<ProductTableMobile
				items={items}
				onOpenDeleteConfirm={onOpenDeleteConfirm}
				setSelectedDeleteItem={setSelectedDeleteItem}
			/>
			<ProductTableDesktop
				items={items}
				onOpenDeleteConfirm={onOpenDeleteConfirm}
				setSelectedDeleteItem={setSelectedDeleteItem}
			/>
			<SoftDeleteConfirmationModal
				isLoading={isDeleteLoading}
				isOpen={isOpenDeleteConfirm}
				name={selectedDeleteItem?.name || "this item"}
				title="Delete Item"
				type="Item"
				onConfirm={onConfirmDeleteItem}
				onOpenChange={onOpenChangeDeleteConfirm}
			/>
		</div>
	);
}
