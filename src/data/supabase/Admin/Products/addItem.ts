import { supabase } from "@/config/supabaseclient";
import { ItemDB } from "@/model/db/additem";

export async function addItem(item: ItemDB) {
    try {
        // Insert Item
        const { data: newItem, error: itemError } = await supabase
            .from("Item")
            .insert({
                item_title: item.name,
                item_description: item.shortDescription ?? "",
                item_sold_by: item.unitOfMeasure,
                category_id: item.categoryId || null,
                tag_id: item.tagId || null,
                item_has_variant: item.variants.length > 1,
            })
            .select("*")
            .single();

        if (itemError || !newItem) {
            throw itemError || new Error("Failed to insert Item");
        }

        const itemId = newItem.item_id;

        // Insert Variants + StockMovement
        for (const variant of item.variants) {
            const { data: newVariant, error: variantError } = await supabase
                .from("Variant")
                .insert({
                    item_id: itemId,
                    variant_name: variant.name ?? "Default",
                    variant_stocks: 0, // will be deprecated, stocks handled in StockMovement
                    variant_price_retail: variant.retailPrice ?? 0,
                    variant_price_wholesale: variant.wholesalePrice ?? null,
                    variant_wholesale_item: variant.wholesaleMinQty ?? null,
                })
                .select("*")
                .single();

            if (variantError || !newVariant) {
                throw variantError || new Error("Failed to insert Variant");
            }

            const variantId = newVariant.variant_id;

            if (variant.stocks && variant.stocks > 0) {
                const { error: stockError } = await supabase
                    .from("StockMovement")
                    .insert({
                        variant_id: variantId,
                        stock_change_count: variant.stocks,
                        stock_adjustment_amount: variant.totalBuyingPrice ?? 0,
                        stock_supplier: variant.supplier ?? null,
                        stock_deliver_date: variant.dateDelivered ?? null,
                        stock_adjustment_type: "Acquisition",
                        effective_stocks: variant.stocks,
                    });
                if (stockError) throw stockError;
            }
        }

        // Upload Images
        for (const file of item.itemImages) {
            if (!file) continue;

            const fileExt = file.name.split(".").pop();
            const fileName = `item-${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExt}`;
            const filePath = `items/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("Images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const publicUrl = supabase.storage
                .from("Images")
                .getPublicUrl(filePath).data.publicUrl;

            await supabase.from("Item_Image").insert({
                item_id: itemId,
                item_image_url: publicUrl,
            });
        }

        return { success: true, itemId };
    } catch (error) {
        const message =
            error instanceof Error ? error.message : JSON.stringify(error);
        return { success: false, error: message };
    }
}
