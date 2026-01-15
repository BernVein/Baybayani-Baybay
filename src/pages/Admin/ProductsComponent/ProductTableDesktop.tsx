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
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/react";

export function ProductTableDesktop({
	isOpen,
	onOpen,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpen: () => void;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<div className="hidden sm:flex">
			<Table
				isHeaderSticky
				className="overflow-y-auto h-[calc(100vh-350px)] w-full"
			>
				<TableHeader>
					<TableColumn>ITEM</TableColumn>
					<TableColumn>PRICE</TableColumn>
					<TableColumn>TOTAL STOCK</TableColumn>
					<TableColumn>LAST UPDATED</TableColumn>
					<TableColumn>STATUS</TableColumn>
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
										Jan 23, 2025
									</span>
									<span className="text-sm text-default-500 italic">
										10:31 PM
									</span>
								</div>
							</TableCell>
							<TableCell>
								<Chip color="success" variant="flat">
									Visible
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
									>
										<TrashIcon className="w-5 text-danger-300" />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Modal Title
							</ModalHeader>
							<ModalBody>
								<p>
									Lorem ipsum dolor sit amet, consectetur
									adipiscing elit. Nullam pulvinar risus non
									risus hendrerit venenatis. Pellentesque sit
									amet hendrerit risus, sed porttitor quam.
								</p>
								<p>
									Lorem ipsum dolor sit amet, consectetur
									adipiscing elit. Nullam pulvinar risus non
									risus hendrerit venenatis. Pellentesque sit
									amet hendrerit risus, sed porttitor quam.
								</p>
								<p>
									Magna exercitation reprehenderit magna aute
									tempor cupidatat consequat elit dolor
									adipisicing. Mollit dolor eiusmod sunt ex
									incididunt cillum quis. Velit duis sit
									officia eiusmod Lorem aliqua enim laboris do
									dolor eiusmod. Et mollit incididunt nisi
									consectetur esse laborum eiusmod pariatur
									proident Lorem eiusmod et. Culpa deserunt
									nostrud ad veniam.
								</p>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={onClose}
								>
									Close
								</Button>
								<Button color="primary" onPress={onClose}>
									Action
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
