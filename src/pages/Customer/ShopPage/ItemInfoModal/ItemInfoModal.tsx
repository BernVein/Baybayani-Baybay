import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { Item } from "@/model/Item";
import { ItemVariant } from "@/model/itemVariant";
import useIsMobile from "@/lib/isMobile";
import ImageCarousel from "./ImageCarousel";
import InformationSection from "./InformationSection";
import Footer from "./Footer";

export default function ItemInfoModal({
	isOpen,
	onOpenChange,
	item,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	item: Item | null;
}) {
	// State for selected item variant
	const [selectedItemVariant, setSelectedItemVariant] =
		useState<ItemVariant | null>(null);
	// State for selected image
	const [mainImg, setMainImg] = useState(item?.img?.[0] || "");
	// For mobile view, but its kinda useless
	const isMobile = useIsMobile();
	// State for selected price variant
	const [selectedPriceVariant, setSelectedPriceVariant] = useState("Retail");
	// State for quantity, raw quantity is the term
	// cause in wholesale, its being multiplied by wholesale_item
	const [rawQuantity, setRawQuantity] = useState(1);
	// Calculate actual quantity based on selected price variant
	const actualQuantity =
		selectedPriceVariant === "Wholesale"
			? rawQuantity * (selectedItemVariant?.wholesale_item ?? 1)
			: rawQuantity;

	// Set default values when modal opens
	useEffect(() => {
		if (isOpen && item) {
			setSelectedPriceVariant("Retail");
			setRawQuantity(1);
		}
		if (item?.img?.[0]) {
			setMainImg(item.img[0]);
		}
		if (item?.variants?.length) {
			setSelectedItemVariant(item.variants[0]);
		}
	}, [isOpen, item]);

	// Set default values when selected price variant changes
	useEffect(() => {
		if (!selectedItemVariant) return;
		setRawQuantity(1);
		setSelectedPriceVariant("Retail");
	}, [selectedItemVariant]);

	if (!item) return null;

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			classNames={{
				header: "border-b-[1px] border-[rgba(41,47,70,0.4)]",
				footer: "border-t-[1px] border-[rgba(41,47,70,0.4)]",
			}}
			size="2xl"
			scrollBehavior="inside"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-2">
							<h2 className="text-lg font-semibold">
								{item.title || "Sample Item"}
							</h2>
						</ModalHeader>

						<ModalBody>
							<div className="flex flex-col md:flex-row gap-6">
								<div className="flex flex-col items-center md:sticky md:items-start gap-2 top-4 w-full self-start">
									{/* Left: Carousel */}
									<ImageCarousel
										item={item}
										mainImg={mainImg}
										setMainImg={setMainImg}
										isMobile={isMobile}
									/>
								</div>

								{/* Right: Info */}
								<div className="flex flex-col gap-4 justify-start w-full mt-3">
									<InformationSection
										item={item}
										selectedItemVariant={
											selectedItemVariant
										}
										setSelectedItemVariant={
											setSelectedItemVariant
										}
										selectedPriceVariant={
											selectedPriceVariant
										}
										setSelectedPriceVariant={
											setSelectedPriceVariant
										}
										rawQuantity={rawQuantity}
										setRawQuantity={setRawQuantity}
									/>
								</div>
							</div>
						</ModalBody>

						<ModalFooter className="flex justify-between items-center">
							<Footer
								selectedItemVariant={selectedItemVariant}
								selectedPriceVariant={selectedPriceVariant}
								rawQuantity={rawQuantity}
								actualQuantity={actualQuantity}
								onClose={onClose}
							/>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
