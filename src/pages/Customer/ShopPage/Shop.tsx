import ShopItems from "@/pages/Customer/ShopPage/ShopItems";
import ImageHeader from "./ImageHeader";

export default function Shop() {
	return (
		<div className="p-10 flex flex-col gap-7">
			<ImageHeader />
			<ShopItems />
		</div>
	);
}
