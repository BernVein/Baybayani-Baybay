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
import { EditUserModal } from "@/pages/Admin/UsersComponent/EditUserModal";
import { DeleteUserModal } from "./DeleteUserModal";

export function UsersTableDesktop() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const {
		isOpen: isOpenDeleteUser,
		onOpen: onOpenDeleteUser,
		onOpenChange: onOpenChangeDeleteUser,
	} = useDisclosure();
	return (
		<div className="sm:flex hidden">
			<Table
				isHeaderSticky
				className="overflow-y-auto h-[calc(100vh-350px)] w-full"
			>
				<TableHeader>
					<TableColumn>USER</TableColumn>
					<TableColumn>ROLE</TableColumn>
					<TableColumn>STATUS</TableColumn>
					<TableColumn>PURCHASE SUMMARY</TableColumn>
					<TableColumn>ACTIONS</TableColumn>
				</TableHeader>

				<TableBody emptyContent={"No users found."}>
					{Array.from({ length: 20 }).map((_, i) => (
						<TableRow key={i + 1}>
							<TableCell>
								<div className="flex flex-row items-center gap-2">
									<Avatar size="md" />
									<div className="flex flex-col items-start">
										<span className="text-base font-bold">
											Baybayani User
										</span>
										<span className="text-sm text-default-500 italic">
											user_username
										</span>
									</div>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-row gap-2 items-center">
									<Chip color="success" variant="flat">
										Cooperative
									</Chip>
								</div>
							</TableCell>
							<TableCell>
								<Chip color="success" variant="flat">
									Active
								</Chip>
							</TableCell>
							<TableCell>
								<div className="flex flex-col items-start">
									<span className="text-base font-bold">
										₱12,000.00
									</span>
									<span className="text-sm italic text-default-500">
										15 completed orders
									</span>
								</div>
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
										onPress={onOpenDeleteUser}
									>
										<TrashIcon className="w-5 text-danger-300" />
									</Button>
								</div>
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
