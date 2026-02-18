import { useState, useEffect, useMemo } from "react";
import {
	Card,
	CardBody,
	CheckboxGroup,
	Button,
	Skeleton,
	Divider,
	Link,
	useDisclosure,
	Checkbox,
} from "@heroui/react";

import useIsMobile from "@/lib/isMobile";
import { AddToCart, CartIcon, BaybayaniLogo } from "@/components/icons";
import CartItem from "@/pages/Customer/CartPage/Cart/CartItem";
import CheckoutModalIndex from "@/pages/Customer/CartPage/CheckoutModal/CheckoutModalIndex";
import DeleteMultipleCartItemsModal from "@/pages/Customer/CartPage/DeleteCartItemModal/DeleteMultipleCartItemsModal";
import { useFetchCartItemsUI } from "@/data/supabase/Customer/Cart/useFetchCartItemsUI";
import { TrashIcon } from "@/components/icons";
export default function Cart() {
	const [selectedItemsId, setSelectedItemsId] = useState<string[]>([]);
	const {
		isOpen: checkoutModalIsOpen,
		onOpen: checkoutModalOnOpen,
		onOpenChange: checkoutModalOnOpenChange,
	} = useDisclosure();

	const {
		isOpen: deleteMultipleModalIsOpen,
		onOpen: deleteMultipleModalOnOpen,
		onOpenChange: deleteMultipleModalOnOpenChange,
	} = useDisclosure();

	const isMobile = useIsMobile();
	const { items, loading, errorMsg, refetch } = useFetchCartItemsUI(
		"a1dfb44e-2079-4810-bc12-a5c901b72437",
	);

	useEffect(() => {
		const handleCartUpdate = () => refetch();

		window.addEventListener("baybayani:cart-updated", handleCartUpdate);

		return () => {
			window.removeEventListener(
				"baybayani:cart-updated",
				handleCartUpdate,
			);
		};
	}, [refetch]);

	const allCartItems = items ?? [];

	const selectedSubtotal = useMemo(
		() =>
			allCartItems
				.filter((i) => selectedItemsId.includes(i.cart_item_user_id))
				.reduce((sum, i) => sum + i.subtotal, 0),
		[selectedItemsId, allCartItems],
	);

	useEffect(() => {
		setSelectedItemsId((prev) => {
			const validIds = new Set(
				allCartItems.map((i) => i.cart_item_user_id),
			);
			const next = prev.filter((id) => validIds.has(id));

			if (next.length === prev.length) return prev;

			return next;
		});
	}, [allCartItems]);

	const allIds = useMemo(
		() => allCartItems.map((i) => i.cart_item_user_id),
		[allCartItems],
	);

	const isAllSelected =
		allIds.length > 0 && selectedItemsId.length === allIds.length;

	const isIndeterminate =
		selectedItemsId.length > 0 && selectedItemsId.length < allIds.length;

	return (
		<>
			{/* Header */}
			<div className="flex justify-between items-center w-full md:w-3/4 md:mx-auto px-5">
				<div className="flex items-center gap-2">
					<BaybayaniLogo className="size-7" />
					<h2 className="text-xl sm:text-3xl font-semibold">
						Baybayani <span className="text-default-400">|</span>{" "}
						Cart
					</h2>
				</div>

				{errorMsg ? (
					<span className="text-danger text-sm">{errorMsg}</span>
				) : loading && !allCartItems.length ? (
					<>
						<Skeleton className="h-4 w-32 rounded-lg" />
					</>
				) : (
					<>
						<span className="text-default-500 text-sm">
							{allCartItems.length < 1
								? "No items in Cart"
								: `${allCartItems.length} ${allCartItems.length === 1 ? "item" : "items"} in Cart`}
						</span>
					</>
				)}
			</div>

			{!loading && allCartItems.length === 0 ? (
				<div className="flex flex-col items-center justify-center w-full md:w-3/4 md:mx-auto py-16 px-5 text-center">
					<CartIcon className="size-40" />

					<h3 className="text-xl font-semibold mb-2">
						Your cart is empty
					</h3>
					<p className="text-default-500 mb-6">
						Looks like you haven't added anything yet.
					</p>

					<Link href="/">
						<Button
							color="default"
							startContent={<BaybayaniLogo className="size-5" />}
						>
							Go to Shop
						</Button>
					</Link>
				</div>
			) : (
				<div className="flex flex-col sm:flex-row gap-3 w-full md:w-3/4 md:mx-auto p-5">
					<div className="sm:w-3/4">
						<div className="flex justify-between items-center mb-2">
							<Checkbox
								color="success"
								isDisabled={allIds.length === 0}
								isIndeterminate={isIndeterminate}
								isSelected={isAllSelected}
								onValueChange={(checked) => {
									setSelectedItemsId(checked ? allIds : []);
								}}
							>
								Select All
							</Checkbox>

							<Button
								color="danger"
								isDisabled={selectedItemsId.length === 0}
								startContent={<TrashIcon className="size-4" />}
								onPress={deleteMultipleModalOnOpen}
							>
								Remove Selected{" "}
								{selectedItemsId.length === 0
									? ""
									: `(${selectedItemsId.length})`}
							</Button>
						</div>

						{/* Left side: cart list or skeletons */}
						<CheckboxGroup
							key="cart-group"
							className="mb-3"
							value={selectedItemsId}
							onChange={(val) => {
								if (Array.isArray(val)) setSelectedItemsId(val);
							}}
						>
							{loading && !allCartItems.length ? (
								<>
									{[...Array(3)].map((_, i) => (
										<div
											key={`skeleton-${i}`}
											className="relative w-full shadow-sm border border-default-200 rounded-lg"
										>
											<Card className="w-full shadow-none border-none bg-transparent">
												<CardBody className="flex flex-row gap-3 items-stretch">
													{/* Image */}
													<Skeleton className="w-[100px] sm:w-[150px] h-[90px] rounded-sm" />

													{/* Content */}
													<div className="flex flex-col flex-1 gap-2">
														<Skeleton className="h-4 w-3/4 rounded-md" />
														<Skeleton className="h-3 w-1/2 rounded-md" />

														<Skeleton className="h-3 w-full rounded-md" />
														<Skeleton className="h-3 w-full rounded-md" />
														<Skeleton className="h-3 w-2/3 rounded-md" />

														<div className="flex justify-end mt-3">
															<Skeleton className="h-8 w-32 rounded-lg" />
														</div>
													</div>
												</CardBody>
											</Card>

											{/* Trash button skeleton */}
											<Skeleton className="absolute top-2 right-3 h-8 w-8 rounded-full" />
										</div>
									))}
								</>
							) : (
								allCartItems.map((cart_item) => (
									<CartItem
										key={cart_item.cart_item_user_id}
										cartItemUserId={
											cart_item.cart_item_user_id
										}
										value={cart_item.cart_item_user_id}
										onDeleted={() => refetch()}
										onUpdated={() => refetch()}
									/>
								))
							)}
						</CheckboxGroup>
					</div>
					{/* Right side: Order summary skeleton */}
					<Card
						className="w-full sm:w-1/4 self-start sticky top-42 bottom-23 z-20 shadow-sm border border-default-200 rounded-lg"
						isBlurred={isMobile}
					>
						<CardBody className="gap-1">
							{loading && !allCartItems.length ? (
								<>
									<Skeleton className="h-5 w-32 mb-3 rounded-md" />
									<Divider className="my-1" />
									<Skeleton className="h-3 w-full mb-2 rounded-md" />
									<Skeleton className="h-3 w-2/3 mb-4 rounded-md" />
									<Skeleton className="h-10 w-full rounded-lg" />
								</>
							) : (
								<>
									<span className="mb-2">Order Summary</span>
									<div className="w-full flex flex-row mb-2 justify-between items-center">
										<span className="text-xs text-default-500">
											Total Price
										</span>
										<span className="text-default-600 font-bold">
											₱{selectedSubtotal.toLocaleString()}
										</span>
									</div>
									<Button
										color="success"
										isDisabled={
											selectedItemsId.length === 0
										}
										startContent={
											<AddToCart className="size-6" />
										}
										onPress={checkoutModalOnOpen}
									>
										Proceed to Checkout
									</Button>
								</>
							)}
						</CardBody>
					</Card>
				</div>
			)}
			<CheckoutModalIndex
				checkoutModalIsOpen={checkoutModalIsOpen}
				checkoutModalOnOpenChange={checkoutModalOnOpenChange}
				selectedItemsId={selectedItemsId}
				selectedSubtotal={selectedSubtotal}
			/>
			<DeleteMultipleCartItemsModal
				isOpen={deleteMultipleModalIsOpen}
				selectedItemsId={selectedItemsId}
				onDeleted={() => {
					refetch();
					setSelectedItemsId([]);
				}}
				onOpenChange={deleteMultipleModalOnOpenChange}
			/>
		</>
	);
}
