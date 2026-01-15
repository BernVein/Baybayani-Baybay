import { ProductIcon } from "@/components/icons";
import { ProductSummary } from "@/pages/Admin/ProductsComponent/ProductSummary";
import { ProductTableMobile } from "@/pages/Admin/ProductsComponent/ProductTableMobile";
import { ProductTableDesktop } from "@/pages/Admin/ProductsComponent/ProductTableDesktop";
import { FilterSection } from "@/pages/Admin/ProductsComponent/FilterSection";

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
				<FilterSection />
			</div>

			<ProductTableMobile />
			<ProductTableDesktop />
		</div>
	);
}
