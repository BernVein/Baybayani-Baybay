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
import { CartIcon, SearchIcon, FilterIcon, PlusIcon } from "@/components/icons";
import { OrderSummary } from "@/pages/Admin/OrdersComponent/OrderSummary";
import { useFetchOrderItems } from "@/data/supabase/Admin/Orders/useFetchOrderItems";
import useIsMobile from "@/lib/isMobile";
import { AddOrderModal } from "@/pages/Admin/OrdersComponent/AddOrderModal";
import { OrderTable } from "./OrdersComponent/OrderTable";

export default function Orders() {
	const isMobile = useIsMobile();
	const {
		isOpen: isOpenAddOrder,
		onOpen: onOpenAddOrder,
		onOpenChange: onOpenChangeAddOrder,
	} = useDisclosure();

	useEffect(() => {
		document.title = "Baybayani | Admin | Orders";
	}, []);

	const { orderItems, loading, refetch } = useFetchOrderItems();
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
							Admin Bern Vein
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
								>
									{isMobile ? "" : "Filter Status"}
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
					<OrderTable
						orders={orderItems}
						loading={loading}
						refetch={refetch}
					/>
				</div>
			</div>
			<AddOrderModal
				isOpenAddOrder={isOpenAddOrder}
				onOpenChangeAddOrder={onOpenChangeAddOrder}
			/>
		</>
	);
}
