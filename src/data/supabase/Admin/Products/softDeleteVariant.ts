import { supabase } from "@/config/supabaseclient";

export async function softDeleteVariant(variantId: string) {
	try {
		const { error } = await supabase
			.from("Variant")
			.update({ is_soft_deleted: true })
			.eq("variant_id", variantId);

		if (error) throw error;

		// Dispatch refresh event
		window.dispatchEvent(new Event("refresh-products"));

		return { success: true };
	} catch (error: any) {
		console.error("Error soft deleting variant:", error);
		return { success: false, error: error.message };
	}
}
