import { MoreIconVertical } from "@/components/icons";
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
	Chip,
} from "@heroui/react";

export function OrderTableDesktop() {
	return (
		<div className="hidden sm:flex">
			<Table
				isHeaderSticky
				selectionMode="single"
				className="overflow-y-auto h-[calc(100vh-350px)] w-full"
			>
				<TableHeader>
					<TableColumn>USER</TableColumn>
					<TableColumn>DATE</TableColumn>
					<TableColumn>ITEM</TableColumn>
					<TableColumn>QUANTITY</TableColumn>
					<TableColumn>STATUS</TableColumn>
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
								<div className="flex flex-col items-start gap-2">
									<span className="text-sm">
										Jan 12, 2025
									</span>
									<span className="text-xs text-default-500">
										10:12 AM
									</span>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-row gap-2 items-center">
									<Avatar />
									<div className="flex flex-col gap-1 items-start">
										<span>Item123123as{i + 1}</span>
										<span className="text-default-500 italic">
											Banana
										</span>
									</div>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-row gap-2 items-center">
									<span className="text-base">5 kg</span>
								</div>
							</TableCell>
							<TableCell>
								<Chip color="success" variant="flat">
									Completed
								</Chip>
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
