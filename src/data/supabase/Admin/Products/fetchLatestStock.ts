import { supabase } from "@/config/supabaseclient";

export async function fetchLatestStock(variantId: string) {
	try {
		const { data, error } = await supabase
			.from("StockMovement")
			.select("effective_stocks")
			.eq("variant_id", variantId)
			.eq("is_soft_deleted", false)
			.order("created_at", { ascending: false })
			.limit(1)
			.maybeSingle();

		if (error) throw error;

		return { success: true, effectiveStocks: data?.effective_stocks ?? 0 };
	} catch (error: any) {
		console.error("Error fetching latest stock:", error);
		return { success: false, error: error.message };
	}
}
