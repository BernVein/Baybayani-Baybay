import {
	TrashIcon,
	EyeIcon,
	// EyeSlashIcon,
	PencilIcon,
} from "@/components/icons";
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
import { DeleteItemModal } from "@/pages/Admin/ProductsComponent/ProductTableComponent/EditItemModalComponent/DeleteItemModal";

export function ProductTableDesktop() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const {
		isOpen: isOpenDeleteItem,
		onOpen: onOpenDeleteItem,
		onOpenChange: onOpenChangeDeleteItem,
	} = useDisclosure();
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

				<TableBody emptyContent={"No low stock item."}>
					{Array.from({ length: 20 }).map((_, i) => (
						<TableRow key={i + 1}>
							<TableCell>
								<div className="flex flex-row items-center gap-2">
									<Avatar size="md" />
									<div className="flex flex-col items-start">
										<span className="text-base font-bold">
											Item {i + 1}
										</span>
										<span className="text-sm text-default-500 italic">
											3 Variants
										</span>
									</div>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-row gap-2 items-center">
									<div className="flex flex-col items-start">
										<span className="text-base font-bold">
											₱33.20 - ₱123.20
										</span>
										<span className="text-sm italic text-default-500">
											per kg
										</span>
									</div>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-col items-start">
									<span className="text-base font-bold">
										502 kg
									</span>
									<span className="text-sm italic text-default-500">
										on 3 variants
									</span>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-col items-start">
									<span className="text-base font-bold">
										Vegetable
									</span>
								</div>
							</TableCell>
							<TableCell>
								<Chip color="success" variant="flat">
									Fresh
								</Chip>
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
									>
										<EyeIcon className="w-5" />
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
