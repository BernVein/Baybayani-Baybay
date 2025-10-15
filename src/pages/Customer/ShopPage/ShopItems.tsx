import ItemCard from "@/pages/Customer/ShopPage/ItemCard";
import { item } from "@/data/items";
import { Pagination } from "@heroui/react";
import { useState } from "react";

export default function ShopItems() {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 8;
	const totalPages = Math.ceil(item.length / itemsPerPage);
	const currentItems = item.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<div className="flex flex-col">
			<div className="gap-5 grid grid-cols-2 sm:grid-cols-4 mt-2 mb-2">
				{currentItems.map((data, index) => (
					<ItemCard
						item={data}
						index={(currentPage - 1) * itemsPerPage + index}
						key={index}
					/>
				))}
			</div>
			<div className="flex justify-center mt-4">
				<Pagination
					initialPage={currentPage}
					total={totalPages}
					onChange={(page) => setCurrentPage(page)}
					color="success"
					showControls
				/>
			</div>
		</div>
	);
}
