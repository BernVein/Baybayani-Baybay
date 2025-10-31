import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/react";
import { useState, useEffect, useRef } from "react";
import { Item } from "@/model/Item";
import { Variant } from "@/model/variant";
import useIsMobile from "@/lib/isMobile";
import ImageCarousel from "./ImageCarousel";
import InformationSection from "./InformationSection";
import Footer from "./Footer";

export default function EditDetailInfoModal({
	isOpen,
	onOpenChange,
	item,
	selectedItemVariantUser,
	selectedPriceVariantUser,
	selectedQuantityUser,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	item: Item | null;
	selectedPriceVariantUser: string;
	selectedItemVariantUser: Variant | null;
	selectedQuantityUser: number;
}) {
	// State for selected item variant
	const [selectedItemVariant, setSelectedItemVariant] =
		useState<Variant | null>(selectedItemVariantUser);
	// State for selected image
	const [mainImg, setMainImg] = useState(item?.item_img?.[0] || "");
	// For mobile view, but its kinda useless
	const isMobile = useIsMobile();
	// State for selected price variant
	const [selectedPriceVariant, setSelectedPriceVariant] = useState(
		selectedPriceVariantUser
	);

	// State for quantity, raw quantity is the term
	// cause in wholesale, its being multiplied by wholesale_item
	const [rawQuantity, setRawQuantity] = useState(selectedQuantityUser);
	// Calculate actual quantity based on selected price variant
	const actualQuantity =
		selectedPriceVariant === "Wholesale"
			? rawQuantity * (selectedItemVariant?.variant_wholesale_item ?? 1)
			: rawQuantity;

	const hasMounted = useRef(false);

	// When modal opens, initialize once
	useEffect(() => {
		if (isOpen && item) {
			setSelectedItemVariant(selectedItemVariantUser);
			setSelectedPriceVariant(selectedPriceVariantUser);
			setRawQuantity(selectedQuantityUser);
			setMainImg(item.item_img?.[0] || "");
			hasMounted.current = true; // ✅ mark initialized
		}
	}, [isOpen, item]);

	// Only reset price when user changes variant (not on first open)
	useEffect(() => {
		if (!selectedItemVariant) return;

		// skip the first run on modal open
		if (!hasMounted.current) return;

		setRawQuantity(1);
		setSelectedPriceVariant("Retail");
	}, [selectedItemVariant]);

	useEffect(() => {
		if (isOpen && item) {
			document.title = `Baybayani | Cart | ${item.item_title}`;
		} else {
			document.title = "Baybayani | Cart"; // fallback when modal closes
		}
	}, [isOpen, item]);
	// Reset quantity when price variant changes
	useEffect(() => {
		if (
			selectedPriceVariant === "Wholesale" ||
			selectedPriceVariant === "Retail"
		) {
			setRawQuantity(1);
		}
	}, [selectedPriceVariant]);

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
								{item.item_title || "Sample Item"}
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
