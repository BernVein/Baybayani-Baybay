import { Highlight } from "@/ui/hero-highlight";
import { Image } from "@heroui/react";

export default function ImageHeader() {
	return (
		<div className="relative h-50 md:h-70 overflow-hidden rounded-2xl">
			{/* Image background */}
			<Image
				alt="HeroUI hero Image"
				src="/cover.jpg"
				className="w-full h-auto object-cover rounded-2xl z-0"
			/>

			{/* Feathered gradient overlay */}
			<div className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none" />

			{/* Text content */}
			<div className="absolute inset-0 flex flex-col justify-center items-start text-left z-20 px-10 md:px-16 space-y-3">
				<h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
					Welcome to
					<span className="text-[#36975f]"> BAYBAY</span>
					<span className="text-[#F9C424]">ANI</span>
				</h1>

				<div className="text-gray-200 max-w-md">
					<p className="sm:text-base text-sm leading-snug">
						Ani gikan sa Baybay
						<br />
						Para sa Baybayanon
					</p>

					<Highlight className="font-bold sm:text-lg text-sm inline-block">
						PRESKO, LIMPYO, BARATO
					</Highlight>
				</div>
			</div>
		</div>
	);
}
