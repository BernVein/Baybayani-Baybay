"use client";
import { ScrollShadow } from "@heroui/react";

import ProductListItem from "./product-list-item";
import products from "./products";

export default function Shop() {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="my-auto flex w-full max-w-7xl flex-col items-center justify-center gap-2">
				<ScrollShadow
					className="flex w-full snap-x justify-center gap-6 px-6 py-5"
					orientation="horizontal"
					size={20}
				>
					{products.map((product) => (
						<ProductListItem
							key={product.id}
							{...product}
							className="snap-start"
						/>
					))}
				</ScrollShadow>
			</div>
		</div>
	);
}
