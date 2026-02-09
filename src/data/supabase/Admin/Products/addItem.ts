import { supabase } from "@/config/supabaseclient";
import { Item } from "@/model/Item";

export async function addItem(item: Item) {
    try {
        // Insert Item
        const { data: newItem, error: itemError } = await supabase
            .from("Item")
            .insert({
                item_title: item.item_title,
                item_description: item.item_description ?? "",
                item_sold_by: item.item_sold_by ?? "",
                category_id: item.item_category_id || null,
                tag_id: item.item_tag_id || null,
                item_has_variant: item.item_has_variant,
            })
            .select("*")
            .single();

        if (itemError || !newItem) {
            throw itemError || new Error("Failed to insert Item");
        }

        const itemId = newItem.item_id;

        // Insert Variants + StockMovement
        for (const variant of item.item_variants) {
            const { data: newVariant, error: variantError } = await supabase
                .from("Variant")
                .insert({
                    item_id: itemId,
                    variant_name: variant.variant_name ?? "Default",
                    variant_price_retail: variant.variant_price_retail ?? 0,
                    variant_price_wholesale:
                        variant.variant_price_wholesale ?? null,
                    variant_wholesale_item:
                        variant.variant_wholesale_item ?? null,
                })
                .select("*")
                .single();

            if (variantError || !newVariant) {
                throw variantError || new Error("Failed to insert Variant");
            }

            const variantId = newVariant.variant_id;

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
                            variant.variant_stock_latest_movement
                                .stock_supplier ?? null,
                        stock_deliver_date:
                            variant.variant_stock_latest_movement
                                .stock_delivery_date ?? null,
                        stock_adjustment_type: "Acquisition",

                        effective_stocks:
                            variant.variant_stock_latest_movement
                                .effective_stocks,
                    });

                if (stockError) throw stockError;
            }
        }

        // Upload Images
        for (const img of item.item_img) {
            if (!(img instanceof File)) continue;

            const fileExt = img.name.split(".").pop();
            const fileName = `item-${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExt}`;
            const filePath = `items/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("Images")
                .upload(filePath, img);

            if (uploadError) throw uploadError;

            const publicUrl = supabase.storage
                .from("Images")
                .getPublicUrl(filePath).data.publicUrl;

            await supabase.from("Item_Image").insert({
                item_id: itemId,
                item_image_url: publicUrl,
            });
        }

        window.dispatchEvent(new Event("baybayani:update-table"));

        return { success: true, itemId };
    } catch (error) {
        const message =
            error instanceof Error ? error.message : JSON.stringify(error);

        return { success: false, error: message };
    }
}
