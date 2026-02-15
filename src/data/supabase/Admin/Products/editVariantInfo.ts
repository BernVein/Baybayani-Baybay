import { supabase } from "@/config/supabaseclient";
import { Variant } from "@/model/variant";

export async function editVariantInfo(variantId: string, variant: Variant) {
	try {
		if (!variantId) throw new Error("Variant ID is required");

		const { error } = await supabase
			.from("Variant")
			.update({
				variant_name: variant.variant_name,
				variant_price_retail: variant.variant_price_retail,
				variant_price_wholesale:
					variant.variant_price_wholesale ?? null,
				variant_wholesale_item: variant.variant_wholesale_item ?? null,
				variant_low_stock_threshold:
					variant.variant_low_stock_threshold,
				variant_last_updated_price_retail: new Date().toISOString(),
				variant_last_updated_price_wholesale:
					variant.variant_price_wholesale
						? new Date().toISOString()
						: null,
			})
			.eq("variant_id", variantId);

		if (error) throw error;

		window.dispatchEvent(new Event("baybayani:update-table"));

		return { success: true };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : JSON.stringify(error);

		return { success: false, error: message };
	}
}
