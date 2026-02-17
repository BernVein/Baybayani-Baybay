import { Card, CardBody, Link, useDisclosure, Skeleton } from "@heroui/react";
import {
	PencilIcon,
	ProductIcon,
	ProductIconWithArrowDown,
	ProductIconWithX,
} from "@/components/icons";
import { ManageCatTagModal } from "@/pages/Admin/ProductsComponent/ManageCatTagModal";
import { ItemTableRow } from "@/model/ui/Admin/item_table_row";
import { fetchProductStats } from "@/data/supabase/Admin/Products/fetchProductStats";

export function ProductSummary({
	items,
	isLoading,
}: {
	items: ItemTableRow[];
	isLoading: boolean;
}) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const {
		lastItemDate,
		lowStockCount,
		loading: isStatLoading,
	} = fetchProductStats();
	const totalItems = items.length;
	const totalInventory = items.reduce(
		(sum, item) => sum + (item.variant_stock ?? 0),
		0,
	);
	const totalCategories = new Set(
		items.map((item) => item.item_category_id).filter(Boolean),
	).size;

	return (
		<>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
				<Card className="w-full">
					<CardBody className="gap-y-3">
						<span className="text-default-500">TOTAL ITEMS</span>
						<div className="flex flex-col item-center">
							<div className="flex flex-row items-center justify-between">
								<div className="flex flex-row items-center">
									<Skeleton
										isLoaded={!isLoading}
										className="rounded-lg"
									>
										<span className="text-3xl font-bold">
											{totalItems}
										</span>
									</Skeleton>
								</div>

								<div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500/70">
									<ProductIcon className="w-6 h-6 text-white" />
								</div>
							</div>
							<Skeleton
								isLoaded={!isStatLoading}
								className="rounded-lg w-3/5"
							>
								<span className="text-default-500">
									{lowStockCount != null
										? `${lowStockCount} variants low in stock`
										: "No low-stock variants"}
								</span>
							</Skeleton>
						</div>
					</CardBody>
					<div className="absolute bottom-0 left-0 w-full h-1 bg-green-500/70 rounded-t-md" />
				</Card>
				<Card className="w-full">
					<CardBody className="gap-y-3">
						<span className="text-default-500">
							TOTAL INVENTORY QUANTITY
						</span>
						<div className="flex flex-col item-center">
							<div className="flex flex-row items-center justify-between">
								<div className="flex flex-row items-center gap-2">
									<Skeleton
										isLoaded={!isLoading}
										className="rounded-lg"
									>
										<span className="text-3xl font-bold">
											{totalInventory}
										</span>
									</Skeleton>
								</div>

								<div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500/70">
									<ProductIconWithArrowDown className="w-6 h-6 text-white" />
								</div>
							</div>
							<Skeleton
								className="rounded-lg w-3/5"
								isLoaded={!isStatLoading}
							>
								<span className="text-default-500">
									{lastItemDate
										? `last item added on ${new Date(lastItemDate).toLocaleDateString()}`
										: "no items yet"}
								</span>
							</Skeleton>
						</div>
					</CardBody>
					<div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500/70 rounded-t-md" />
				</Card>
				<Card className="w-full">
					<CardBody className="gap-y-3">
						<span className="text-default-500">
							ITEM CATEGORIES
						</span>
						<div className="flex flex-col item-center">
							<div className="flex flex-row items-center justify-between">
								<div className="flex flex-row items-center gap-2">
									<Skeleton
										isLoaded={!isLoading}
										className="rounded-lg"
									>
										<span className="text-3xl font-bold">
											{totalCategories}
										</span>
									</Skeleton>
								</div>

								<div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/70">
									<ProductIconWithX className="w-6 h-6 text-white" />
								</div>
							</div>
							<Skeleton
								className="rounded-lg w-3/5"
								isLoaded={!isLoading}
							>
								<div className="flex flex-row gap-1 items-start cursor-pointer">
									<Link
										isBlock
										color="foreground"
										onPress={onOpen}
									>
										<PencilIcon className="w-5 text-default-500" />
										<span className="text-default-500 italic">
											manage categories and tags
										</span>
									</Link>
								</div>
							</Skeleton>
						</div>
					</CardBody>
					<div className="absolute bottom-0 left-0 w-full h-1 bg-red-500/70 rounded-t-md" />
				</Card>
			</div>
			<ManageCatTagModal isOpen={isOpen} onOpenChange={onOpenChange} />
		</>
	);
}
