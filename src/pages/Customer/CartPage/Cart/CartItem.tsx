import { CartItemUser } from "@/model/cartItemUser";
import {
	Card,
	CardBody,
	Checkbox,
	cn,
	Image,
	Divider,
	Link,
	useDisclosure,
	Button,
	Skeleton,
} from "@heroui/react";
import { TrashIcon } from "@/components/icons";
import EditDetailInfoModal from "@/pages/Customer/CartPage/EditDetailModal/EditDetailModalIndex";
import DeleteCartItemModalIndex from "../DeleteCartItemModal/DeleteCartItemModalIndex";
export default function CartItem({
	cartItemUser,
	value,
	isLoading,
}: {
	cartItemUser: CartItemUser;
	value: string;
	isLoading: boolean;
}) {
	if (isLoading) {
		return (
			<div className="relative w-full">
				<Card className="w-full shadow-none border-none bg-transparent">
					<CardBody className="flex flex-row gap-3 items-stretch">
						{/* Image skeleton */}
						<Skeleton className="w-[100px] sm:w-[150px] rounded-sm" />

						{/* Content skeleton */}
						<div className="flex flex-col flex-1 gap-1">
							<Skeleton className="h-3 w-1/2 rounded" />

							<Divider className="my-3 sm:my-2" />

							<Skeleton className="h-3 w-1/4 rounded" />
							<Skeleton className="h-3 w-1/4 rounded" />
							<Skeleton className="h-3 w-1/4 rounded" />
							<Skeleton className="h-3 w-2/3 rounded" />
						</div>
					</CardBody>
				</Card>
			</div>
		);
	}
	const {
		isOpen: isOpenEditModal,
		onOpen: onOpenEditModal,
		onOpenChange: onOpenChangeEditModal,
	} = useDisclosure();

	const {
		isOpen: isOpenDeleteModal,
		onOpen: onOpenDeleteModal,
		onOpenChange: onOpenChangeDeleteModal,
	} = useDisclosure();

	// Frozen snapshot of the variant when added to cart
	const variant_snapshot = cartItemUser.variant_snapshot;
	const item = cartItemUser.item;

	// Find the live variant from the item variants using the snapshot's variant_id
	const liveVariant = item.item_variants.find(
		(v) => v.variant_id === variant_snapshot.variant_copy_snapshot_id
	);

	// Determine availability
	let isAvailable = true;
	let unavailableReason = "";

	// Check if the variant still exists
	if (
		!item?.item_variants?.some(
			(v) => v.variant_id === variant_snapshot?.variant_copy_snapshot_id
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
	else if (cartItemUser.quantity > liveVariant.variant_stocks) {
		isAvailable = false;
		unavailableReason = `Only ${liveVariant.variant_stocks} ${item.item_sold_by} left in stock.`;
	}

	// Example delete handler
	// const handleDelete = (id: string) => {
	// 	console.log("Deleting cart item:", id);
	// 	// TODO: call your delete API or mutation here
	// };

	return (
		<div className="relative w-full">
			{/* Checkbox with product info */}
			<Checkbox
				aria-label={variant_snapshot?.variant_snapshot_name}
				isDisabled={!isAvailable}
				value={value}
				color="success"
				classNames={{
					base: cn(
						"inline-flex max-w-full w-full bg-content1 m-0",
						"hover:bg-content2 items-center justify-start",
						"cursor-pointer rounded-lg p-0 border-2 border-transparent"
					),
					label: "w-full",
					wrapper: "flex flex-col ml-3",
				}}
			>
				<Card className="w-full shadow-none border-none bg-transparent">
					<CardBody className="flex flex-row gap-3 items-stretch">
						{/* Image column */}
						<div className="relative w-[100px] sm:w-[150px] shrink-0 self-stretch overflow-hidden rounded-sm">
							<Image
								alt={variant_snapshot?.variant_snapshot_name}
								src={item.item_img[0]}
								removeWrapper
								className="absolute inset-0 h-full w-full object-cover"
							/>
						</div>

						{/* Content column */}
						<div className="flex flex-col justify-start items-start text-left flex-1">
							<div className="w-full flex flex-col sm:flex-row sm:items-center sm:gap-2 text-left">
								<span className="text-sm sm:text-base text-default-700">
									{variant_snapshot?.variant_snapshot_name}
								</span>
								<span className="text-xs sm:text-sm text-default-500">
									{item.item_title}
								</span>
							</div>

							<Divider className="my-3 sm:my-2" />

							<div className="w-full flex flex-row justify-between items-center">
								<span className="text-xs text-default-500">
									Price Variant
								</span>
								<span className="text-sm text-default-600">
									{cartItemUser.price_variant}
								</span>
							</div>

							<div className="w-full flex flex-row justify-between items-center">
								<span className="text-xs text-default-500">
									Quantity
								</span>
								<span className="text-sm text-default-600">
									{cartItemUser.quantity} {item.item_sold_by}s
								</span>
							</div>

							<div className="w-full flex flex-row justify-between items-center">
								<span className="text-xs text-default-500">
									Subtotal
								</span>
								<span className="text-sm text-default-600">
									₱{cartItemUser.subtotal.toLocaleString()}
								</span>
							</div>

							<span className="block w-full text-end text-default-500 text-sm mt-3 z-10">
								{!isAvailable ? (
									<span className="text-danger text-xs italic">
										{unavailableReason}
									</span>
								) : (
									<Link
										underline="hover"
										size="sm"
										color="success"
										onClick={(e) => {
											e.preventDefault();
											onOpenEditModal();
										}}
									>
										Edit or View Details &gt;
									</Link>
								)}
							</span>
						</div>
					</CardBody>
				</Card>
			</Checkbox>

			{/* Delete Button (always active) */}
			<Button
				size="sm"
				isIconOnly
				color="danger"
				className="absolute top-2 right-3 z-20"
				onPress={() => {
					// handleDelete(cartItemUser.cart_item_user_id);
					onOpenDeleteModal();
				}}
			>
				<TrashIcon className="size-4" />
			</Button>

			{/* Edit Details Modal */}
			<EditDetailInfoModal
				isOpen={isOpenEditModal}
				onOpenChange={onOpenChangeEditModal}
				item={cartItemUser.item}
				selectedItemVariantUser={liveVariant ?? null}
				selectedPriceVariantUser={cartItemUser.price_variant}
				selectedQuantityUser={cartItemUser.quantity}
			/>

			<DeleteCartItemModalIndex
				isOpen={isOpenDeleteModal}
				onOpenChange={onOpenChangeDeleteModal}
				variant_name_to_delete={liveVariant?.variant_name || ""}
			/>
		</div>
	);
}
