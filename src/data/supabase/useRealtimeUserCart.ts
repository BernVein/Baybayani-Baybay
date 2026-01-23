import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";
import { CartItemUser } from "@/model/cartItemUser";

export const useRealtimeUserCart = (userId: string | null) => {
    const [cartItems, setCartItems] = useState<CartItemUser[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCartItems = useCallback(async () => {
        if (!userId) {
            setCartItems([]);
            return;
        }

        setLoading(true);

        // Join Cart to filter by user_id
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

        if (error) {
            console.error("Failed to fetch cart items:", error);
            setCartItems([]);
        } else {
            setCartItems(data ?? []);
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
                    // Listen to all changes, will refetch after filtering by user_id
                },
                () => fetchCartItems(),
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, fetchCartItems]);

    return { cartItems, loading, refetch: fetchCartItems };
};
