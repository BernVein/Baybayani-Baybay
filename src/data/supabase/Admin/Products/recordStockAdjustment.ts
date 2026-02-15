import { supabase } from "@/config/supabaseclient";
import { StockMovement } from "@/model/stockMovement";

export async function recordStockAdjustment(
	variantId: string,
	movement: StockMovement,
) {
	try {
		const { data: movementData, error: movementError } = await supabase
			.from("StockMovement")
			.insert({
				variant_id: variantId,
				stock_change_count: movement.stock_change_count,
				stock_adjustment_amount: movement.stock_adjustment_amount,
				stock_adjustment_type: movement.stock_adjustment_type,
				stock_supplier: movement.stock_supplier,
				stock_delivery_date: movement.stock_delivery_date,
				stock_change_date: movement.stock_change_date,
				stock_loss_reason: movement.stock_loss_reason,
				effective_stocks: movement.effective_stocks,
				is_soft_deleted: false,
			})
			.select()
			.single();

		if (movementError) throw movementError;

		// Dispatch refresh event
		window.dispatchEvent(new Event("baybayani:update-table"));

		return { success: true, movementId: movementData.stock_movement_id };
	} catch (error: any) {
		console.error("Error recording stock adjustment:", error);
		return { success: false, error: error.message };
	}
}
