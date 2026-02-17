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
} from "@heroui/react";

import { MoreIconVertical } from "@/components/icons";
import { OrderTableRow } from "@/model/ui/Admin/order_table_row";

export function OrderTableMobile({ orders }: { orders: OrderTableRow[] }) {
	return (
		<div className="sm:hidden flex-1 min-h-0 flex flex-col">
			<Table isHeaderSticky className="overflow-y-auto h-full w-full">
				<TableHeader>
					<TableColumn>CUSTOMER</TableColumn>
					<TableColumn>ORDER INFO</TableColumn>
					<TableColumn>ACTIONS</TableColumn>
				</TableHeader>

				<TableBody emptyContent={"No orders found."}>
					{orders.map((order) => (
						<TableRow key={order.order_id}>
							<TableCell>
								<div className="flex flex-row items-center gap-2">
									<div className="flex flex-col gap-1 items-start">
										<span className="text-sm font-bold">
											{order.user_name}
										</span>
										<span className="text-default-500 italic text-xs">
											{order.user_role}
										</span>
									</div>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-row gap-2 items-center">
									<div className="flex flex-col items-start">
										<span className="font-bold">
											{order.item_variant_name}
										</span>
										<span className="font-light italic text-xs text-default-500">
											{order.item_name}
										</span>
										<span className="font-bold">
											{order.item_quantity}{" "}
											{order.item_sold_by} - ₱
											{order.subtotal.toFixed(2)}
										</span>
										<span className="text-default-500 text-xs italic">
											{new Date(order.date_ordered)
												.toLocaleString("en-US", {
													month: "2-digit",
													day: "2-digit",
													year: "2-digit",
													hour: "2-digit",
													minute: "2-digit",
													hour12: true,
												})
												.replace(",", " @")}
										</span>
										<span className="text-default-500 italic text-xs">
											{order.price_variant}
										</span>
										<div className="flex flex-row items-center gap-1">
											<span className="w-2 h-2 rounded-full bg-green-400" />
											<span className="text-default-500 italic text-xs">
												{order.status}
											</span>
										</div>
									</div>
								</div>
							</TableCell>
							<TableCell>
								<Dropdown>
									<DropdownTrigger>
										<Button size="sm" variant="light">
											<MoreIconVertical className="w-5" />
										</Button>
									</DropdownTrigger>
									<DropdownMenu aria-label="Static Actions">
										<DropdownSection title="Set Status">
											<DropdownItem key="pending">
												<div className="flex items-center gap-2">
													<span className="w-2 h-2 rounded-full bg-yellow-400" />
													<span>Pending</span>
												</div>
											</DropdownItem>

											<DropdownItem key="ready">
												<div className="flex items-center gap-2">
													<span className="w-2 h-2 rounded-full bg-blue-400" />
													<span>Ready</span>
												</div>
											</DropdownItem>

											<DropdownItem key="completed">
												<div className="flex items-center gap-2">
													<span className="w-2 h-2 rounded-full bg-green-400" />
													<span>Completed</span>
												</div>
											</DropdownItem>

											<DropdownItem key="cancel">
												<div className="flex items-center gap-2">
													<span className="w-2 h-2 rounded-full bg-red-300" />
													<span className="text-danger">
														Cancel
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
		</div>
	);
}
