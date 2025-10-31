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
} from "@heroui/react";
import EditDetailInfoModal from "@/pages/Customer/CartPage/EditDetailModal/EditDetailModalIndex";
export default function CartItem({
	cartItemUser,
	value,
}: {
	cartItemUser: CartItemUser;
	value: string;
}) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	return (
		<>
			<Checkbox
				aria-label={cartItemUser.variant_snapshot.variant_name}
				classNames={{
					base: cn(
						"inline-flex max-w-full w-full bg-content1 m-0",
						"hover:bg-content2 items-center justify-start",
						"cursor-pointer rounded-lg p-0 border-2 border-transparent"
					),
					label: "w-full",
					wrapper: "flex flex-col ml-3",
				}}
				value={value}
				color="success"
			>
				<Card className="w-full shadow-none border-none bg-transparent">
					<CardBody className="flex flex-row gap-3 items-stretch">
						{/* image column */}
						<div className="relative w-[130px] shrink-0 self-stretch overflow-hidden rounded-sm">
							<Image
								alt={cartItemUser.variant_snapshot.variant_name}
								src={cartItemUser.item.item_img[0]}
								removeWrapper
								className="absolute inset-0 h-full w-full object-cover"
							/>
						</div>

						{/* content column */}
						<div className="flex flex-col justify-start items-start text-left flex-1">
							<div className="w-full flex flex-row justify-between items-center">
								<span className="text-sm sm:text-base text-default-700">
									{cartItemUser.variant_snapshot.variant_name}
								</span>
							</div>
							<Divider className="my-2" />
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
									{cartItemUser.quantity}
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
								<Link
									underline="hover"
									size="sm"
									color="success"
									onClick={() => onOpen()}
								>
									Edit or View Details &gt;
								</Link>
							</span>
						</div>
					</CardBody>
				</Card>
			</Checkbox>
			<EditDetailInfoModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				item={cartItemUser.item}
				selectedItemVariantUser={cartItemUser.variant_snapshot}
				selectedPriceVariantUser={cartItemUser.price_variant}
				selectedQuantityUser={cartItemUser.quantity}
			/>
		</>
	);
}
