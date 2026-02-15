import { supabase } from "@/config/supabaseclient";
import { Item } from "@/model/Item";

export async function editItemInfo(itemId: string, item: Item) {
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
