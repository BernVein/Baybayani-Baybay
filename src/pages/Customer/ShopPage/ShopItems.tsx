import ItemCard from "@/pages/Customer/ShopPage/ItemCard";
import { item } from "@/data/items";

export default function ShopItems() {
	return (
		<div className="gap-5 grid grid-cols-2 sm:grid-cols-4 mt-2 mb-2">
			{item.map((data, index) => (
				<ItemCard item={data} index={index} key={index} />
			))}
		</div>
	);
}
