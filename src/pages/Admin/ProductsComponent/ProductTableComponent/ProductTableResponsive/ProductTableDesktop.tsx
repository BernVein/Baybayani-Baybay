import { TrashIcon, PencilIcon } from "@/components/icons";
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
import { EditItemModal } from "@/pages/Admin/ProductsComponent/ProductTableComponent/EditItemModal";
import { DeleteItemModal } from "@/pages/Admin/ProductsComponent/ProductTableComponent/DeleteItemModal";
import { ItemTableRow } from "@/model/ui/Admin/item_table_row";
export function ProductTableDesktop({ items }: { items: ItemTableRow[] }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const {
        isOpen: isOpenDeleteItem,
        onOpen: onOpenDeleteItem,
        onOpenChange: onOpenChangeDeleteItem,
    } = useDisclosure();
    console.log(items);
    return (
        <div className="sm:flex hidden">
            <Table
                isHeaderSticky
                className="overflow-y-auto h-[calc(100vh-350px)] w-full"
            >
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
                                    <Avatar src={item.item_img_url} size="md" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-base font-bold">
                                            {item.item_name}
                                        </span>
                                        <span className="text-sm italic text-default-500">
                                            {item.item_variant_count > 1
                                                ? `${item.item_variant_count} variants`
                                                : "No variants"}
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
                                            ₱{item.item_min_price} per{" "}
                                            {item.item_sold_by}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col items-start">
                                    <span className="text-base font-bold">
                                        {item.variant_stock.toLocaleString()}{" "}
                                        {item.item_sold_by} left
                                    </span>

                                    <span className="text-sm italic text-default-500">
                                        on {item.item_variant_count} variants
                                    </span>
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
                                        size="sm"
                                        variant="light"
                                        isIconOnly
                                        onPress={onOpen}
                                    >
                                        <PencilIcon className="w-5" />
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="light"
                                        isIconOnly
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
            <EditItemModal isOpen={isOpen} onOpenChange={onOpenChange} />
            <DeleteItemModal
                isOpenDeleteItem={isOpenDeleteItem}
                onOpenChangeDeleteItem={onOpenChangeDeleteItem}
            />
        </div>
    );
}
