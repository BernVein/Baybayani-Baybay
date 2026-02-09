import { supabase } from "@/config/supabaseclient";

export async function deleteCategory(categoryId: string) {
  try {
    // Check if any items are using this category
    const { count, error: countError } = await supabase
      .from("Item")
      .select("item_id", { count: "exact", head: true })
      .eq("category_id", categoryId)
      .eq("is_soft_deleted", false);

    if (countError) {
      return { success: false, error: countError.message };
    }

    if (count && count > 0) {
      return { success: false, error: "CATEGORY_IN_USE", count };
    }

    // Soft-delete the category
    const { error: deleteError } = await supabase
      .from("Category")
      .update({ is_soft_deleted: true })
      .eq("category_id", categoryId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }
    window.dispatchEvent(new Event("baybayani:update-table"));

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "UNKNOWN_ERROR" };
  }
}
