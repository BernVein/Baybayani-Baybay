import {
	ProductIcon,
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
import { ProductSummary } from "@/pages/Admin/ProductsComponent/ProductSummary";
import { ProductTableMobile } from "@/pages/Admin/ProductsComponent/ProductTableMobile";
import { ProductTableDesktop } from "@/pages/Admin/ProductsComponent/ProductTableDesktop";
export default function Products() {
	return (
		<div className="flex flex-col gap-8 p-4">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
				<div className="flex flex-row items-center gap-2">
					<ProductIcon className="w-10" />
					<div className="text-3xl font-semibold">Products</div>
				</div>
				<div className="flex flex-row gap-1 items-center text-muted-foreground">
					<div className="text-base text-default-500">
						Logged in as{" "}
					</div>
					<div className="text-lg font-semibold">Admin Bern Vein</div>
				</div>
			</div>
			<div className="hidden sm:block">
				<ProductSummary />
			</div>

			<div className="flex flex-row items-center justify-between">
				{/* Search Row */}
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
					<DropdownMenu
						closeOnSelect={false}
						selectionMode="multiple"
					>
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
			</div>

			{/* TABLE ROW */}
			<ProductTableMobile />
			<ProductTableDesktop />
		</div>
	);
}
