import { MoreIconVertical, PencilIcon, TrashIcon } from "@/components/icons";
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
} from "@heroui/react";
import { EditItemModal } from "@/pages/Admin/ProductsComponent/EditItemModal";
import { ItemTableRow } from "@/model/ui/Admin/item_table_row";
import { useState } from "react";
export function ProductTableMobile({ items }: { items: ItemTableRow[] }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    return (
        <div className="sm:hidden flex-1 min-h-0 flex flex-col">
            <Table isHeaderSticky className="overflow-y-auto h-full w-full">
                <TableHeader>
                    <TableColumn>ITEM</TableColumn>
                    <TableColumn>PRICE & STOCK</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>

                <TableBody emptyContent={"No items found."}>
                    {items.map((item, i) => (
                        <TableRow key={i + 1}>
                            <TableCell>
                                <div className="flex flex-row items-center gap-2">
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm font-bold">
                                            {item.item_name}
                                        </span>
                                        <span className="text-sm italic text-default-500">
                                            {item.item_variant_count > 1
                                                ? `${item.item_variant_count} variants`
                                                : "No variants"}
                                        </span>

                                        <span className="text-default-500 italic text-xs">
                                            {item.item_category}
                                        </span>
                                        <span className="text-default-500 italic text-xs">
                                            {item.item_tag ?? "No tag"}
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
                                        <span className="font-bold">
                                            ₱
                                            {Number(
                                                item.item_min_price,
                                            ).toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                        <span className="font-light italic text-xs text-default-500">
                                            per {item.item_sold_by}
                                        </span>

                                        <span className="text-default-500 text-xs italic">
                                            {item.variant_stock.toLocaleString()}{" "}
                                            {item.item_sold_by}s left
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button variant="light" size="sm">
                                            <MoreIconVertical className="w-5" />
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Static Actions">
                                        <DropdownSection title="Manage Item">
                                            <DropdownItem
                                                key="pending"
                                                startContent={
                                                    <PencilIcon className="w-5" />
                                                }
                                                onClick={() => {
                                                    setSelectedItemId(
                                                        item.item_id,
                                                    );
                                                    onOpen();
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span>Edit</span>
                                                </div>
                                            </DropdownItem>

                                            <DropdownItem
                                                key="cancel"
                                                startContent={
                                                    <TrashIcon className="w-5 text-danger-300" />
                                                }
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-danger">
                                                        Delete
                                                    </span>
                                                </div>
                                            </DropdownItem>
                                        </DropdownSection>
                                    </DropdownMenu>
                                </Dropdown>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <EditItemModal
                item_id={selectedItemId ?? ""}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            />
        </div>
    );
}
