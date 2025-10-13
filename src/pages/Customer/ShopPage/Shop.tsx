import { Highlight } from "@/ui/hero-highlight";
import ShopItems from "./ShopItems";
import { Image } from "@heroui/react";

export default function Shop() {
	return (
		<div className="p-10 flex flex-col gap-7">
			{/* Hero section */}
			<div className="relative h-72 md:h-80 overflow-hidden rounded-2xl">
				{/* Image background */}
				<Image
					isZoomed
					alt="HeroUI hero Image"
					src="/cover.jpg"
					className="w-full h-full object-cover rounded-2xl z-0"
					removeWrapper
				/>

				{/* Feathered gradient overlay */}
				<div className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none" />

				{/* Text content */}
				<div className="absolute inset-0 flex flex-col justify-center items-start text-left z-20 px-10 md:px-16">
					<h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
						Welcome to
						<span className="text-[#36975f]"> BAYBAY</span>
						<span className="text-[#F9C424]">ANI</span>
					</h1>
					<p className="text-gray-200 mt-3 max-w-md text-lg">
						<span className="sm:text-base text-sm">
							Ani gikan sa Baybay <br></br>Para sa Baybayanon
						</span>
						<br></br>
						<Highlight className="font-bold sm:text-lg text-sm">
							PRESKO, LIMPYO, BARATO
						</Highlight>
					</p>
				</div>
			</div>

			<ShopItems />
		</div>
	);
}
