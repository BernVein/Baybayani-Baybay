import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Skeleton,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { Variant } from "@/model/variant";
import useIsMobile from "@/lib/isMobile";
import ImageCarousel from "./ImageCarousel";
import InformationSection from "./InformationSection";
import Footer from "./Footer";
import { useFetchItemById } from "@/data/supabase/useFetchSingleItem";

export default function ItemInfoModal({
    isOpen,
    onOpenChange,
    itemId,
}: {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    itemId: string | number | null;
}) {
    const { item, loading } = useFetchItemById(itemId);
    // State for selected item variant
    const [selectedItemVariant, setSelectedItemVariant] =
        useState<Variant | null>(null);
    // State for selected image
    const [mainImg, setMainImg] = useState(item?.item_img?.[0] || "");
    // For mobile view, but its kinda useless
    const isMobile = useIsMobile();
    // State for selected price variant
    const [priceVariant, setPriceVariant] = useState<"Retail" | "Wholesale">(
        "Retail",
    );
    const [quantity, setQuantity] = useState(1);
    // Set default values when modal opens
    useEffect(() => {
        if (isOpen && item) {
            setPriceVariant("Retail");
            setQuantity(0);
        }
        if (item?.item_img?.[0]) {
            setMainImg(item.item_img[0]);
        }
        if (item?.item_variants?.length) {
            setSelectedItemVariant(item.item_variants[0]);
        }
    }, [isOpen, item]);

    useEffect(() => {
        setQuantity(0);
    }, [selectedItemVariant]);

    // Set default values when selected price variant changes
    useEffect(() => {
        if (!selectedItemVariant) return;

        const wholesaleMin = selectedItemVariant.variant_wholesale_item ?? 0;
        const hasWholesalePrice =
            selectedItemVariant.variant_price_wholesale != null;

        setPriceVariant(
            hasWholesalePrice && quantity >= wholesaleMin
                ? "Wholesale"
                : "Retail",
        );
    }, [selectedItemVariant, quantity]);

    useEffect(() => {
        if (isOpen && item) {
            document.title = `Baybayani | Shop | ${item.item_title}`;
        } else {
            document.title = "Baybayani | Shop"; // fallback when modal closes
        }
    }, [isOpen, item]);

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
                            {loading ? (
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Left: image */}
                                    <div className="w-full md:w-1/2">
                                        <Skeleton className="w-full aspect-square rounded-lg" />
                                        <div className="flex gap-2 mt-3">
                                            {Array.from({ length: 4 }).map(
                                                (_, i) => (
                                                    <Skeleton
                                                        key={i}
                                                        className="w-16 h-16 rounded-md"
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: info */}
                                    <div className="flex flex-col gap-4 w-full">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-2/3" />
                                    </div>
                                </div>
                            ) : (
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
                                            setQuantity={setQuantity}
                                            quantity={quantity}
                                        />
                                    </div>
                                </div>
                            )}
                        </ModalBody>

                        <ModalFooter className="flex justify-between items-center">
                            <Footer
                                selectedItem={item}
                                selectedItemVariant={selectedItemVariant}
                                quantity={quantity || null}
                                priceVariant={priceVariant}
                                onClose={onClose}
                            />
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
