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
} from "@heroui/react";
import useIsMobile from "@/lib/isMobile";
import { AddItemModal } from "@/pages/Admin/ProductsComponent/AddItemModal";

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
						<DropdownItem key="vegetable">
							<div className="flex items-center gap-2">
								<SoloUserIcon className="w-5" />
								<span>Individual</span>
							</div>
						</DropdownItem>
						<DropdownItem key="grain">
							<div className="flex items-center gap-2">
								<UserIcon className="w-5" />
								<span>Cooperative</span>
							</div>
						</DropdownItem>
						<DropdownItem key="fruit">
							<div className="flex items-center gap-2">
								<KeyIcon className="w-5" />
								<span>Admin</span>
							</div>
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>
			<AddItemModal isOpen={isOpen} onOpenChange={onOpenChange} />
		</div>
	);
}
