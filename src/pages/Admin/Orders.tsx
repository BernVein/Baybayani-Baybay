import { CartIcon, SearchIcon, FilterIcon } from "@/components/icons";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
	Input,
} from "@heroui/react";
import { OrderSummary } from "@/pages/Admin/OrdersComponent/OrderSummary";
import { OrderTableMobile } from "./OrdersComponent/OrderTableMobile";
import { OrderTableDesktop } from "./OrdersComponent/OrderTableDesktop";

export default function Orders() {
	return (
		<div className="flex flex-col gap-8 p-4">
			{/* HEADER ROW */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
				<div className="flex flex-row items-center gap-2">
					<CartIcon className="w-10" />
					<div className="text-3xl font-semibold">Orders</div>
				</div>
				<div className="flex flex-row gap-1 items-center text-muted-foreground">
					<div className="text-base text-default-500">
						Logged in as{" "}
					</div>
					<div className="text-lg font-semibold">Admin Bern Vein</div>
				</div>
			</div>
			<div className="hidden sm:block">
				<OrderSummary />
			</div>

			<div className="flex flex-row items-center justify-between">
				{/* Search Row */}
				<Input
					placeholder="Search user / item"
					className="w-1/2 sm:w-1/4"
					startContent={<SearchIcon />}
				/>
				<Dropdown>
					<DropdownTrigger>
						<Button
							className="capitalize"
							startContent={<FilterIcon className="w-5" />}
						>
							Filter Status
						</Button>
					</DropdownTrigger>
					<DropdownMenu
						closeOnSelect={false}
						selectionMode="multiple"
					>
						<DropdownItem key="pending">
							<div className="flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-yellow-400" />
								<span>Pending</span>
							</div>
						</DropdownItem>
						<DropdownItem key="ready">
							<div className="flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-blue-400" />
								<span>Ready</span>
							</div>
						</DropdownItem>
						<DropdownItem key="completed">
							<div className="flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-green-400" />
								<span>Completed</span>
							</div>
						</DropdownItem>
						<DropdownItem key="cancel">
							<div className="flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-red-300" />
								<span className="text-danger">Cancel</span>
							</div>
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>

			{/* TABLE ROW */}
			<OrderTableMobile />
			<OrderTableDesktop />
		</div>
	);
}
