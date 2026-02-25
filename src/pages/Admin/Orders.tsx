import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
	useDisclosure,
	Input,
} from "@heroui/react";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { CartIcon, SearchIcon, FilterIcon, PlusIcon } from "@/components/icons";
import { OrderSummary } from "@/pages/Admin/OrdersComponent/OrderSummary";
import useIsMobile from "@/lib/isMobile";
import { AddOrderModal } from "@/pages/Admin/OrdersComponent/AddOrderModal";
import { OrderTable } from "./OrdersComponent/OrderTable";
import { useState } from "react";
import type { Selection } from "@heroui/react";

export default function Orders() {
	const isMobile = useIsMobile();
	const { profile } = useOutletContext<any>();
	const [selectedCategories, setSelectedCategories] = useState<Selection>(
		new Set([]),
	);

	const {
		isOpen: isOpenAddOrder,
		onOpen: onOpenAddOrder,
		onOpenChange: onOpenChangeAddOrder,
	} = useDisclosure();

	useEffect(() => {
		document.title = "Baybayani | Admin | Orders";
	}, []);

	return (
		<>
			<div className="flex flex-col gap-8 p-4 h-full">
				{/* HEADER ROW */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
					<div className="flex flex-row items-center gap-2">
						<CartIcon className="w-10" />
						<div className="text-3xl font-semibold">Orders</div>
					</div>
					<div className="flex flex-row gap-1 items-center text-muted-foreground">
						<div className="text-base text-default-500">
							Logged in as{" "}
						</div>
						<div className="text-lg font-semibold">
							{profile?.user_name ?? "Admin"}
						</div>
					</div>
				</div>
				<div className="hidden sm:block shrink-0">
					<OrderSummary />
				</div>

				<div className="flex flex-row items-center justify-between shrink-0">
					{/* Search Row */}
					<Input
						className="w-1/2 sm:w-1/4"
						placeholder="Search user / item"
						startContent={<SearchIcon />}
					/>
					<div className="flex flex-row gap-2 items-center">
						<Button
							className="capitalize"
							isIconOnly={isMobile}
							startContent={<PlusIcon className="w-5" />}
							onPress={onOpenAddOrder}
						>
							{isMobile ? "" : "Add Order"}
						</Button>
						<Dropdown>
							<DropdownTrigger>
								<Button
									className="capitalize"
									isIconOnly={isMobile}
									startContent={
										<FilterIcon className="w-5" />
									}
									color={
										selectedCategories instanceof Set
											? selectedCategories.size > 0
												? "success"
												: "default"
											: "default"
									}
								>
									{isMobile ? "" : "Filter Status"}{" "}
									{selectedCategories instanceof Set
										? selectedCategories.size > 0
											? `(${selectedCategories.size})`
											: ""
										: ""}
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								selectedKeys={selectedCategories}
								onSelectionChange={setSelectedCategories}
								closeOnSelect={false}
								selectionMode="multiple"
							>
								<DropdownItem key="Pending">
									<div className="flex items-center gap-2">
										<span className="w-2 h-2 rounded-full bg-yellow-400" />
										<span>Pending</span>
									</div>
								</DropdownItem>
								<DropdownItem key="Ready">
									<div className="flex items-center gap-2">
										<span className="w-2 h-2 rounded-full bg-blue-400" />
										<span>Ready</span>
									</div>
								</DropdownItem>
								<DropdownItem key="Completed">
									<div className="flex items-center gap-2">
										<span className="w-2 h-2 rounded-full bg-green-400" />
										<span>Completed</span>
									</div>
								</DropdownItem>
								<DropdownItem key="Cancel">
									<div className="flex items-center gap-2">
										<span className="w-2 h-2 rounded-full bg-red-300" />
										<span className="text-danger">
											Cancel
										</span>
									</div>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>

				{/* TABLE ROW */}
				<div className="flex-1 min-h-0 flex flex-col">
					<OrderTable selectedCategories={selectedCategories} />
				</div>
			</div>
			<AddOrderModal
				isOpenAddOrder={isOpenAddOrder}
				onOpenChangeAddOrder={onOpenChangeAddOrder}
			/>
		</>
	);
}
