import { useState, useEffect } from "react";

import { supabase } from "@/config/supabaseclient";

export interface NavbarItem {
	item_id: string;
	item_title: string;
}

export const useFetchNavbarItems = () => {
	const [items, setItems] = useState<NavbarItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchItems = async () => {
			setLoading(true);
			try {
				const { data, error } = await supabase
					.from("Item")
					.select(
						`
                        item_id, 
                        item_title,
                        Variant (
                            is_soft_deleted,
                            StockMovement (
                                effective_stocks,
                                created_at
                            )
                        )
                    `,
					)
					.eq("is_soft_deleted", false)
					.order("item_title", { ascending: true })
					.order("created_at", {
						referencedTable: "Variant.StockMovement",
						ascending: false,
					});

				if (error) throw error;

				const mapped = (data ?? [])
					.map((row: any) => {
						const variants = (row.Variant ?? []).filter(
							(v: any) => !v.is_soft_deleted,
						);

						const totalStock = variants.reduce(
							(sum: number, v: any) => {
								const latest =
									v.StockMovement?.[0]?.effective_stocks ?? 0;
								return sum + latest;
							},
							0,
						);

						if (totalStock <= 0) return null;

						return {
							item_id: row.item_id,
							item_title: row.item_title,
						};
					})
					.filter(Boolean) as NavbarItem[];

				setItems(mapped);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchItems();
	}, []);

	return { items, loading, error };
};
