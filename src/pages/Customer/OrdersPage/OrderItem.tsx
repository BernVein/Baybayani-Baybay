import { OrderItemUser } from "@/model/orderItemUser";
import { Card, CardBody, Image, Divider, Chip } from "@heroui/react";
export default function OrderItem({
    orderItemUser,
    onPress,
}: {
    orderItemUser: OrderItemUser;
    onPress: () => void;
}) {
    // Frozen snapshot of the variant when added to cart
    const variant_snapshot = orderItemUser.variant_snapshot;
    const item = orderItemUser.item;

    // Find the live variant from the item variants using the snapshot's variant_id
    const liveVariant = item.item_variants.find(
        (v) => v.variant_id === variant_snapshot.variant_copy_snapshot_id,
    );

    // Determine availability
    let isAvailable = true;
    let unavailableReason = "";

    // Check if the variant still exists
    if (
        !item?.item_variants?.some(
            (v) => v.variant_id === variant_snapshot?.variant_copy_snapshot_id,
        )
    ) {
        isAvailable = false;
        unavailableReason = "This variant no longer exists for this item.";
    }
    // Check if item or variant snapshot is deleted
    else if (item.is_soft_deleted || variant_snapshot.is_soft_deleted) {
        isAvailable = false;
        unavailableReason = "This item or variant has been deleted.";
    }
    // Even if snapshot exists, if the *live* variant is soft deleted, treat as non-existent
    else if (liveVariant?.is_soft_deleted) {
        isAvailable = false;
        unavailableReason = "This variant no longer exists for this item.";
    }
    // Check stock levels
    else if (!liveVariant || liveVariant.variant_stocks <= 0) {
        isAvailable = false;
        unavailableReason = "This variant is out of stock.";
    }
    // Check if requested quantity exceeds stock
    else if (orderItemUser.quantity > liveVariant.variant_stocks) {
        isAvailable = false;
        unavailableReason = `Only ${liveVariant.variant_stocks} ${item.item_sold_by} left in stock.`;
    }
    console.log({ isAvailable, unavailableReason });

    return (
        <div className="relative w-full rounded-lg">
            {/* Checkbox with product info */}

            <Card
                isPressable={isAvailable}
                onPress={onPress}
                className="inline-flex max-w-full w-full bg-content1 m-0 hover:bg-content2 items-center justify-start cursor-pointer rounded-lg p-0 border-2 border-transparent"
            >
                <CardBody className="flex flex-row gap-3 items-stretch">
                    {/* Image column */}
                    <div className="relative w-[100px] sm:w-[150px] shrink-0 self-stretch overflow-hidden rounded-sm">
                        <Image
                            alt={variant_snapshot?.variant_snapshot_name}
                            src={item.item_img[0]}
                            removeWrapper
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <Chip className="absolute top-2 left-2 z-10" size="sm">
                            {orderItemUser.price_variant}
                        </Chip>
                    </div>

                    {/* Content column */}
                    <div className="flex flex-col justify-start items-start text-left flex-1">
                        <div className="w-full flex justify-between items-start">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-left">
                                <span className="text-sm sm:text-base text-default-700">
                                    {variant_snapshot?.variant_snapshot_name}
                                </span>
                                <span className="text-xs sm:text-sm text-default-500">
                                    {item.item_title}
                                </span>
                            </div>

                            <Chip size="sm">{orderItemUser.status}</Chip>
                        </div>

                        <Divider className="my-3 sm:my-2" />

                        <div className="w-full flex flex-row justify-between items-center">
                            <span className="text-xs text-default-500">
                                Date Ordered
                            </span>
                            <span className="text-sm text-default-600">
                                {new Date(
                                    orderItemUser.created_at,
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
                                {orderItemUser.quantity} {item.item_sold_by}s
                            </span>
                        </div>

                        <div className="w-full flex flex-row justify-between items-center">
                            <span className="text-xs text-default-500">
                                Subtotal
                            </span>
                            <span className="text-sm text-default-600">
                                ₱{orderItemUser.subtotal.toLocaleString()}
                            </span>
                        </div>

                        <div className="flex w-full justify-end">
                            <span
                                className={`text-sm italic ${
                                    isAvailable
                                        ? "text-success-500"
                                        : "text-red-500"
                                }`}
                            >
                                {isAvailable
                                    ? "Select to view"
                                    : unavailableReason}
                            </span>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
