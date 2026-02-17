import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Spinner,
	addToast,
} from "@heroui/react";
import { useState, useEffect } from "react";

import { SearchBarAutocomplete } from "./AddOrderModalComponent/SearchBarAutocomplete";

import ItemInfoModal from "@/pages/Customer/ShopPage/ItemInfoModal/ItemInfoModalIndex";
import { deleteMultipleCartItems } from "@/data/supabase/Customer/Cart/deleteMultipleCartItems";
import { OrderCartItems } from "@/pages/Admin/OrdersComponent/AddOrderModalComponent/OrderCartItems";
import { useFetchCartItems } from "@/data/supabase/Customer/Cart/useFetchCartItem";
import { addOrderItems } from "@/data/supabase/Customer/Orders/addOrderItems";

export function AddOrderModal({
	isOpenAddOrder,
	onOpenChangeAddOrder,
}: {
	isOpenAddOrder: boolean;
	onOpenChangeAddOrder: () => void;
}) {
	const [selectedCartItem, setSelectedCartItem] = useState<string[]>([]);
	const [itemId, setItemId] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [isAddToCartLoading, setIsAddToCartLoading] = useState(false);

	useEffect(() => {
		document.title = isOpenAddOrder
			? "Baybayani | Admin | Orders | Add Order"
			: "Baybayani | Admin | Orders";
	}, [isOpenAddOrder, onOpenChangeAddOrder]);

	const {
		isOpen: isOpenItemInfo,
		onOpen: onOpenItemInfo,
		onOpenChange: onOpenChangeItemInfo,
	} = useDisclosure();

	const handleClose = async () => {
		setIsLoading(true);
		if (cartItems.length > 0) {
			const allIds = cartItems.map(
				(cartItem) => cartItem.cart_item_user_id,
			);

			try {
				await deleteMultipleCartItems(allIds);
			} catch (error) {
				console.error("Failed to clear cart on modal close:", error);
			}
		}

		setItemId("");
		setIsLoading(false);
		onOpenChangeAddOrder();
	};

	const { cartItems } = useFetchCartItems(selectedCartItem);

	const handleCheckout = async (onClose: () => void) => {
		try {
			setIsAddToCartLoading(true);
			await addOrderItems(
				"cb20faec-72c0-4c22-b9d4-4c50bfb9e66f",
				cartItems,
			);

			addToast({
				title: "Order Placed",
				description: `${cartItems.length} item${cartItems.length !== 1 ? "s" : ""} added to order`,
				color: "success",
				shouldShowTimeoutProgress: true,
			});
			onClose();
		} catch (err) {
			addToast({
				title: "Error",
				description: "Something went wrong",
				color: "danger",
				shouldShowTimeoutProgress: true,
			});
		} finally {
			setIsAddToCartLoading(false);
		}
	};

	return (
		<>
			<Modal
				disableAnimation
				closeButton={
					isLoading ? <Spinner color="danger" size="sm" /> : undefined
				}
				isDismissable={false}
				isOpen={isOpenAddOrder}
				scrollBehavior="inside"
				size="xl"
				onOpenChange={(open) => {
					if (!open) {
						handleClose();
					}
				}}
			>
				<ModalContent>
					<>
						<ModalHeader className="flex flex-col gap-1">
							<div className="flex flex-col gap-2">
								<span className="text-lg font-semibold">
									Add Order
								</span>
								<span className="text-sm text-default-500 italic">
									Changes here are temporary. The order will
									be officially added only when you click the{" "}
									<span className="text-success-500 font-semibold">
										Add Order
									</span>{" "}
									button below.
								</span>
							</div>
						</ModalHeader>
						<ModalBody className="flex flex-col gap-2">
							<p className="text-sm text-default-500">
								Note: When adding an order, the name will
								automatically be set to{" "}
								<span className="font-semibold text-default-700">
									Bern Vein Balermo
								</span>
								, the admin currently logged in.
							</p>
							<SearchBarAutocomplete
								setItemId={setItemId}
								onOpenItemInfo={onOpenItemInfo}
							/>

							<OrderCartItems
								selectedCartItem={selectedCartItem}
								setSelectedCartItem={setSelectedCartItem}
							/>
						</ModalBody>

						<ModalFooter className="justify-end items-center">
							<div className="flex gap-2">
								<Button
									color="danger"
									isLoading={isLoading}
									variant="light"
									onPress={handleClose}
								>
									Cancel
								</Button>
								<Button
									color="success"
									isDisabled={selectedCartItem.length === 0}
									isLoading={isAddToCartLoading}
									onPress={() => handleCheckout(handleClose)}
								>
									Add Order
								</Button>
							</div>
						</ModalFooter>
					</>
				</ModalContent>
			</Modal>
			<ItemInfoModal
				isAdmin={true}
				isOpen={isOpenItemInfo}
				itemId={itemId}
				onOpenChange={onOpenChangeItemInfo}
			/>
		</>
	);
}
