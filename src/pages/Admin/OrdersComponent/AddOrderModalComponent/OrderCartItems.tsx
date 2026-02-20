import { Button, Divider, CheckboxGroup, Skeleton } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

import { TrashIcon } from "@/components/icons";
import { deleteMultipleCartItems } from "@/data/supabase/Customer/Cart/deleteMultipleCartItems";
import { useFetchCartItemsUI } from "@/data/supabase/Customer/Cart/useFetchCartItemsUI";
import CartItem from "@/pages/Customer/CartPage/Cart/CartItem";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";

export function OrderCartItems({
	selectedCartItem,
	setSelectedCartItem,
}: {
	selectedCartItem: string[];
	setSelectedCartItem: React.Dispatch<React.SetStateAction<string[]>>;
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	const { user } = useAuth();
	const { items, loading, refetch } = useFetchCartItemsUI(user?.id ?? "");
	const totalSubtotal = useMemo(
		() =>
			items
				.filter((cartItem) =>
					selectedCartItem.includes(cartItem.cart_item_user_id),
				)
				.reduce((sum, cartItem) => sum + cartItem.subtotal, 0),
		[items, selectedCartItem],
	);

	useEffect(() => {
		setSelectedCartItem(
			items.map((cartItem) => cartItem.cart_item_user_id),
		);
	}, [items]);

	const handleDeleteSelected = async () => {
		if (selectedCartItem.length === 0) return;
		setIsDeleting(true);
		try {
			await deleteMultipleCartItems(selectedCartItem);
			await refetch();
			setSelectedCartItem([]);
		} catch (error) {
			console.error("Batch delete failed:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	useEffect(() => {
		const handleCartUpdate = () => refetch();

		window.addEventListener("baybayani:cart-updated", handleCartUpdate);

		return () =>
			window.removeEventListener(
				"baybayani:cart-updated",
				handleCartUpdate,
			);
	}, [refetch]);

	if (loading) {
		return (
			<div className="flex flex-col gap-3 mt-4">
				{[...Array(3)].map((_, i) => (
					<div
						key={i}
						className="flex items-center gap-3 p-3 rounded-lg"
					>
						<Skeleton className="h-12 w-12 rounded-md" />
						<div className="flex flex-col gap-2 flex-1">
							<Skeleton className="h-4 w-3/4 rounded-md" />
							<Skeleton className="h-3 w-1/2 rounded-md" />
						</div>
						<Skeleton className="h-6 w-10 rounded-md" />
					</div>
				))}
			</div>
		);
	}

	return (
		<>
			{items.length > 0 && (
				<div className="flex flex-col gap-3 mt-4">
					<div className="flex justify-between items-center px-1">
						<div className="flex flex-col items-start gap-1">
							<span className="text-sm font-semibold text-default-700">
								Selected Items ({selectedCartItem.length}/
								{items.length})
							</span>
							<span className="text-sm font-bold text-success-600">
								Total: ₱{totalSubtotal.toLocaleString()}
							</span>
						</div>
						<Button
							color="danger"
							isDisabled={
								selectedCartItem.length === 0 || isDeleting
							}
							isLoading={isDeleting}
							size="sm"
							startContent={<TrashIcon className="size-4" />}
							onPress={handleDeleteSelected}
						>
							Delete Selected
						</Button>
					</div>
					<Divider />
					<div className="max-h-[400px] overflow-y-auto pr-2 flex flex-col gap-3">
						<CheckboxGroup
							value={selectedCartItem}
							onValueChange={(value) =>
								setSelectedCartItem(value as string[])
							}
						>
							{items.map((item) => (
								<CartItem
									key={item.cart_item_user_id}
									cartItemUserId={item.cart_item_user_id}
									value={item.cart_item_user_id}
									onDeleted={refetch}
									onUpdated={refetch}
								/>
							))}
						</CheckboxGroup>
					</div>
				</div>
			)}
		</>
	);
}
