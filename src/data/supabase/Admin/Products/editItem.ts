import { supabase } from "@/config/supabaseclient";
import { Item } from "@/model/Item";
import { Variant } from "framer-motion";

export async function editItem(itemId: string, item: Item) {
	try {
		if (itemId.trim() == "") throw new Error("Item ID is required");
		// Item
		const { error: itemError } = await supabase
			.from("Item")
			.update({
				item_title: item.item_title,
				item_description: item.item_description ?? "",
				item_sold_by: item.item_sold_by ?? "",
				category_id: item.item_category_id || null,
				tag_id: item.item_tag_id || null,
				item_has_variant: item.item_has_variant,
			})
			.eq("item_id", itemId);

		if (itemError) throw itemError;

		// Variants
		const { data: existingVariants } = await supabase
			.from("Variant")
			.select("variant_id")
			.eq("item_id", itemId);

		const existingVariantIds =
			existingVariants?.map((v) => v.variant_id) ?? [];

		const updatedVariantIds: string[] = [];

		for (const variant of item.item_variants) {
			if (variant.variant_id) {
				// Update existing
				const { error } = await supabase
					.from("Variant")
					.update({
						variant_name: variant.variant_name ?? "Default",
						variant_price_retail: variant.variant_price_retail ?? 0,
						variant_price_wholesale:
							variant.variant_price_wholesale ?? null,
						variant_wholesale_item:
							variant.variant_wholesale_item ?? null,
						variant_low_stock_threshold:
							variant.variant_low_stock_threshold ?? null,
					} as Variant)
					.eq("variant_id", variant.variant_id);

				if (error) throw error;

				updatedVariantIds.push(variant.variant_id);
			} else {
				// Insert new
				const { data: newVariant, error } = await supabase
					.from("Variant")
					.insert({
						item_id: itemId,
						variant_name: variant.variant_name ?? "Default",
						variant_price_retail: variant.variant_price_retail ?? 0,
						variant_price_wholesale:
							variant.variant_price_wholesale ?? null,
						variant_wholesale_item:
							variant.variant_wholesale_item ?? null,
						variant_low_stock_threshold:
							variant.variant_low_stock_threshold ?? null,
						is_soft_deleted: false, // revive softdeleted variant
					} as Variant)
					.select("*")
					.single();

				if (error || !newVariant)
					throw error || new Error("Variant insert failed");

				updatedVariantIds.push(newVariant.variant_id);
			}
		}

		// Delete removed variants
		const variantsToSoftDelete = existingVariantIds.filter(
			(id) => !updatedVariantIds.includes(id),
		);

		if (variantsToSoftDelete.length > 0) {
			const { error: softDeleteError } = await supabase
				.from("Variant")
				.update({ is_soft_deleted: true })
				.in("variant_id", variantsToSoftDelete);

			if (softDeleteError) throw softDeleteError;
		}

		// Fetch existing images from DB
		const { data: existingImages } = await supabase
			.from("Item_Image")
			.select("item_image_url")
			.eq("item_id", itemId);

		const existingImageUrls =
			existingImages?.map((img) => img.item_image_url) ?? [];

		// Separate string URLs and File objects
		const keptUrls: string[] = [];
		const newFiles: File[] = [];

		for (const img of item.item_img) {
			if (typeof img === "string") {
				keptUrls.push(img);
			} else if (img instanceof File) {
				newFiles.push(img);
			}
		}

		// Upload new files
		const uploadedUrls: string[] = [];

		for (const file of newFiles) {
			const fileExt = file.name.split(".").pop();
			const fileName = `item-${Date.now()}-${Math.floor(
				Math.random() * 10000,
			)}.${fileExt}`;
			const filePath = `items/${fileName}`;

			const { error: uploadError } = await supabase.storage
				.from("Images")
				.upload(filePath, file);

			if (uploadError) throw uploadError;

			const publicUrl = supabase.storage
				.from("Images")
				.getPublicUrl(filePath).data.publicUrl;

			uploadedUrls.push(publicUrl);
		}

		const finalImageUrls = [...keptUrls, ...uploadedUrls];

		// Determine removed images
		const removedImages = existingImageUrls.filter(
			(url) => !finalImageUrls.includes(url),
		);

		// Delete removed image references from DB
		if (removedImages.length > 0) {
			await supabase
				.from("Item_Image")
				.delete()
				.eq("item_id", itemId)
				.in("item_image_url", removedImages);
		}

		// Insert new uploaded images
		for (const url of uploadedUrls) {
			await supabase.from("Item_Image").insert({
				item_id: itemId,
				item_image_url: url,
			});
		}

		window.dispatchEvent(new Event("baybayani:update-table"));

		return { success: true };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : JSON.stringify(error);

		return { success: false, error: message };
	}
}
