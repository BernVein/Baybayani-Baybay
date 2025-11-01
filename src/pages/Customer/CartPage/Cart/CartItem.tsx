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
} from "@heroui/react";
import { TrashIcon } from "@/components/icons";
import EditDetailInfoModal from "@/pages/Customer/CartPage/EditDetailModal/EditDetailModalIndex";
import DeleteCartItemModalIndex from "../DeleteCartItemModal/DeleteCartItemModalIndex";

export default function CartItem({
	cartItemUser,
	value,
}: {
	cartItemUser: CartItemUser;
	value: string;
}) {
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
	const variant = cartItemUser.variant_snapshot;
	const item = cartItemUser.item;

	// Determine availability
	let isAvailable = true;
	let unavailableReason = "";

	if (
		!item?.item_variants?.some((v) => v.variant_id === variant?.variant_id)
	) {
		isAvailable = false;
		unavailableReason = "This variant no longer exists for this item.";
	} else if (!variant || variant.variant_stocks <= 0) {
		isAvailable = false;
		unavailableReason = "This variant is out of stock.";
	} else if (cartItemUser.quantity > variant.variant_stocks) {
		isAvailable = false;
		unavailableReason = `Only ${variant.variant_stocks} ${item.item_sold_by} left in stock.`;
	} else if (item.is_soft_deleted || variant.is_soft_deleted) {
		isAvailable = false;
		unavailableReason = "This item or variant has been deleted.";
	}

	// Example delete handler
	const handleDelete = (id: string) => {
		console.log("Deleting cart item:", id);
		// TODO: call your delete API or mutation here
	};

	return (
		<div className="relative w-full">
			{/* Checkbox with product info */}
			<Checkbox
				aria-label={variant?.variant_name}
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
								alt={variant?.variant_name}
								src={item.item_img[0]}
								removeWrapper
								className="absolute inset-0 h-full w-full object-cover"
							/>
						</div>

						{/* Content column */}
						<div className="flex flex-col justify-start items-start text-left flex-1">
							<div className="w-full flex flex-col sm:flex-row sm:items-center sm:gap-2 text-left">
								<span className="text-sm sm:text-base text-default-700">
									{variant?.variant_name}
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
									{cartItemUser.subtotal.toLocaleString()}
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
					handleDelete(cartItemUser.cart_item_id);
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
				selectedItemVariantUser={cartItemUser.variant_snapshot}
				selectedPriceVariantUser={cartItemUser.price_variant}
				selectedQuantityUser={cartItemUser.quantity}
			/>

			<DeleteCartItemModalIndex
				isOpen={isOpenDeleteModal}
				onOpenChange={onOpenChangeDeleteModal}
				variant_name_to_delete={variant?.variant_name || ""}
			/>
		</div>
	);
}
