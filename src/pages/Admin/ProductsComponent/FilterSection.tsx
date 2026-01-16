import {
	SearchIcon,
	FilterIcon,
	VegetablesOutline,
	FoodGrains24Regular,
	FruitsOutline,
	PoultryLeg,
	PlusIcon,
	Chili,
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
				placeholder="Search item / variant"
				className="w-1/2 sm:w-1/4"
				startContent={<SearchIcon />}
			/>
			<div className="flex flex-row gap-2 justify-end">
				<Button
					startContent={<PlusIcon className="w-5" />}
					isIconOnly={isMobile}
					onPress={onOpen}
				>
					{isMobile ? "" : "Add Item"}
				</Button>
				<Dropdown>
					<DropdownTrigger>
						<Button
							className="capitalize"
							startContent={<FilterIcon className="w-5" />}
							isIconOnly={isMobile}
						>
							{isMobile ? "" : "Filter Categories"}
						</Button>
					</DropdownTrigger>
					<DropdownMenu
						closeOnSelect={false}
						selectionMode="multiple"
					>
						<DropdownItem key="vegetable">
							<div className="flex items-center gap-2">
								<VegetablesOutline />
								<span>Vegetable</span>
							</div>
						</DropdownItem>
						<DropdownItem key="grain">
							<div className="flex items-center gap-2">
								<FoodGrains24Regular />
								<span>Grain</span>
							</div>
						</DropdownItem>
						<DropdownItem key="fruit">
							<div className="flex items-center gap-2">
								<FruitsOutline />
								<span>Fruit</span>
							</div>
						</DropdownItem>
						<DropdownItem key="poultry">
							<div className="flex items-center gap-2">
								<PoultryLeg />
								<span>Poultry</span>
							</div>
						</DropdownItem>
						<DropdownItem key="spice">
							<div className="flex items-center gap-2">
								<Chili />
								<span>Spice</span>
							</div>
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>
			<AddItemModal isOpen={isOpen} onOpenChange={onOpenChange} />
		</div>
	);
}
