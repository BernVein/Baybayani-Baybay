import { useEffect, useState } from "react";
import { supabase } from "@/config/supabaseclient";

export const useFetchCart = () => {
	const [cartData, setCartData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	useEffect(() => {
		const fetchCart = async () => {
			setLoading(true);
			setErrorMsg(null);

			const { data, error } = await supabase.from("Cart").select(`
          *,
          CartItemUser (
            *,
            Item (*),
            VariantSnapshot (*)
          )
        `);

			if (error) {
				console.error("❌ Supabase fetchCart error:", error);
				setErrorMsg(error.message);
			} else {
				console.log("🛒 Full cart with related data:", data);
				setCartData(data);
			}

			setLoading(false);
		};

		fetchCart();
	}, []);

	return { cartData, loading, errorMsg };
};
