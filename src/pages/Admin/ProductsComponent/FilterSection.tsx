import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
	Input,
	useDisclosure,
	DropdownSection,
	Spinner,
} from "@heroui/react";
import { useState } from "react";

import { SearchIcon, FilterIcon, PlusIcon, SortIcon } from "@/components/icons";
import useIsMobile from "@/lib/isMobile";
import { AddEditItemModal } from "@/pages/Admin/ProductsComponent/AddEditItemModal";
import { useFetchCategories } from "@/data/supabase/useFetchCategories";

export function FilterSection({
	setSearchQuery,
	setSelectedCategories,
	searchQuery,
	selectedCategories,
	sortConfig,
	setSortConfig,
}: {
	setSearchQuery: (query: string) => void;
	setSelectedCategories: (categories: string[]) => void;
	searchQuery: string;
	selectedCategories: string[];
	sortConfig: { column: string; direction: "asc" | "desc" } | null;
	setSortConfig: (
		config: { column: string; direction: "asc" | "desc" } | null,
	) => void;
}) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [itemHasVariant, setItemHasVariant] = useState<boolean>(false);
	const isMobile = useIsMobile();
	const { categories, loading: catLoading } = useFetchCategories();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	// keep dropdown selection in sync with selectedCategories
	const selectedCategoryKeys = new Set<string>(selectedCategories);

	return (
		<div className="flex flex-row justify-between w-full">
			<Input
				className="w-1/2 sm:w-1/4"
				placeholder="Search item / variant"
				startContent={<SearchIcon />}
				value={searchQuery}
				onValueChange={setSearchQuery}
			/>
			<div className="flex flex-row gap-2 justify-end">
				<Dropdown>
					<DropdownTrigger>
						<Button
							className="capitalize w-full"
							isIconOnly={isMobile}
							startContent={<PlusIcon className="w-4 shrink-0" />}
						>
							{isMobile ? "" : "Add Item"}
						</Button>
					</DropdownTrigger>
					<DropdownMenu aria-label="Static Actions">
						<DropdownItem
							key="no-variant"
							onPress={() => {
								setItemHasVariant(false);
								onOpen();
							}}
						>
							Without Variant
						</DropdownItem>
						<DropdownItem
							key="with-variant"
							onPress={() => {
								setItemHasVariant(true);
								onOpen();
							}}
						>
							With Variant
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>

				<Dropdown
					isOpen={isDropdownOpen}
					onOpenChange={setIsDropdownOpen}
				>
					<DropdownTrigger>
						<Button
							className="capitalize w-full"
							color={
								selectedCategories.length > 0
									? "success"
									: "default"
							}
							isDisabled={catLoading}
							isIconOnly={isMobile}
							startContent={
								catLoading ? (
									<Spinner color="success" size="sm" />
								) : (
									<FilterIcon className="w-4 shrink-0" />
								)
							}
						>
							{isMobile
								? ""
								: `Categories ${selectedCategories.length > 0 ? `(${selectedCategories.length})` : ""}`}
						</Button>
					</DropdownTrigger>

					<DropdownMenu
						closeOnSelect={false}
						selectedKeys={selectedCategoryKeys}
						selectionMode="multiple"
						onSelectionChange={(keys) => {
							// keys is a Set<React.Key>
							const values = Array.from(keys).map(String);

							setSelectedCategories(values);
						}}
					>
						<DropdownSection showDivider title="Categories">
							{categories.map((cat) => (
								<DropdownItem key={cat.category_id}>
									<div className="flex items-center gap-2">
										<span>{cat.category_name}</span>
									</div>
								</DropdownItem>
							))}
						</DropdownSection>

						<DropdownSection showDivider title="Item Type">
							<DropdownItem key="no-variant">
								<div className="flex items-center gap-2">
									<span>No Variant</span>
								</div>
							</DropdownItem>
							<DropdownItem key="with-variant">
								<div className="flex items-center gap-2">
									<span>With Variant</span>
								</div>
							</DropdownItem>
						</DropdownSection>
						<DropdownSection title="Reset">
							<DropdownItem
								key="reset"
								color="danger"
								onClick={() => {
									setSelectedCategories([]);
									setIsDropdownOpen(false);
								}}
							>
								<div className="flex items-center gap-2">
									<span>Reset Filters</span>
								</div>
							</DropdownItem>
						</DropdownSection>
					</DropdownMenu>
				</Dropdown>

				<Dropdown>
					<DropdownTrigger>
						<Button
							className="capitalize w-full"
							isIconOnly={isMobile}
							startContent={<SortIcon className="w-4 shrink-0" />}
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
							const [column, direction] = String(key).split(":");
							setSortConfig({
								column,
								direction: direction as "asc" | "desc",
							});
						}}
					>
						<DropdownSection title="Alphabetical" showDivider>
							<DropdownItem key="item_title:asc">
								A - Z
							</DropdownItem>
							<DropdownItem key="item_title:desc">
								Z - A
							</DropdownItem>
						</DropdownSection>
						<DropdownSection title="Price" showDivider>
							<DropdownItem key="item_min_price:asc">
								Price (Lowest)
							</DropdownItem>
							<DropdownItem key="item_min_price:desc">
								Price (Highest)
							</DropdownItem>
						</DropdownSection>
						<DropdownSection title="Stock" showDivider>
							<DropdownItem key="variant_stock:asc">
								Stock (Lowest)
							</DropdownItem>
							<DropdownItem key="variant_stock:desc">
								Stock (Highest)
							</DropdownItem>
						</DropdownSection>
						<DropdownSection title="Date">
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

			<AddEditItemModal
				isOpen={isOpen}
				itemHasVariant={itemHasVariant}
				selectedItemId={null}
				onOpenChange={onOpenChange}
			/>
		</div>
	);
}
