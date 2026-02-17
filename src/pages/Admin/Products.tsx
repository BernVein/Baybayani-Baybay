import { useState } from "react";

import { ProductIcon } from "@/components/icons";
import { ProductSummary } from "@/pages/Admin/ProductsComponent/ProductSummary";
import { FilterSection } from "@/pages/Admin/ProductsComponent/FilterSection";
import { ProductTable } from "@/pages/Admin/ProductsComponent/ProductTable";
import { useFetchProductsUI } from "@/data/supabase/Admin/Products/useFetchProductsUI";

export default function Products() {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

	const { items, allItems, loading, refetch } = useFetchProductsUI(
		searchQuery,
		selectedCategories,
	);

	return (
		<div className="flex flex-col gap-8 p-4 h-full">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
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
			<div className="hidden sm:block shrink-0">
				<ProductSummary items={allItems} isLoading={loading} />
			</div>

			<div className="flex flex-row items-center justify-between shrink-0">
				<FilterSection
					searchQuery={searchQuery}
					selectedCategories={selectedCategories}
					setSearchQuery={setSearchQuery}
					setSelectedCategories={setSelectedCategories}
				/>
			</div>
			<div className="flex-1 min-h-0">
				<ProductTable
					items={items}
					loading={loading}
					refetch={refetch}
				/>
			</div>
		</div>
	);
}
