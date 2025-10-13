import ShopItems from "./ShopItems";
import { Image } from "@heroui/react";

export default function Shop() {
	return (
		<div className="p-10 flex flex-col gap-7">
			<div className="h-72 md:h-80 overflow-hidden rounded-2xl">
				<Image
					alt="HeroUI hero Image"
					src="/cover.jpg"
					className="w-full h-full object-cover"
					removeWrapper
				/>
			</div>

			<ShopItems />
		</div>
	);
}
