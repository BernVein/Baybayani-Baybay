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
import ImageCarousel from "@/pages/Customer/ShopPage/ItemInfoModal/ImageCarousel";
import InformationSection from "@/pages/Customer/ShopPage/ItemInfoModal/InformationSection";
import Footer from "@/pages/Customer/ShopPage/ItemInfoModal/Footer";
import { useFetchItemById } from "@/data/supabase/Customer/Products/useFetchSingleItem";

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
    const isMobile = useIsMobile();

    const [selectedItemVariant, setSelectedItemVariant] =
        useState<Variant | null>(null);
    const [mainImg, setMainImg] = useState<string>("");
    const [quantity, setQuantity] = useState<number | null>(null);
    const [priceVariant, setPriceVariant] = useState<"Retail" | "Wholesale">(
        "Retail",
    );

    // Populate states when item data is fetched
    useEffect(() => {
        if (item) {
            setMainImg(item.item_img?.[0] || "");
            setSelectedItemVariant(item.item_variants?.[0] || null);
            setQuantity(null);
            setPriceVariant("Retail");
        } else {
            // Reset states when item is null (loading new item)
            setMainImg("");
            setSelectedItemVariant(null);
            setQuantity(null);
            setPriceVariant("Retail");
        }
    }, [item]);

    // Update price variant based on quantity & selected variant
    useEffect(() => {
        if (!selectedItemVariant) return;

        const wholesaleMin = selectedItemVariant.variant_wholesale_item ?? 0;
        const hasWholesalePrice =
            selectedItemVariant.variant_price_wholesale != null;

        setPriceVariant(
            hasWholesalePrice && quantity! >= wholesaleMin
                ? "Wholesale"
                : "Retail",
        );
    }, [selectedItemVariant, quantity]);

    // Update document title
    useEffect(() => {
        document.title =
            isOpen && item
                ? `Baybayani | Shop | ${item.item_title}`
                : "Baybayani | Shop";
    }, [isOpen, item]);

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="2xl"
            scrollBehavior="inside"
            classNames={{
                header: "border-b-[1px] border-[rgba(41,47,70,0.4)]",
                footer: "border-t-[1px] border-[rgba(41,47,70,0.4)]",
            }}
            disableAnimation
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-2">
                            <h2 className="text-lg font-semibold">
                                {loading
                                    ? "Loading..."
                                    : item?.item_title || "Item"}
                            </h2>
                        </ModalHeader>

                        <ModalBody>
                            {loading || !item ? (
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Left: Skeleton Images */}
                                    <div className="w-full md:w-1/2 flex flex-col gap-2">
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

                                    {/* Right: Skeleton Info */}
                                    <div className="flex flex-col gap-4 w-full">
                                        <Skeleton className="h-6 w-3/4 rounded-md" />
                                        <Skeleton className="h-4 w-1/2 rounded-md" />
                                        <Skeleton className="h-10 w-full rounded-md" />
                                        <Skeleton className="h-10 w-full rounded-md" />
                                        <Skeleton className="h-10 w-2/3 rounded-md" />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Left: Carousel */}
                                    <div className="flex flex-col items-center md:sticky md:items-start gap-2 top-4 w-full self-start">
                                        <ImageCarousel
                                            item_title={item.item_title}
                                            item_tag={item.item_tag ?? null}
                                            allImg={item.item_img}
                                            mainImg={mainImg}
                                            setMainImg={setMainImg}
                                            isMobile={isMobile}
                                        />
                                    </div>

                                    {/* Right: Information */}
                                    <div className="flex flex-col gap-4 justify-start w-full mt-3">
                                        <InformationSection
                                            item={item}
                                            selectedItemVariant={
                                                selectedItemVariant
                                            }
                                            setSelectedItemVariant={
                                                setSelectedItemVariant
                                            }
                                            quantity={quantity!}
                                            setQuantity={setQuantity}
                                        />
                                    </div>
                                </div>
                            )}
                        </ModalBody>

                        <ModalFooter className="flex justify-between items-center">
                            <Footer
                                item_id={item?.item_id || ""}
                                item_sold_by={item?.item_sold_by || ""}
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
