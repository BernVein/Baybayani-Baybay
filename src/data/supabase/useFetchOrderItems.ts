import { useEffect, useState } from "react";
import { supabase } from "@/config/supabaseclient";

export const useFetchOrderItems = (userId: string) => {
	const [data, setData] = useState<any[]>([]);
	const [error, setError] = useState<any>(null);

	useEffect(() => {
		if (!userId) return;

		const fetchData = async () => {
			const { data, error } = await supabase
				.from("OrderItemUser")
				.select(
					`*, Item(*, Item_Image(item_image_url)), VariantSnapshot(*)`
				)
				.eq("user_id", userId)
				.eq("is_soft_deleted", false);

			if (error) setError(error);
			else setData(data ?? []);
		};

		fetchData();
	}, [userId]);

	return { data, error };
};
