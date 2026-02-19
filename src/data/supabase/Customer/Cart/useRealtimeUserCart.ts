import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";
import { CartItemUser } from "@/model/cartItemUser";

export const useRealtimeUserCart = (userId: string | null) => {
	const [cartItems, setCartItems] = useState<CartItemUser[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchCartItems = useCallback(async () => {
		if (!userId) {
			setCartItems([]);
			setLoading(false);
			return;
		}

		setLoading(true);

		const { data, error } = await supabase
			.from("CartItemUser")
			.select(
				`
        *,
        parentCart:cart_id(user_id)
      `,
			)
			.eq("parentCart.user_id", userId)
			.eq("is_soft_deleted", false);

		if (!error) {
			setCartItems(data ?? []);
		} else {
			setCartItems([]);
		}

		setLoading(false);
	}, [userId]);

	useEffect(() => {
		fetchCartItems();
	}, [fetchCartItems]);

	useEffect(() => {
		if (!userId) return;

		const channel = supabase
			.channel(`cart-items-${userId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "CartItemUser",
				},
				async () => {
					// debounce-style protection to prevent rapid double fetch
					await fetchCartItems();
				},
			)
			.subscribe();

		const handleManualUpdate = () => fetchCartItems();
		window.addEventListener("baybayani:cart-updated", handleManualUpdate);

		return () => {
			supabase.removeChannel(channel);
			window.removeEventListener(
				"baybayani:cart-updated",
				handleManualUpdate,
			);
		};
	}, [userId, fetchCartItems]);

	return { cartItems, loading, refetch: fetchCartItems };
};
