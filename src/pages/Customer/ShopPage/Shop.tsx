import ShopItems from "@/pages/Customer/ShopPage/ShopItems";
import ImageHeader from "./ImageHeader";
import Categories from "./Categories";

export default function Shop() {
	return (
		<div className="p-5 sm:p-10 flex flex-col gap-7 md:w-3/4 mx-auto items-center">
			<ImageHeader />
			<Categories />

			<ShopItems />
		</div>
	);
}
