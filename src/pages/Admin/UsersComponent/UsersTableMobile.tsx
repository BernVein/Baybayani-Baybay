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
import { EditUserModal } from "@/pages/Admin/UsersComponent/EditUserModal";
import { DeleteUserModal } from "@/pages/Admin/UsersComponent/DeleteUserModal";
export function UsersTableMobile() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const {
		isOpen: isOpenDeleteUser,
		onOpen: onOpenDeleteUser,
		onOpenChange: onOpenChangeDeleteUser,
	} = useDisclosure();
	return (
		<div className="sm:hidden">
			<Table
				isHeaderSticky
				className="overflow-y-auto h-[calc(100vh-350px)] w-full"
			>
				<TableHeader>
					<TableColumn>USER</TableColumn>
					<TableColumn>PURCHASES</TableColumn>
					<TableColumn>ACTIONS</TableColumn>
				</TableHeader>

				<TableBody emptyContent={"No low stock item."}>
					{Array.from({ length: 20 }).map((_, i) => (
						<TableRow key={i + 1}>
							<TableCell>
								<div className="flex flex-row items-center gap-2">
									<div className="flex flex-col items-start">
										<span className="text-sm font-bold">
											Baybayani User
										</span>
										<span className="text-sm italic text-default-500">
											Cooperative
										</span>
										<div className="flex flex-row items-center gap-1">
											<span className="w-2 h-2 rounded-full bg-green-400" />
											<span className="text-default-500 italic text-xs">
												Active
											</span>
										</div>
									</div>
								</div>
							</TableCell>

							<TableCell>
								<div className="flex flex-row gap-2 items-center">
									<div className="flex flex-col items-start">
										<span className="font-bold">
											₱12,000.00
										</span>
										<span className="font-light italic text-xs text-default-500">
											15 completed orders
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
										<DropdownSection title="Manage User">
											<DropdownItem
												key="pending"
												startContent={
													<PencilIcon className="w-5" />
												}
												onClick={onOpen}
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
												onClick={onOpenDeleteUser}
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
			<EditUserModal isOpen={isOpen} onOpenChange={onOpenChange} />
			<DeleteUserModal
				isOpenDeleteUser={isOpenDeleteUser}
				onOpenChangeDeleteUser={onOpenChangeDeleteUser}
			/>
		</div>
	);
}
