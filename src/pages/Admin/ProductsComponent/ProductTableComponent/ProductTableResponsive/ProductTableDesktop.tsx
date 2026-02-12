import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Avatar,
	Button,
	Chip,
	useDisclosure,
} from "@heroui/react";
import { useState } from "react";

import { TrashIcon, PencilIcon } from "@/components/icons";
import { DeleteItemModal } from "@/pages/Admin/ProductsComponent/ProductTableComponent/DeleteItemModal";
import { ItemTableRow } from "@/model/ui/Admin/item_table_row";
import { AddEditItemModal } from "@/pages/Admin/ProductsComponent/AddEditItemModal";
export function ProductTableDesktop({ items }: { items: ItemTableRow[] }) {
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
	const [itemHasVariant, setItemHasVariant] = useState<boolean>(false);
	const {
		isOpen: isOpenEditItem,
		onOpen: onOpenEditItem,
		onOpenChange: onOpenChangeEditItem,
	} = useDisclosure();
	const {
		isOpen: isOpenDeleteItem,
		onOpen: onOpenDeleteItem,
		onOpenChange: onOpenChangeDeleteItem,
	} = useDisclosure();

	return (
		<div className="sm:flex hidden flex-1 min-h-0 flex-col">
			<Table isHeaderSticky className="overflow-y-auto h-full w-full">
				<TableHeader>
					<TableColumn>ITEM</TableColumn>
					<TableColumn>PRICE</TableColumn>
					<TableColumn>TOTAL STOCK</TableColumn>
					<TableColumn>CATEGORY</TableColumn>
					<TableColumn>TAG</TableColumn>
					<TableColumn>ACTIONS</TableColumn>
				</TableHeader>

				<TableBody emptyContent={"No items found."}>
					{items.map((item, i) => (
						<TableRow key={i + 1}>
							<TableCell>
								<div className="flex flex-row items-center gap-2">
									<Avatar size="md" src={item.item_img_url} />
									<div className="flex flex-col items-start">
										<span className="text-base font-bold">
											{item.item_name}
										</span>
										<span className="text-sm italic text-default-500">
											{item.item_variant_count > 1
												? `${item.item_variant_count} variants`
												: "No variant"}
										</span>
									</div>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-row gap-2 items-center">
									<div className="flex flex-col items-start">
										<span className="font-light italic text-xs text-default-500">
											Starts from
										</span>
										<span className="text-base font-bold">
											₱
											{Number(
												item.item_min_price,
											).toLocaleString("en-US", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}{" "}
											per {item.item_sold_by}
										</span>
									</div>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-col items-start">
									<span className="text-base font-bold">
										{item.variant_stock.toLocaleString()}{" "}
										{item.item_sold_by}s left
									</span>

									{item.item_variant_count > 1 && (
										<span className="text-sm italic text-default-500">
											on {item.item_variant_count}{" "}
											variants
										</span>
									)}
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-col items-start">
									<span className="text-base font-bold">
										{item.item_category}
									</span>
								</div>
							</TableCell>
							<TableCell>
								{item.item_tag ? (
									<Chip variant="flat">{item.item_tag}</Chip>
								) : (
									<span className="text-sm italic text-default-500">
										No tag
									</span>
								)}
							</TableCell>

							<TableCell>
								<div className="flex flex-row items-center gap-1">
									<Button
										isIconOnly
										size="sm"
										variant="light"
										onPress={() => {
											setItemHasVariant(
												item.item_variant_count > 1,
											);
											setSelectedItemId(item.item_id);
											onOpenEditItem();
										}}
									>
										<PencilIcon className="w-5" />
									</Button>

									<Button
										isIconOnly
										size="sm"
										variant="light"
										onPress={onOpenDeleteItem}
									>
										<TrashIcon className="w-5 text-danger-300" />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<AddEditItemModal
				isOpen={isOpenEditItem}
				itemHasVariant={itemHasVariant}
				selectedItemId={selectedItemId}
				onOpenChange={onOpenChangeEditItem}
			/>

			<DeleteItemModal
				isOpenDeleteItem={isOpenDeleteItem}
				onOpenChangeDeleteItem={onOpenChangeDeleteItem}
			/>
		</div>
	);
}
