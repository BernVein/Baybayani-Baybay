import { Card, Chip, CardBody, CardFooter, Image } from "@heroui/react";

export default function ItemCard({
    item_category,
    item_tag,
    item_title,
    item_first_img,
    item_first_variant_retail_price,
    item_sold_by,
    index,
    onPress,
}: {
    item_category: string;
    item_tag: string | null;
    item_title: string;
    item_first_img: string;
    item_first_variant_retail_price: number;
    item_sold_by: string;
    index: number;
    onPress: () => void;
}) {
    return (
        <Card
            isPressable
            key={index}
            shadow="sm"
            onPress={onPress}
            className="transform transition-transform duration-300 hover:scale-105 cursor-pointer shadow-sm border border-default-200 rounded-2xl"
        >
            <CardBody className="overflow-visible p-0">
                <div className="relative">
                    <Image
                        isZoomed
                        alt={item_title}
                        className="w-full object-cover h-[140px] rounded-lg shadow-sm"
                        src={item_first_img}
                        width="100%"
                    />
                    {item_tag && (
                        <Chip className="absolute top-2 left-2 z-10" size="sm">
                            {item_tag}
                        </Chip>
                    )}
                </div>
            </CardBody>

            <CardFooter className="text-small items-start">
                <div className="flex flex-col w-full items-center lg:items-start">
                    <b className="font-extralight text-center lg:text-left text-xs lg:text-sm">
                        {item_category}
                    </b>
                    <b className="text-center lg:text-left text-base lg:text-xl">
                        {item_title}
                    </b>

                    <div className="flex flex-col w-full text-default-500 space-y-2">
                        {/* Retail */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-start">
                            <p>
                                <span className="font-semibold text-base">
                                    ₱
                                    {item_first_variant_retail_price.toFixed(
                                        2,
                                    )}{" "}
                                </span>
                                <span>per {item_sold_by}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
