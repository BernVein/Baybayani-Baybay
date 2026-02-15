import { supabase } from "@/config/supabaseclient";

export async function softDeleteItem(itemId: string) {
	try {
		// Soft delete the item
		const { error: itemError } = await supabase
			.from("Item")
			.update({ is_soft_deleted: true })
			.eq("item_id", itemId);

		if (itemError) throw itemError;

		// Also soft delete all its variants
		const { error: variantError } = await supabase
			.from("Variant")
			.update({ is_soft_deleted: true })
			.eq("item_id", itemId);

		if (variantError) throw variantError;

		// Dispatch refresh event
		window.dispatchEvent(new Event("baybayani:update-table"));

		return { success: true };
	} catch (error: any) {
		console.error("Error soft deleting item:", error);
		return { success: false, error: error.message };
	}
}
