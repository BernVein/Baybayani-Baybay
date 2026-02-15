import { supabase } from "@/config/supabaseclient";
import { Variant } from "@/model/variant";

export async function addVariant(itemId: string, variant: Variant) {
	try {
		if (!itemId) throw new Error("Item ID is required");

		const { data: newVariant, error: variantError } = await supabase
			.from("Variant")
			.insert({
				item_id: itemId,
				variant_name: variant.variant_name ?? "Default",
				variant_price_retail: variant.variant_price_retail ?? 0,
				variant_price_wholesale:
					variant.variant_price_wholesale ?? null,
				variant_wholesale_item: variant.variant_wholesale_item ?? null,
				variant_low_stock_threshold:
					variant.variant_low_stock_threshold,
			})
			.select("*")
			.single();

		if (variantError || !newVariant) {
			throw variantError || new Error("Failed to insert Variant");
		}

		const variantId = newVariant.variant_id;

		// Initial stock movement
		if (
			variant.variant_stock_latest_movement.effective_stocks &&
			variant.variant_stock_latest_movement.effective_stocks > 0
		) {
			const { error: stockError } = await supabase
				.from("StockMovement")
				.insert({
					variant_id: variantId,
					stock_change_count:
						variant.variant_stock_latest_movement
							.stock_change_count ?? 0,
					stock_adjustment_amount:
						variant.variant_stock_latest_movement
							.stock_adjustment_amount,
					stock_supplier:
						variant.variant_stock_latest_movement.stock_supplier ??
						null,
					stock_delivery_date:
						variant.variant_stock_latest_movement
							.stock_delivery_date ?? null,
					stock_adjustment_type: "Acquisition",
					effective_stocks:
						variant.variant_stock_latest_movement.effective_stocks,
				});

			if (stockError) throw stockError;
		}

		window.dispatchEvent(new Event("baybayani:update-table"));

		return { success: true, variantId };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : JSON.stringify(error);

		return { success: false, error: message };
	}
}
