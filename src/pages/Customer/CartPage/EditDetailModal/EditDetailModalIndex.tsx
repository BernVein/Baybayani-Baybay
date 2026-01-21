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
import { CartItemUser } from "@/model/cartItemUser";

export default function EditDetailInfoModal({
    cartItemUser,
    isOpen,
    onOpenChange,
    item,
    selectedItemVariantUser,
    selectedPriceVariantUser,
    selectedQuantityUser,
    onUpdated,
}: {
    cartItemUser: CartItemUser;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    item: Item | null;
    selectedPriceVariantUser: string;
    selectedItemVariantUser: Variant | null;
    selectedQuantityUser: number;
    onUpdated?: () => Promise<void> | void;
}) {
    // State for selected item variant
    const [selectedItemVariant, setSelectedItemVariant] =
        useState<Variant | null>(selectedItemVariantUser);
    // State for selected image
    const [mainImg, setMainImg] = useState(item?.item_img?.[0] || "");
    // For mobile view, but its kinda useless
    const isMobile = useIsMobile();
    // State for selected price variant
    const [priceVariant, setPriceVariant] = useState(selectedPriceVariantUser);

    // State for quantity, raw quantity is the term
    // cause in wholesale, its being multiplied by wholesale_item
    const [quantity, setQuantity] = useState(selectedQuantityUser);

    const hasMounted = useRef(false);

    // When modal opens, initialize once
    useEffect(() => {
        if (isOpen && item) {
            setSelectedItemVariant(selectedItemVariantUser);
            setPriceVariant(selectedPriceVariantUser);
            setQuantity(selectedQuantityUser);
            setMainImg(item.item_img?.[0] || "");
            hasMounted.current = true; // mark initialized
        }
    }, [isOpen, item]);

    // Only reset price when user changes variant (not on first open)
    useEffect(() => {
        if (!selectedItemVariant) return;

        // Only reset if the selected variant is different from the user's initial variant
        if (
            selectedItemVariant.variant_id !==
            selectedItemVariantUser?.variant_id
        ) {
            setQuantity(0);
            setPriceVariant("Retail");
        }
    }, [selectedItemVariant, selectedItemVariantUser]);

    useEffect(() => {
        if (isOpen && item) {
            document.title = `Baybayani | Cart | ${item.item_title}`;
        } else {
            document.title = "Baybayani | Cart"; // fallback when modal closes
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
                                <span className="mr-1">
                                    {selectedItemVariant?.variant_name ||
                                        "Variant Error"}{" "}
                                    Details
                                </span>
                                <span className="text-default-500 font-medium text-base">
                                    - {item.item_title || "Name Error"}
                                </span>
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
                                        quantity={quantity}
                                        setQuantity={setQuantity}
                                    />
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter className="flex justify-between items-center">
                            <Footer
                                cartItemUser={cartItemUser}
                                selectedItemVariant={selectedItemVariant}
                                priceVariant={priceVariant}
                                quantity={quantity}
                                onClose={onClose}
                                onUpdated={onUpdated}
                            />
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
