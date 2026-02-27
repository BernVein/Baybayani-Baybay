import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	DropdownSection,
	Button,
	useDisclosure,
	Input,
} from "@heroui/react";
import { useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import {
	CartIcon,
	SearchIcon,
	FilterIcon,
	PlusIcon,
	SortIcon,
} from "@/components/icons";
import { OrderSummary } from "@/pages/Admin/OrdersComponent/OrderSummary";
import useIsMobile from "@/lib/isMobile";
import { AddOrderModal } from "@/pages/Admin/OrdersComponent/AddOrderModal";
import { OrderTable } from "./OrdersComponent/OrderTable";
import { useState } from "react";
import type { Selection } from "@heroui/react";
import { useFetchOrderItems } from "@/data/supabase/Admin/Orders/useFetchOrderItems";

export default function Orders() {
	const isMobile = useIsMobile();
	const { profile } = useOutletContext<any>();
	const [selectedCategories, setSelectedCategories] = useState<Selection>(
		new Set([]),
	);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [sortConfig, setSortConfig] = useState<{
		column: string;
		direction: "asc" | "desc";
	} | null>(null);
	const {
		isOpen: isOpenAddOrder,
		onOpen: onOpenAddOrder,
		onOpenChange: onOpenChangeAddOrder,
	} = useDisclosure();

	const selectedCategoryArray = useMemo(() => {
		return selectedCategories === "all"
			? []
			: Array.from(selectedCategories).map((key) => String(key));
	}, [selectedCategories]);

	const { orderItems, setOrderItems, loading, refetch } = useFetchOrderItems(
		selectedCategoryArray,
		searchQuery,
		sortConfig,
	);

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
						placeholder="Search Order ID"
						startContent={<SearchIcon />}
						value={searchQuery}
						onValueChange={setSearchQuery}
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
								<DropdownItem key="Cancelled">
									<div className="flex items-center gap-2">
										<span className="w-2 h-2 rounded-full bg-red-300" />
										<span className="text-danger">
											Cancelled
										</span>
									</div>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>

						<Dropdown>
							<DropdownTrigger>
								<Button
									className="capitalize"
									isIconOnly={isMobile}
									startContent={
										<SortIcon className="w-4 shrink-0" />
									}
									color={sortConfig ? "success" : "default"}
								>
									{isMobile ? "" : "Sort By"}
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								selectionMode="single"
								selectedKeys={
									new Set(
										sortConfig
											? [
													`${sortConfig.column}:${sortConfig.direction}`,
												]
											: [],
									)
								}
								onAction={(key) => {
									if (key === "clear") {
										setSortConfig(null);
										return;
									}
									const [column, direction] =
										String(key).split(":");
									setSortConfig({
										column,
										direction: direction as "asc" | "desc",
									});
								}}
							>
								<DropdownSection title="Price" showDivider>
									<DropdownItem key="subtotal:asc">
										Price (Lowest)
									</DropdownItem>
									<DropdownItem key="subtotal:desc">
										Price (Highest)
									</DropdownItem>
								</DropdownSection>
								<DropdownSection
									title="Alphabetical"
									showDivider
								>
									<DropdownItem key="item_title:asc">
										A - Z
									</DropdownItem>
									<DropdownItem key="item_title:desc">
										Z - A
									</DropdownItem>
								</DropdownSection>
								<DropdownSection title="Date" showDivider>
									<DropdownItem key="created_at:asc">
										Oldest First
									</DropdownItem>
									<DropdownItem key="created_at:desc">
										Newest First
									</DropdownItem>
								</DropdownSection>
								<DropdownItem key="clear" color="danger">
									Clear Sort
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>

				{/* TABLE ROW */}
				<div className="flex-1 min-h-0 flex flex-col">
					<OrderTable
						selectedCategories={selectedCategories}
						searchQuery={searchQuery}
						orderItems={orderItems}
						setOrderItems={setOrderItems}
						loading={loading}
					/>
				</div>
			</div>
			<AddOrderModal
				isOpenAddOrder={isOpenAddOrder}
				onOpenChangeAddOrder={onOpenChangeAddOrder}
				onSuccess={refetch}
			/>
		</>
	);
}
