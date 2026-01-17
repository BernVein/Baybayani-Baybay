import {
	MoreIconVertical,
	PencilIcon,
	EyeIcon,
	TrashIcon,
} from "@/components/icons";
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
	// useDisclosure,
} from "@heroui/react";
// import { EditItemModal } from "./ProductTableComponent/EditItemModal";

export function UsersTableMobile() {
	// const { isOpen, onOpen, onOpenChange } = useDisclosure();
	// const {
	// 	isOpen: isOpenDeleteItem,
	// 	onOpen: onOpenDeleteItem,
	// 	onOpenChange: onOpenChangeDeleteItem,
	// } = useDisclosure();
	return (
		<div className="sm:hidden">
			<Table
				isHeaderSticky
				className="overflow-y-auto h-[calc(100vh-350px)] w-full"
			>
				<TableHeader>
					<TableColumn>ITEM</TableColumn>
					<TableColumn>PRICE & STOCK</TableColumn>
					<TableColumn>ACTIONS</TableColumn>
				</TableHeader>

				<TableBody emptyContent={"No low stock item."}>
					{Array.from({ length: 20 }).map((_, i) => (
						<TableRow key={i + 1}>
							<TableCell>
								<div className="flex flex-row items-center gap-2">
									<div className="flex flex-col items-start">
										<span className="text-sm font-bold">
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
									<div className="flex flex-col items-start">
										<span className="font-bold">
											₱213.20 - ₱220.00
										</span>
										<span className="font-light italic text-xs text-default-500">
											per kg
										</span>

										<span className="text-default-500 text-xs italic">
											523 kg left
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
												// onClick={onOpen}
											>
												<div className="flex items-center gap-2">
													<span>Edit</span>
												</div>
											</DropdownItem>

											<DropdownItem
												key="ready"
												startContent={
													<EyeIcon className="w-5" />
												}
											>
												<div className="flex items-center gap-2">
													<span>Hide</span>
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
			{/* <EditItemModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				isOpenDeleteItem={isOpenDeleteItem}
				onOpenDeleteItem={onOpenDeleteItem}
				onOpenChangeDeleteItem={onOpenChangeDeleteItem}
			/> */}
		</div>
	);
}
