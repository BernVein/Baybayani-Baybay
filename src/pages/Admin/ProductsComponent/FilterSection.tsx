import {
	SearchIcon,
	FilterIcon,
	VegetablesOutline,
	FoodGrains24Regular,
	FruitsOutline,
	PoultryLeg,
	Chili,
} from "@/components/icons";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
	Input,
} from "@heroui/react";

export function FilterSection() {
	return (
		<>
			<Input
				placeholder="Search item / variant"
				className="w-1/2 sm:w-1/4"
				startContent={<SearchIcon />}
			/>
			<Dropdown>
				<DropdownTrigger>
					<Button
						className="capitalize"
						startContent={<FilterIcon className="w-5" />}
					>
						Filter Categories
					</Button>
				</DropdownTrigger>
				<DropdownMenu closeOnSelect={false} selectionMode="multiple">
					<DropdownItem key="pending">
						<div className="flex items-center gap-2">
							<VegetablesOutline />
							<span>Vegetable</span>
						</div>
					</DropdownItem>
					<DropdownItem key="ready">
						<div className="flex items-center gap-2">
							<FoodGrains24Regular />
							<span>Grain</span>
						</div>
					</DropdownItem>
					<DropdownItem key="completed">
						<div className="flex items-center gap-2">
							<FruitsOutline />
							<span>Fruit</span>
						</div>
					</DropdownItem>
					<DropdownItem key="cancel">
						<div className="flex items-center gap-2">
							<PoultryLeg />
							<span>Poultry</span>
						</div>
					</DropdownItem>
					<DropdownItem key="cancel">
						<div className="flex items-center gap-2">
							<Chili />
							<span>Spice</span>
						</div>
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</>
	);
}
