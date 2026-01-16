import { MoreIconVertical } from "@/components/icons";
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

export function ProductTableMobile() {
	return (
		<div className="sm:hidden">
			<Table
				isHeaderSticky
				className="overflow-y-auto h-[calc(100vh-350px)] w-full"
			>
				<TableHeader>
					<TableColumn>ITEM</TableColumn>
					<TableColumn>PRICE</TableColumn>
					<TableColumn>ACTIONS</TableColumn>
				</TableHeader>

				<TableBody emptyContent={"No low stock item."}>
					{Array.from({ length: 20 }).map((_, i) => (
						<TableRow key={i + 1}>
							<TableCell>
								<div className="flex flex-row items-center gap-2">
									<div className="flex flex-col items-start">
										<span className="text-sm">
											Item {i + 1}
										</span>
										<span className="text-sm italic text-default-500">
											3 variants
										</span>
										<span className="text-default-500 italic text-xs">
											Vegetable
										</span>
										<span className="text-default-500 italic text-xs">
											Fresh
										</span>
									</div>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-row gap-2 items-center">
									<span className="w-2 h-2 rounded-full bg-green-400" />
									<div className="flex flex-col items-start">
										<span className="font-bold">
											Item123123as{i + 1}
										</span>
										<span className="font-light italic text-xs text-default-500">
											Banana
										</span>
										<span className="font-bold">
											5 kg - ₱21,223.20
										</span>
										<span className="text-default-500 text-xs italic">
											11/23/24 @ 10:23 AM
										</span>
										<span className="text-default-500 italic text-xs">
											Wholesale
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
