import { OrderCard } from "@/model/ui/order_card";
import {
    Card,
    CardBody,
    Image,
    Divider,
    Chip,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@heroui/react";
export default function OrderItem({
    orderItem,
    // onPress,
}: {
    orderItem: OrderCard;
    // onPress: () => void;
}) {
    console.log("Order item: ", orderItem);
    return (
        <div className="relative w-full rounded-lg">
            <Card
                // isPressable={isAvailable}
                // onPress={onPress}
                className="inline-flex max-w-full w-full bg-content1 m-0 hover:bg-content2 items-center justify-start rounded-lg p-0 border-2 border-transparent"
            >
                <CardBody className="flex flex-row gap-3 items-stretch">
                    {/* Image column */}
                    <div className="relative w-[100px] sm:w-[150px] shrink-0 self-stretch overflow-hidden rounded-sm">
                        <Image
                            alt={orderItem.variant_name}
                            src={orderItem.item_first_image}
                            removeWrapper
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <Chip className="absolute top-2 left-2 z-10" size="sm">
                            {orderItem.price_variant}
                        </Chip>
                    </div>

                    {/* Content column */}
                    <div className="flex flex-col justify-start items-start text-left flex-1">
                        <div className="w-full flex justify-between items-start">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-left">
                                <span className="text-sm sm:text-base text-default-700">
                                    {orderItem.variant_name}
                                </span>
                                <span className="text-xs sm:text-sm text-default-500">
                                    {orderItem.item_name}
                                </span>
                            </div>

                            <Chip size="sm">{orderItem.status}</Chip>
                        </div>
                        <Popover placement="bottom" showArrow={true}>
                            <PopoverTrigger>
                                <span className="text-default-500 text-xs italic max-w-[150px] truncate block cursor-pointer">
                                    Order ID: {orderItem.order_item_user_id}
                                </span>
                            </PopoverTrigger>
                            <PopoverContent>
                                <p className="text-bold text-sm">
                                    Order ID: {orderItem.order_item_user_id}
                                </p>
                            </PopoverContent>
                        </Popover>

                        <Divider className="my-3 sm:my-2" />

                        <div className="w-full flex flex-row justify-between items-center">
                            <span className="text-xs text-default-500">
                                Date Ordered
                            </span>
                            <span className="text-sm text-default-600">
                                {new Date(
                                    orderItem.date_ordered,
                                ).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                })}
                            </span>
                        </div>

                        <div className="w-full flex flex-row justify-between items-center">
                            <span className="text-xs text-default-500">
                                Quantity
                            </span>
                            <span className="text-sm text-default-600">
                                {orderItem.quantity} {orderItem.item_sold_by}s
                            </span>
                        </div>

                        <div className="w-full flex flex-row justify-between items-center">
                            <span className="text-xs text-default-500">
                                Subtotal
                            </span>
                            <span className="text-sm text-default-600">
                                ₱{orderItem.subtotal.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
