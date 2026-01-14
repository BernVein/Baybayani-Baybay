import { CartIcon, MoreIconVertical } from "@/components/icons";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Avatar,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
	DropdownSection,
} from "@heroui/react";

export default function Orders() {
	return (
		<div className="flex flex-col gap-8 p-4">
			{/* HEADER ROW */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
				<div className="flex flex-row items-center gap-2">
					<CartIcon className="w-10" />
					<div className="text-3xl font-semibold">Orders</div>
				</div>
				<div className="flex flex-row gap-1 items-center text-muted-foreground">
					<div className="text-base text-default-500">
						Logged in as{" "}
					</div>
					<div className="text-lg font-semibold">Admin Bern Vein</div>
				</div>
			</div>

			{/* TABLE ROW */}
			<Table
				isHeaderSticky
				selectionMode="single"
				className="overflow-y-auto h-[500px] w-full"
			>
				<TableHeader>
					<TableColumn>USER</TableColumn>
					<TableColumn>ITEM</TableColumn>
					<TableColumn>ACTIONS</TableColumn>
				</TableHeader>

				<TableBody emptyContent={"No low stock item."}>
					{Array.from({ length: 20 }).map((_, i) => (
						<TableRow key={i + 1}>
							<TableCell>
								<div className="flex flex-row items-center gap-2">
									<Avatar size="md" />
									<span className="text-base">
										User {i + 1}
									</span>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-row gap-2 items-center">
									<Avatar
										size="md"
										color="success"
										isBordered
										src={`https://i.pravatar.cc/150?u=a042581f4e49026024${i + 1}`}
									/>
									<div className="flex flex-col gap-1 items-start">
										<span>Item {i + 1}</span>
										<span className="text-default-500 italic">
											5 kg
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
											<DropdownItem key="processing">
												<div className="flex items-center gap-2">
													<span className="w-2 h-2 rounded-full bg-blue-400" />
													<span>Processing</span>
												</div>
											</DropdownItem>

											<DropdownItem key="ready">
												<div className="flex items-center gap-2">
													<span className="w-2 h-2 rounded-full bg-yellow-400" />
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
										<DropdownSection title="Order Date">
											<DropdownItem
												key="date"
												className="pointer-events-none cursor-default"
											>
												<div className="flex items-center gap-2">
													<span>
														Jan 10, 2025 10:00 AM
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
