import { Image, Chip, ScrollShadow } from "@heroui/react";

export default function ImageCarousel({
    item_title,
    item_tag,
    mainImg,
    allImg,
    setMainImg,
    isMobile,
}: {
    item_title: string;
    item_tag: string | null;
    mainImg: string;
    allImg: string[];
    setMainImg: (url: string) => void;
    isMobile: boolean;
}) {
    return (
        <>
            <div className="relative">
                <Image
                    alt={item_title || "Sample Item"}
                    src={mainImg}
                    isZoomed={!isMobile}
                    width={isMobile ? 250 : 300}
                    className="rounded-xl"
                />
                {item_tag && (
                    <Chip className="absolute top-2 left-2 z-10" size="sm">
                        {item_tag}
                    </Chip>
                )}
            </div>
            <ScrollShadow
                orientation="horizontal"
                className="w-3/4 lg:w-full scrollbar-hide"
            >
                {allImg.length > 1 && (
                    <div
                        className="
							flex gap-2 mt-3
							w-full pb-3 justify-start
						"
                        style={{
                            scrollSnapType: "x mandatory",
                        }}
                    >
                        {allImg.map((url, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 scroll-snap-align-start"
                                style={{
                                    scrollSnapAlign: "start",
                                }}
                            >
                                <Image
                                    alt={item_title || "Sample Item"}
                                    src={url}
                                    onClick={() => setMainImg(url)}
                                    width={url === mainImg ? 65 : 70}
                                    className={`cursor-pointer transition-all duration-200 ${
                                        url === mainImg
                                            ? "opacity-70 border-2 border-green-400"
                                            : "hover:opacity-80"
                                    }`}
                                    isZoomed={!isMobile}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </ScrollShadow>
        </>
    );
}
