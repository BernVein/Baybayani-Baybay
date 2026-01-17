import {
	SearchIcon,
	FilterIcon,
	PlusIcon,
	SoloUserIcon,
	UserIcon,
	KeyIcon,
} from "@/components/icons";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
	Input,
	useDisclosure,
	DropdownSection,
} from "@heroui/react";
import useIsMobile from "@/lib/isMobile";
import { AddUserModal } from "@/pages/Admin/UsersComponent/AddUserModal";

export function FilterSection() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const isMobile = useIsMobile();
	return (
		<div className="flex flex-row justify-between w-full">
			<Input
				placeholder="Search user"
				className="w-1/2 sm:w-1/4"
				startContent={<SearchIcon />}
			/>
			<div className="flex flex-row gap-2 justify-end">
				<Button
					startContent={<PlusIcon className="w-5" />}
					isIconOnly={isMobile}
					onPress={onOpen}
				>
					{isMobile ? "" : "Add User"}
				</Button>
				<Dropdown>
					<DropdownTrigger>
						<Button
							className="capitalize"
							startContent={<FilterIcon className="w-5" />}
							isIconOnly={isMobile}
						>
							{isMobile ? "" : "Filter Users"}
						</Button>
					</DropdownTrigger>
					<DropdownMenu
						closeOnSelect={false}
						selectionMode="multiple"
					>
						<DropdownSection title="Filter Role">
							<DropdownItem key="individual">
								<div className="flex items-center gap-2">
									<SoloUserIcon className="w-5" />
									<span>Individual</span>
								</div>
							</DropdownItem>
							<DropdownItem key="cooperative">
								<div className="flex items-center gap-2">
									<UserIcon className="w-5" />
									<span>Cooperative</span>
								</div>
							</DropdownItem>
							<DropdownItem key="admin">
								<div className="flex items-center gap-2">
									<KeyIcon className="w-5" />
									<span>Admin</span>
								</div>
							</DropdownItem>
						</DropdownSection>
						<DropdownSection title="Filter Status">
							<DropdownItem key="active">
								<div className="flex items-center gap-2">
									<span className="w-2 h-2 rounded-full bg-green-400" />
									<span>Active</span>
								</div>
							</DropdownItem>
							<DropdownItem key="pending">
								<div className="flex items-center gap-2">
									<span className="w-2 h-2 rounded-full bg-yellow-400" />
									<span>Pending</span>
								</div>
							</DropdownItem>
							<DropdownItem key="suspended">
								<div className="flex items-center gap-2">
									<span className="w-2 h-2 rounded-full bg-red-400" />
									<span>Suspended</span>
								</div>
							</DropdownItem>
						</DropdownSection>
					</DropdownMenu>
				</Dropdown>
			</div>
			<AddUserModal isOpen={isOpen} onOpenChange={onOpenChange} />
		</div>
	);
}
